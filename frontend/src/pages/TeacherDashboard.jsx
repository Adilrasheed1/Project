import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShareScreen } from "../components/ShareScreen"; // adjust path if your components folder is elsewhere
import { TutorTestCompo } from "../components/TutorTestCompo";

const sidebarItems = [
    { icon: "⊞", label: "Dashboard", page: "dashboard" },
     { icon: "", label: "Doubts", page: "courses" },
    { icon: "👥", label: "Students", page: "students" },
    { icon: "💰", label: "Earnings", page: "earnings" },
    { icon: "📝", label: "Tests", page: "tests" },
];

const subjectOptions = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science"];
const colorSwatches = ["#4FB88A", "#7A73D8", "#E89B3C", "#D8493F", "#4A90D9", "#333333"];

const API =  `${import.meta.env.VITE_API_URL}/api/teacher-courses`;;

const emptyForm = { title: "", subject: "", price: "", description: "", color: "#4FB88A" };

const newId = () => `id_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export function TeacherDashboard() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const teacher = JSON.parse(localStorage.getItem("user") || "{}");

    const [activeTab, setActiveTab] = useState("dashboard");
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState({
        stats: { totalStudents: 0, totalCourses: 0, monthEarnings: 0, avgRating: "0.0" },
        courses: [],
        recentStudents: [],
    });

    const [showUpload, setShowUpload] = useState(false);
    const [editingId, setEditingId] = useState(null); // null = creating, else editing this course id
    const [uploadForm, setUploadForm] = useState(emptyForm);

    const [thumbFile, setThumbFile] = useState(null);
    const [existingThumbUrl, setExistingThumbUrl] = useState("");

    // lectures[]: [{ id, title, videoFile, videoUrl, notes: [{ id, title, file, fileUrl }] }]
    const [lectures, setLectures] = useState([]);

    const [saving, setSaving] = useState(false);

    const setU = (k) => (e) => setUploadForm({ ...uploadForm, [k]: e.target.value });

    // ───────────────────────── WebRTC / calling state ─────────────────────────
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [socket, setSocket] = useState(null);
    const pcRef = useRef(null);
    const [request, setRequest] = useState(null);
    const [incomingCall, setIncomingCall] = useState(false);
    const [inCall, setInCall] = useState(false);
    const pendingCandidates = useRef([]);
    const [muted, setMuted] = useState(false);
    const [camOff, setCamOff] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
      const ws = new WebSocket(import.meta.env.VITE_WS_URL);

        ws.onopen = () => {
            console.log("Tutor WebSocket Connected");
            ws.send(JSON.stringify({ type: 'tutor' }));
        };

        ws.onmessage = async (event) => {
            console.log("MESSAGE RECEIVED:", event.data);
            const msg = JSON.parse(event.data);
            console.log(msg);

            if (msg.type === "request_taken") {
                setIncomingCall(false);
                setRequest(null);
                alert("Another tutor accepted this request.");
            }

            if (msg.type === "incoming_request") { setIncomingCall(true); }

            if (msg.type === "iceCandidate" && msg.candidate) {
                if (pcRef.current && pcRef.current.remoteDescription) {
                    try {
                        await pcRef.current.addIceCandidate(new RTCIceCandidate(msg.candidate));
                        console.log("ICE candidate added");
                    } catch (err) { console.error("ICE ERROR:", err); }
                } else {
                    console.log("Queueing ICE candidate");
                    pendingCandidates.current.push(msg.candidate);
                }
            }

            if (msg.type === "offer") {
                const pc = new RTCPeerConnection({
                    iceServers: [
                        { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
                        {
                            urls: ["turn:192.158.29.39:3478?transport=udp", "turn:192.158.29.39:3478?transport=tcp"],
                            username: "28224511:1379330808",
                            credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
                        },
                    ],
                });
                pcRef.current = pc;

                pc.onicecandidate = (e) => {
                    if (e.candidate) { ws.send(JSON.stringify({ type: "iceCandidate", candidate: e.candidate })); }
                };

                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (localVideoRef.current) { localVideoRef.current.srcObject = stream; }
                stream.getTracks().forEach(track => pc.addTrack(track, stream));

                pc.ontrack = (event) => {
                    console.log("REMOTE STREAM RECEIVED");
                    if (remoteVideoRef.current) { remoteVideoRef.current.srcObject = event.streams[0]; }
                };

                await pc.setRemoteDescription(msg.sdp);
                for (const candidate of pendingCandidates.current) {
                    try {
                        await pc.addIceCandidate(new RTCIceCandidate(candidate));
                        console.log("Queued ICE added");
                    } catch (err) { console.error("Queued ICE error:", err); }
                }
                pendingCandidates.current = [];
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                ws.send(JSON.stringify({ type: "answer", sdp: answer }));
            }
        };

        setSocket(ws);
    }, []);

    // --- call timer ---
    useEffect(() => {
        if (inCall) {
            setCallDuration(0);
            timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [inCall]);

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s2 = (sec % 60).toString().padStart(2, '0');
        return `${m}:${s2}`;
    };

    function accept() {
        console.log("Accepted request:", request);
        socket?.send(JSON.stringify({ type: "accept" }));
        setIncomingCall(false);
        setRequest(null);
        setInCall(true);
    }

    function toggleMute() {
        if (localVideoRef.current?.srcObject) {
            const track = localVideoRef.current.srcObject.getAudioTracks()[0];
            if (track) { track.enabled = !track.enabled; setMuted(m => !m); }
        }
    }

    function toggleCam() {
        if (localVideoRef.current?.srcObject) {
            const track = localVideoRef.current.srcObject.getVideoTracks()[0];
            if (track) { track.enabled = !track.enabled; setCamOff(c => !c); }
        }
    }
    // ─────────────────────── end WebRTC / calling state ───────────────────────

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        setLoading(true);
        try {
            const res = await fetch(`${API}/dashboard`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) setDashboard(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    function openCreateModal() {
        setEditingId(null);
        setUploadForm(emptyForm);
        setThumbFile(null);
        setExistingThumbUrl("");
        setLectures([]);
        setShowUpload(true);
    }

    function openEditModal(course) {
        setEditingId(course._id);
        setUploadForm({
            title: course.title || "",
            subject: course.subject || "",
            price: course.price || "",
            description: course.description || "",
            color: course.color || "#4FB88A",
        });
        setThumbFile(null);
        setExistingThumbUrl(course.thumbnailUrl || "");

        const loadedLectures = (course.lectures || []).map((l) => ({
            id: newId(),
            title: l.title || "",
            videoFile: null,
            videoUrl: l.videoUrl || "",
            notes: (l.notes || []).map((n) => ({
                id: newId(),
                title: n.title || "",
                file: null,
                fileUrl: n.fileUrl || "",
            })),
        }));

        // migrate old flat top-level notes (pre-restructure courses) into their own lecture
        if (course.notes && course.notes.length > 0) {
            loadedLectures.push({
                id: newId(),
                title: "Course Notes",
                videoFile: null,
                videoUrl: "",
                notes: course.notes.map((n) => ({
                    id: newId(),
                    title: n.title || "",
                    file: null,
                    fileUrl: n.fileUrl || "",
                })),
            });
        }

        setLectures(loadedLectures);
        setShowUpload(true);
    }

    // ---- lecture / note builder helpers ----

    function addLecture() {
        setLectures((prev) => [
            ...prev,
            { id: newId(), title: "", videoFile: null, videoUrl: "", notes: [] },
        ]);
    }

    function removeLecture(lectureId) {
        setLectures((prev) => prev.filter((l) => l.id !== lectureId));
    }

    function updateLectureTitle(lectureId, title) {
        setLectures((prev) => prev.map((l) => (l.id === lectureId ? { ...l, title } : l)));
    }

    function setLectureVideo(lectureId, file) {
        setLectures((prev) => prev.map((l) => (l.id === lectureId ? { ...l, videoFile: file } : l)));
    }

    function addNote(lectureId) {
        setLectures((prev) =>
            prev.map((l) =>
                l.id === lectureId
                    ? { ...l, notes: [...l.notes, { id: newId(), title: "", file: null, fileUrl: "" }] }
                    : l
            )
        );
    }

    function removeNote(lectureId, noteId) {
        setLectures((prev) =>
            prev.map((l) =>
                l.id === lectureId ? { ...l, notes: l.notes.filter((n) => n.id !== noteId) } : l
            )
        );
    }

    function updateNoteTitle(lectureId, noteId, title) {
        setLectures((prev) =>
            prev.map((l) =>
                l.id === lectureId
                    ? { ...l, notes: l.notes.map((n) => (n.id === noteId ? { ...n, title } : n)) }
                    : l
            )
        );
    }

    function setNoteFile(lectureId, noteId, file) {
        setLectures((prev) =>
            prev.map((l) =>
                l.id === lectureId
                    ? { ...l, notes: l.notes.map((n) => (n.id === noteId ? { ...n, file } : n)) }
                    : l
            )
        );
    }

    async function uploadToCloudinary(file, kind) {
        const formData = new FormData();
        formData.append(kind, file);

        const res = await fetch(`${API}/upload/${kind}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || `Failed to upload ${kind}`);
        return data.url;
    }

    const handleCourseSave = async () => {
        if (!uploadForm.title || !uploadForm.subject) {
            alert("Title and subject are required");
            return;
        }

        setSaving(true);
        try {
            let thumbnailUrl = existingThumbUrl;
            if (thumbFile) {
                thumbnailUrl = await uploadToCloudinary(thumbFile, "thumbnail");
            }

            const resolvedLectures = [];
            for (const lec of lectures) {
                let videoUrl = lec.videoUrl;
                if (lec.videoFile) {
                    videoUrl = await uploadToCloudinary(lec.videoFile, "video");
                }

                const resolvedNotes = [];
                for (const note of lec.notes) {
                    let fileUrl = note.fileUrl;
                    if (note.file) {
                        fileUrl = await uploadToCloudinary(note.file, "notes");
                    }
                    if (!fileUrl) continue; // skip empty rows the teacher added but never filled
                    resolvedNotes.push({
                        title: note.title || note.file?.name || "Untitled note",
                        fileUrl,
                    });
                }

                resolvedLectures.push({
                    title: lec.title || lec.videoFile?.name || "Untitled lecture",
                    videoUrl,
                    notes: resolvedNotes,
                });
            }

            const payload = {
                title: uploadForm.title,
                subject: uploadForm.subject,
                description: uploadForm.description,
                price: Number(uploadForm.price) || 0,
                color: uploadForm.color,
                thumbnailUrl,
                lectures: resolvedLectures,
            };

            const url = editingId ? `${API}/${editingId}` : API;
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.message || "Something went wrong");
                return;
            }

            alert(editingId ? "Course updated ✅" : "Course uploaded ✅");
            setShowUpload(false);
            loadDashboard();
        } catch (err) {
            console.log(err);
            alert(err.message || "Server Error");
        } finally {
            setSaving(false);
        }
    };

    async function handleDeleteCourse(id) {
        if (!window.confirm("Delete this course? This can't be undone.")) return;
        try {
            const res = await fetch(`${API}/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.message || "Failed to delete");
                return;
            }
            loadDashboard();
        } catch (err) {
            console.log(err);
            alert("Server Error");
        }
    }

    async function togglePublish(course) {
        try {
            const nextStatus = course.status === "Published" ? "Draft" : "Published";
            const res = await fetch(`${API}/${course._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: nextStatus }),
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.message || "Failed to update status");
                return;
            }
            loadDashboard();
        } catch (err) {
            console.log(err);
        }
    }

    const { stats, courses, recentStudents } = dashboard;

    const statCards = [
        { label: "Total Students", value: stats.totalStudents, icon: "👥", color: "#4FB88A", soft: "#E3F5EC" },
        { label: "Total Courses", value: stats.totalCourses, icon: "📚", color: "#7A73D8", soft: "#EAE8FB" },
        { label: "This Month Earnings", value: `₹${stats.monthEarnings}`, icon: "💰", color: "#E89B3C", soft: "#FCEFDD" },
        { label: "Avg. Rating", value: stats.avgRating, icon: "⭐", color: "#D8493F", soft: "#FBE6E4" },
    ];

    if (loading) return <h2 style={{ padding: 40 }}>Loading...</h2>;

    return (
        <div style={s.shell} className="app-shell">
            <style>{`
              * { box-sizing:border-box; margin:0; padding:0; }
              html,body,#root { width:100%; min-height:100vh; }
              body { font-family:'Segoe UI',Arial,sans-serif; background:#F7F4EE; }

              @media (max-width: 900px) {
                .app-shell { flex-direction: column !important; }
                .app-sidebar {
                  position: fixed !important; bottom: 0 !important; left: 0 !important; right: 0 !important; top: auto !important;
                  width: 100% !important; height: 64px !important; min-height: 64px !important;
                  flex-direction: row !important; padding: 0 !important; border-right: none !important;
                  border-top: 1px solid #DDD6CC; z-index: 200 !important;
                }
                .app-logoBox { display: none !important; }
                .app-sideNav { flex-direction: row !important; width: 100% !important; height: 100% !important; justify-content: space-around !important; }
                .app-sideItem { padding: 6px 4px !important; border-radius: 0 !important; flex: 1 !important; }
                .app-sideBottom { display: none !important; }
                .app-main { padding: 16px 14px 84px !important; width: 100% !important; order: 2 !important; }
                .app-rightPanel { width: 100% !important; min-height: auto !important; border-left: none !important; border-bottom: 1px solid #DDD6CC; order: 1 !important; }
                .app-statsGrid { grid-template-columns: repeat(2, 1fr) !important; }
                .app-topRow { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
                .app-courseRow { flex-wrap: wrap !important; }
              }
            `}</style>

            {/* SIDEBAR */}
            <div style={s.sidebar} className="app-sidebar">
                <div style={s.logoBox} className="app-logoBox"><span style={s.logoText}>TUTOR<br />CONNECT</span></div>
                <div style={s.sideNav} className="app-sideNav">
                    {sidebarItems.map(item => (
                        <div key={item.page}
                            style={{ ...s.sideItem, background: activeTab === item.page ? "#E8E0D4" : "transparent" }}
                            className="app-sideItem"
                            onClick={() => setActiveTab(item.page)}
                        >
                            <span style={s.sideIcon}>{item.icon}</span>
                            <span style={s.sideLabel}>{item.label}</span>
                        </div>
                    ))}
                </div>
                <div
                    style={s.sideBottom}
                    className="app-sideBottom"
                    onClick={() => navigate("/forgot-password")}
                >
                    <div style={s.avatarCircle}>👤</div>
                    <span style={s.sideLabel}>Support</span>
                </div>
            </div>

            {/* MAIN */}
            <div style={s.main} className="app-main">

                {/* DASHBOARD TAB */}
                {activeTab === "dashboard" && (
                    <>
                        <div style={s.topRow} className="app-topRow">
                            <div>
                                <h1 style={s.pageTitle}>Teacher Dashboard</h1>
                                <p style={s.pageSub}>Welcome back, {teacher.firstName || "Teacher"} 👋</p>
                            </div>
                            <button style={s.uploadBtn} onClick={openCreateModal}>+ Upload New Course</button>
                        </div>

                        <div style={s.statsGrid} className="app-statsGrid">
                            {statCards.map(st => (
                                <div key={st.label} style={{ ...s.statCard, border: `1.5px solid ${st.color}20` }}>
                                    <div style={{ ...s.statIcon, background: st.soft }}>{st.icon}</div>
                                    <div>
                                        <div style={{ ...s.statVal, color: st.color }}>{st.value}</div>
                                        <div style={s.statLabel}>{st.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h2 style={s.sectionTitle}>My Courses</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
                            {courses.length === 0 && (
                                <p style={{ color: "#888", fontSize: 14 }}>No courses yet — upload your first course to get started.</p>
                            )}
                            {courses.map((c) => (
                                <div key={c._id} style={s.courseRow} className="app-courseRow">
                                    <div style={{ ...s.courseThumb, background: c.color }}>
                                        <span style={{ color: "white", fontStyle: "italic", fontWeight: 700, fontSize: 13 }}>ƒ(x)</span>
                                    </div>
                                    <div style={{ flex: 1, minWidth: 160 }}>
                                        <p style={s.courseTitle}>{c.title}</p>
                                        <p style={s.courseMeta}>{c.subject} · {c.lectures?.length || 0} lectures · {c.students || 0} students · ⭐ {c.rating || 0}</p>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <p style={s.courseEarnings}>₹{c.earnings || 0}</p>
                                        <span
                                            style={{ ...s.statusBadge, cursor: "pointer", background: c.status === "Published" ? "#E3F5EC" : "#F0EAE0", color: c.status === "Published" ? "#4FB88A" : "#888" }}
                                            onClick={() => togglePublish(c)}
                                            title="Click to toggle Draft/Published"
                                        >
                                            {c.status || "Draft"}
                                        </span>
                                    </div>
                                    <div style={s.courseActions}>
                                        <button style={s.editBtn} onClick={() => openEditModal(c)}>Edit</button>
                                        <button style={s.viewBtn} onClick={() => handleDeleteCourse(c._id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h2 style={s.sectionTitle}>Recent Students</h2>
                        <div style={s.studentsTable}>
                            <div style={s.tableHeader}>
                                <span style={{ flex: 2 }}>Student</span>
                                <span style={{ flex: 2 }}>Course</span>
                                <span style={{ flex: 1 }}>Progress</span>
                                <span style={{ flex: 1 }}>Joined</span>
                            </div>
                            {recentStudents.length === 0 && (
                                <p style={{ padding: 20, color: "#888", fontSize: 13 }}>No students yet.</p>
                            )}
                            {recentStudents.map((st, i) => (
                                <div key={i} style={s.tableRow}>
                                    <div style={{ flex: 2, display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={s.stuAvatar}>👤</div>
                                        <span style={s.stuName}>{st.name}</span>
                                    </div>
                                    <span style={{ flex: 2, fontSize: 13, color: "#555" }}>{st.course}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={s.progressBg}>
                                            <div style={{ ...s.progressFill, width: st.progress + "%" }} />
                                        </div>
                                        <span style={s.progressPct}>{st.progress}%</span>
                                    </div>
                                    <span style={{ flex: 1, fontSize: 12, color: "#888" }}>
                                        {st.joined ? new Date(st.joined).toLocaleDateString() : ""}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* EARNINGS TAB */}
                {activeTab === "earnings" && (
                    <>
                        <h1 style={s.pageTitle}>Earnings</h1>
                        <div style={s.statsGrid} className="app-statsGrid">
                            {[
                                { label: "This Month", value: `₹${stats.monthEarnings}`, icon: "📈", color: "#4FB88A", soft: "#E3F5EC" },
                                { label: "Avg. Rating", value: stats.avgRating, icon: "⭐", color: "#7A73D8", soft: "#EAE8FB" },
                                { label: "Total Courses", value: stats.totalCourses, icon: "📚", color: "#E89B3C", soft: "#FCEFDD" },
                                { label: "Total Students", value: stats.totalStudents, icon: "👥", color: "#D8493F", soft: "#FBE6E4" },
                            ].map(st => (
                                <div key={st.label} style={{ ...s.statCard, border: `1.5px solid ${st.color}20` }}>
                                    <div style={{ ...s.statIcon, background: st.soft }}>{st.icon}</div>
                                    <div>
                                        <div style={{ ...s.statVal, color: st.color }}>{st.value}</div>
                                        <div style={s.statLabel}>{st.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ background: "white", borderRadius: 16, padding: "24px", border: "1px solid #E8E2D8", marginTop: 20 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Earnings by Course</h3>
                            {courses.length === 0 && <p style={{ color: "#888", fontSize: 13 }}>No courses yet.</p>}
                            {courses.map((c) => (
                                <div key={c._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #F0EAE0" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.color }} />
                                        <span style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{c.title}</span>
                                    </div>
                                    <span style={{ fontSize: 15, fontWeight: 700, color: "#4FB88A" }}>₹{c.earnings || 0}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* STUDENTS TAB */}
                {activeTab === "students" && (
                    <>
                        <h1 style={s.pageTitle}>My Students</h1>
                        <div style={s.studentsTable}>
                            <div style={s.tableHeader}>
                                <span style={{ flex: 2 }}>Student</span>
                                <span style={{ flex: 2 }}>Course</span>
                                <span style={{ flex: 1 }}>Progress</span>
                                <span style={{ flex: 1 }}>Joined</span>
                            </div>
                            {recentStudents.length === 0 && (
                                <p style={{ padding: 20, color: "#888", fontSize: 13 }}>No students yet.</p>
                            )}
                            {recentStudents.map((st, i) => (
                                <div key={i} style={s.tableRow}>
                                    <div style={{ flex: 2, display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={s.stuAvatar}>👤</div>
                                        <span style={s.stuName}>{st.name}</span>
                                    </div>
                                    <span style={{ flex: 2, fontSize: 13, color: "#555" }}>{st.course}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={s.progressBg}>
                                            <div style={{ ...s.progressFill, width: st.progress + "%" }} />
                                        </div>
                                        <span style={s.progressPct}>{st.progress}%</span>
                                    </div>
                                    <span style={{ flex: 1, fontSize: 12, color: "#888" }}>
                                        {st.joined ? new Date(st.joined).toLocaleDateString() : ""}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* TESTS TAB */}
                {activeTab === "tests" && (
                    <TutorTestCompo />
                )}
            </div>

            {/* RIGHT PANEL */}
            <div style={s.rightPanel} className="app-rightPanel">
                <div style={s.profileCard}>
                    <div style={s.profileAvatar}>👤</div>
                    <p style={s.profileName}>{teacher.firstName} {teacher.lastName}</p>
                    <p style={s.profileEmail}>{teacher.email}</p>
                    <div style={{ ...s.profileBadge, background: "#EAE8FB", color: "#7A73D8" }}>Verified Tutor</div>
                </div>
                <h3 style={s.panelTitle}>Quick Actions</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <button style={s.quickBtn} onClick={openCreateModal}>📤 Upload New Course</button>
                    <button style={s.quickBtn} onClick={() => setActiveTab("students")}>👥 View Students</button>
                    <button style={s.quickBtn} onClick={() => setActiveTab("earnings")}>💰 View Earnings</button>
                    <button style={s.quickBtn} onClick={() => setActiveTab("tests")}>📝 Manage Tests</button>
                </div>
            </div>

            {/* UPLOAD / EDIT MODAL */}
            {showUpload && (
                <div style={s.modalOverlay} onClick={() => !saving && setShowUpload(false)}>
                    <div style={s.modal} onClick={e => e.stopPropagation()}>
                        <div style={s.modalHeader}>
                            <h2 style={s.modalTitle}>{editingId ? "Edit Course" : "Upload New Course"}</h2>
                            <button style={s.closeBtn} onClick={() => setShowUpload(false)}>✕</button>
                        </div>
                        <div style={s.modalBody}>
                            <MField label="Course Title"><MInput placeholder="e.g. Complete Physics Masterclass" value={uploadForm.title} onChange={setU("title")} /></MField>
                            <MField label="Subject">
                                <select style={minputStyle} value={uploadForm.subject} onChange={setU("subject")}>
                                    <option value="">Select subject</option>
                                    {subjectOptions.map((sub) => <option key={sub}>{sub}</option>)}
                                </select>
                            </MField>
                            <MField label="Course Price (₹)"><MInput placeholder="e.g. 999" type="number" value={uploadForm.price} onChange={setU("price")} /></MField>
                            <MField label="Description">
                                <textarea style={{ ...minputStyle, height: 80, resize: "vertical" }} placeholder="What will students learn?" value={uploadForm.description} onChange={setU("description")} />
                            </MField>

                            <MField label="Card Color">
                                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                                    {colorSwatches.map((c) => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => setUploadForm({ ...uploadForm, color: c })}
                                            style={{
                                                width: 32, height: 32, borderRadius: "50%", background: c,
                                                border: uploadForm.color === c ? "3px solid #1A1A1A" : "2px solid #E0E4EA",
                                                cursor: "pointer",
                                            }}
                                        />
                                    ))}
                                    <input
                                        type="color"
                                        value={uploadForm.color}
                                        onChange={(e) => setUploadForm({ ...uploadForm, color: e.target.value })}
                                        style={{ width: 40, height: 32, border: "none", background: "none", cursor: "pointer" }}
                                        title="Custom color"
                                    />
                                </div>
                            </MField>

                            <MField label="Lectures">
                                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                    {lectures.length === 0 && (
                                        <p style={{ fontSize: 12, color: "#9CA3AF" }}>No lectures added yet.</p>
                                    )}
                                    {lectures.map((lec, i) => (
                                        <LectureCard
                                            key={lec.id}
                                            index={i}
                                            lecture={lec}
                                            onTitleChange={(title) => updateLectureTitle(lec.id, title)}
                                            onVideoChange={(file) => setLectureVideo(lec.id, file)}
                                            onRemove={() => removeLecture(lec.id)}
                                            onAddNote={() => addNote(lec.id)}
                                            onNoteTitleChange={(noteId, title) => updateNoteTitle(lec.id, noteId, title)}
                                            onNoteFileChange={(noteId, file) => setNoteFile(lec.id, noteId, file)}
                                            onRemoveNote={(noteId) => removeNote(lec.id, noteId)}
                                        />
                                    ))}
                                    <button type="button" style={s.addLectureBtn} onClick={addLecture}>+ Add Lecture</button>
                                </div>
                            </MField>

                            <MField label="Upload Thumbnail">
                                <UploadBox label="Upload a course cover image" accept="image/*" file={thumbFile} onChange={e => setThumbFile(e.target.files[0])} icon="🖼️" />
                                {existingThumbUrl && !thumbFile && (
                                    <p style={{ fontSize: 12, color: "#888", marginTop: 6 }}>Current thumbnail is already set — upload a new one to replace it.</p>
                                )}
                            </MField>

                            <button style={{ ...s.submitBtn, opacity: saving ? 0.6 : 1 }} onClick={handleCourseSave} disabled={saving}>
                                {saving ? "Saving..." : editingId ? "Save Changes" : "Submit Course for Review"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Incoming call modal ── */}
           {incomingCall && (
    <div
        className="fixed inset-0 flex justify-center items-center z-50 px-4"
        style={{ background: "rgba(26,26,26,0.55)", backdropFilter: "blur(4px)" }}
    >
        <div
            className="w-full max-w-sm text-center"
            style={{
                background: "white",
                borderRadius: 24,
                padding: "36px 32px 28px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                border: "1px solid #EDE6DC",
                animation: "callPopIn 0.25s ease-out",
            }}
        >
            <style>{`
              @keyframes callPopIn {
                from { opacity: 0; transform: translateY(8px) scale(0.97); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }
              @keyframes ringPulse {
                0% { box-shadow: 0 0 0 0 rgba(79,184,138,0.35); }
                70% { box-shadow: 0 0 0 14px rgba(79,184,138,0); }
                100% { box-shadow: 0 0 0 0 rgba(79,184,138,0); }
              }
            `}</style>

            <div
                style={{
                    width: 72, height: 72, borderRadius: "50%",
                    background: "#E3F5EC",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 20px",
                    animation: "ringPulse 1.8s infinite",
                }}
            >
                <svg width="30" height="30" fill="none" stroke="#4FB88A" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            </div>

            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", marginBottom: 6 }}>
                Incoming doubt session
            </h2>
            <p style={{ fontSize: 13.5, color: "#888", marginBottom: 28, lineHeight: 1.5 }}>
                A student is requesting help right now
            </p>

            <div style={{ display: "flex", gap: 10 }}>
                <button
                    onClick={() => setIncomingCall(false)}
                    style={{
                        flex: 1, padding: "12px 0", borderRadius: 10,
                        border: "1.5px solid #E8E2D8", background: "white",
                        color: "#666", fontSize: 14, fontWeight: 700,
                        cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#F7F4EE"}
                    onMouseLeave={e => e.currentTarget.style.background = "white"}
                >
                    Reject
                </button>
                <button
                    onClick={() => { accept(); setIncomingCall(false); }}
                    style={{
                        flex: 1, padding: "12px 0", borderRadius: 10,
                        border: "none", background: "#4FB88A",
                        color: "white", fontSize: 14, fontWeight: 700,
                        cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#439E76"}
                    onMouseLeave={e => e.currentTarget.style.background = "#4FB88A"}
                >
                    Accept
                </button>
            </div>
        </div>
    </div>
)}
            {/* ── Active call overlay ── */}
            {inCall && (
                <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden">

                    {/* Top bar */}
                    <div className="flex-none flex items-center justify-between px-4 py-3 bg-[#1a1a1a]">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-medium">
                                ST
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-100">Doubt session</p>
                                <p className="text-xs text-gray-400">Live session</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5 text-xs text-red-400 bg-red-950 border border-red-800 rounded-md px-2 py-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                                Live
                            </span>
                            <span className="text-sm text-gray-400 tabular-nums">{formatTime(callDuration)}</span>
                        </div>
                    </div>

                    {/* Video area */}
                    <div className="relative flex-1 min-h-0 bg-[#111]">

                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-lg z-10">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                            Student
                        </div>

                        <div className="absolute top-3 right-3 z-20 rounded-xl overflow-hidden border-2 border-gray-600 w-24 sm:w-32 md:w-40 shadow-xl">
                            <video
                                ref={localVideoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full aspect-video object-cover bg-gray-800 block"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-center text-white text-[10px] py-0.5">
                                You
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex-none bg-[#1a1a1a] px-6 py-4 flex items-center justify-center gap-4">

                        <div className="flex flex-col items-center gap-1">
                            <button
                                onClick={toggleMute}
                                className={`w-11 h-11 rounded-full flex items-center justify-center border transition
                  ${muted ? 'bg-orange-500 border-orange-500 text-white' : 'bg-[#2a2a2a] border-gray-600 text-gray-300 hover:border-gray-400'}`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    {muted
                                        ? <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                        : <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    }
                                </svg>
                            </button>
                            <span className="text-[10px] text-gray-500">{muted ? 'Unmute' : 'Mute'}</span>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <button
                                onClick={toggleCam}
                                className={`w-11 h-11 rounded-full flex items-center justify-center border transition
                  ${camOff ? 'bg-orange-500 border-orange-500 text-white' : 'bg-[#2a2a2a] border-gray-600 text-gray-300 hover:border-gray-400'}`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </button>
                            <span className="text-[10px] text-gray-500">Camera</span>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <button
                                onClick={() => ShareScreen(pcRef, localVideoRef)}
                                className="w-11 h-11 rounded-full bg-[#2a2a2a] border border-gray-600 text-gray-300 hover:border-gray-400 flex items-center justify-center transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </button>
                            <span className="text-[10px] text-gray-500">Share</span>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <button
                                onClick={() => setInCall(false)}
                                className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a16.003 16.003 0 0114 0 1 1 0 01.188 1.384l-2.76 3.612a1 1 0 01-1.21.29l-2.833-1.416a11.042 11.042 0 00-4.77 4.77l-1.416 2.834a1 1 0 01-.29 1.21L2.616 18.81A1 1 0 011.23 18.62 16.003 16.003 0 015 3z" />
                                </svg>
                            </button>
                            <span className="text-[10px] text-red-400">End call</span>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

function MField({ label, children }) {
    return (
        <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
            {children}
        </div>
    );
}

const minputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    border: "1.5px solid #E0E4EA", fontSize: 14, color: "#111",
    background: "#FAFBFC", outline: "none", fontFamily: "inherit",
};

function MInput(props) {
    return <input {...props} style={minputStyle}
        onFocus={e => e.target.style.borderColor = "#4FB88A"}
        onBlur={e => e.target.style.borderColor = "#E0E4EA"}
    />;
}

function UploadBox({ label, accept, file, onChange, icon }) {
    return (
        <div style={{ border: "1.5px dashed #D1D5DB", borderRadius: 8, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, background: file ? "#F0FBF6" : "#FAFBFC", cursor: "pointer", position: "relative" }}>
            <span style={{ fontSize: 22 }}>{file ? "✅" : icon}</span>
            <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: file ? "#4FB88A" : "#374151", marginBottom: 2 }}>{file ? file.name : label}</p>
                <p style={{ fontSize: 11, color: "#9CA3AF" }}>Click or drag and drop</p>
            </div>
            <input type="file" accept={accept} onChange={onChange} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
        </div>
    );
}

function LectureCard({ index, lecture, onTitleChange, onVideoChange, onRemove, onAddNote, onNoteTitleChange, onNoteFileChange, onRemoveNote }) {
    return (
        <div style={s.lectureCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#7A73D8", letterSpacing: 0.5 }}>LECTURE {index + 1}</span>
                <button type="button" onClick={onRemove} style={s.removeLectureBtn}>Remove lecture</button>
            </div>

            <input
                style={{ ...minputStyle, marginBottom: 10 }}
                placeholder="Lecture title, e.g. Introduction to Kinematics"
                value={lecture.title}
                onChange={(e) => onTitleChange(e.target.value)}
            />

            <UploadBox
                label="Drop a video file or click to upload"
                accept="video/*"
                file={lecture.videoFile}
                onChange={(e) => onVideoChange(e.target.files[0])}
                icon="🎥"
            />
            {lecture.videoUrl && !lecture.videoFile && (
                <p style={{ fontSize: 11, color: "#888", marginTop: 6 }}>Video already uploaded — pick a new file to replace it.</p>
            )}

            <div style={{ marginTop: 14 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8 }}>Notes for this lecture (optional)</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {lecture.notes.map((note) => (
                        <div key={note.id} style={s.noteRow}>
                            <input
                                style={{ ...minputStyle, flex: 1, padding: "8px 10px", fontSize: 12 }}
                                placeholder="Note title"
                                value={note.title}
                                onChange={(e) => onNoteTitleChange(note.id, e.target.value)}
                            />
                            <label style={s.noteFileBtn}>
                                {note.file ? "✅ " + note.file.name : note.fileUrl ? "📄 Replace file" : "📄 Choose file"}
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => onNoteFileChange(note.id, e.target.files[0])}
                                    style={{ display: "none" }}
                                />
                            </label>
                            <button type="button" onClick={() => onRemoveNote(note.id)} style={s.removeNoteBtn}>✕</button>
                        </div>
                    ))}
                </div>
                <button type="button" style={s.addNoteBtn} onClick={onAddNote}>+ Add Note</button>
            </div>
        </div>
    );
}

const s = {
    shell: { display: "flex", minHeight: "100vh", width: "100%", background: "#F7F4EE" },
    sidebar: { width: 90, minHeight: "100vh", background: "#EDE6DC", display: "flex", flexDirection: "column", alignItems: "center", padding: "0 0 24px", flexShrink: 0, borderRight: "1px solid #DDD6CC" },
    logoBox: { width: "100%", background: "#D8CFC4", padding: "18px 8px", textAlign: "center", marginBottom: 24 },
    logoText: { fontSize: 11, fontWeight: 800, color: "#333", letterSpacing: 1, lineHeight: 1.4 },
    sideNav: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, width: "100%", flex: 1 },
    sideItem: { width: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "14px 8px", cursor: "pointer", borderRadius: 8 },
    sideIcon: { fontSize: 22, marginBottom: 4 },
    sideLabel: { fontSize: 9, color: "#666", textAlign: "center", fontWeight: 600, letterSpacing: 0.3 },
    sideBottom: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
    avatarCircle: { width: 44, height: 44, borderRadius: "50%", background: "#C8BFB4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 4 },
    main: { flex: 1, padding: "36px 32px", minWidth: 0 },
    topRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 },
    pageTitle: { fontSize: 26, fontWeight: 800, color: "#1A1A1A", letterSpacing: -0.5, marginBottom: 4 },
    pageSub: { fontSize: 14, color: "#888" },
    uploadBtn: { background: "#4FB88A", color: "white", border: "none", borderRadius: 8, padding: "11px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 },
    statCard: { background: "white", borderRadius: 14, padding: "20px 18px", display: "flex", alignItems: "center", gap: 14 },
    statIcon: { width: 46, height: 46, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 },
    statVal: { fontSize: 22, fontWeight: 800, letterSpacing: -0.5 },
    statLabel: { fontSize: 12, color: "#888", marginTop: 2 },
    sectionTitle: { fontSize: 17, fontWeight: 700, color: "#1A1A1A", marginBottom: 16 },
    courseRow: { background: "white", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, border: "1px solid #EDE6DC" },
    courseThumb: { width: 50, height: 50, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    courseTitle: { fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 },
    courseMeta: { fontSize: 12, color: "#888" },
    courseEarnings: { fontSize: 15, fontWeight: 700, color: "#4FB88A", marginBottom: 4 },
    statusBadge: { fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100 },
    courseActions: { display: "flex", gap: 8 },
    editBtn: { padding: "7px 14px", background: "#F0EAE0", color: "#444", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
    viewBtn: { padding: "7px 14px", background: "#D8493F", color: "white", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
    studentsTable: { background: "white", borderRadius: 16, overflow: "hidden", border: "1px solid #E8E2D8" },
    tableHeader: { display: "flex", padding: "12px 20px", background: "#F7F4EE", fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: "0.06em", textTransform: "uppercase" },
    tableRow: { display: "flex", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #F0EAE0" },
    stuAvatar: { width: 32, height: 32, borderRadius: "50%", background: "#EDE6DC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 },
    stuName: { fontSize: 13, fontWeight: 600, color: "#1A1A1A" },
    progressBg: { height: 5, background: "#F0EAE0", borderRadius: 3, overflow: "hidden", marginBottom: 3 },
    progressFill: { height: "100%", background: "#4FB88A", borderRadius: 3 },
    progressPct: { fontSize: 11, color: "#888" },
    rightPanel: { width: 260, background: "#EDE6DC", padding: "24px 16px", flexShrink: 0, borderLeft: "1px solid #DDD6CC" },
    profileCard: { background: "white", borderRadius: 14, padding: "20px", textAlign: "center", marginBottom: 20, border: "1px solid #E8E2D8" },
    profileAvatar: { width: 60, height: 60, borderRadius: "50%", background: "#C8BFB4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 10px", border: "3px solid #EDE6DC" },
    profileName: { fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 2 },
    profileEmail: { fontSize: 12, color: "#888", marginBottom: 10 },
    profileBadge: { display: "inline-block", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 100 },
    panelTitle: { fontSize: 13, fontWeight: 700, color: "#444", marginBottom: 10 },
    quickBtn: { width: "100%", padding: "11px", background: "white", color: "#1A1A1A", border: "1px solid #E8E2D8", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textAlign: "left" },
    modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 },
    modal: { background: "white", borderRadius: 20, width: "100%", maxWidth: 540, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" },
    modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #F0EAE0" },
    modalTitle: { fontSize: 20, fontWeight: 800, color: "#1A1A1A" },
    closeBtn: { background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#888" },
    modalBody: { padding: "20px 24px", overflowY: "auto" },
    submitBtn: { width: "100%", padding: "13px", background: "#4FB88A", color: "white", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginTop: 8 },
    lectureCard: { border: "1.5px solid #E0E4EA", borderRadius: 12, padding: "16px", background: "#FAFBFC" },
    removeLectureBtn: { background: "none", border: "none", color: "#D8493F", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
    addLectureBtn: { padding: "12px", border: "1.5px dashed #4FB88A", borderRadius: 8, background: "none", color: "#4FB88A", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
    noteRow: { display: "flex", alignItems: "center", gap: 8 },
    noteFileBtn: { fontSize: 11, fontWeight: 600, color: "#374151", background: "#F0EAE0", padding: "8px 10px", borderRadius: 6, cursor: "pointer", whiteSpace: "nowrap" },
    removeNoteBtn: { background: "none", border: "none", color: "#D8493F", fontSize: 14, fontWeight: 700, cursor: "pointer" },
    addNoteBtn: { marginTop: 8, background: "none", border: "none", color: "#7A73D8", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
};