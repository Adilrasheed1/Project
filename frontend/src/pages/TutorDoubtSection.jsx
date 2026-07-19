import { useEffect, useState } from "react";

const API = `${import.meta.env.VITE_API_URL}/api/doubts`;

const filterPills = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "resolved", label: "Resolved" },
];

function timeAgo(dateStr) {
    if (!dateStr) return "";
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

export function TutorDoubtSection() {
    const [doubts, setDoubts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [selected, setSelected] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadDoubts();
    }, []);

    async function loadDoubts() {
        setLoading(true);
        try {
            const res = await fetch(`${API}/DoubtSection`);
            const data = await res.json();
            if (res.ok) setDoubts(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    async function markResolved(id) {
        setUpdating(true);
        try {
            const res = await fetch(`${API}/DoubtSection/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "resolved" }),
            });
            const updated = await res.json();
            if (res.ok) {
                setDoubts((prev) => prev.map((d) => (d._id === id ? updated : d)));
                setSelected(updated);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setUpdating(false);
        }
    }

    const visible = filter === "all" ? doubts : doubts.filter((d) => d.status === filter);

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1A1A1A", letterSpacing: -0.5, marginBottom: 4 }}>Doubts</h1>
                    <p style={{ fontSize: 14, color: "#888" }}>Requests submitted by students</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    {filterPills.map((p) => (
                        <button
                            key={p.key}
                            onClick={() => setFilter(p.key)}
                            style={{
                                padding: "8px 16px",
                                borderRadius: 100,
                                border: filter === p.key ? "none" : "1.5px solid #E8E2D8",
                                background: filter === p.key ? "#4FB88A" : "white",
                                color: filter === p.key ? "white" : "#666",
                                fontSize: 13,
                                fontWeight: 700,
                                cursor: "pointer",
                                fontFamily: "inherit",
                            }}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading && <p style={{ color: "#888", fontSize: 14 }}>Loading doubts...</p>}

            {!loading && visible.length === 0 && (
                <p style={{ color: "#888", fontSize: 14 }}>No {filter !== "all" ? filter : ""} doubts yet.</p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {visible.map((d) => (
                    <div
                        key={d._id}
                        onClick={() => setSelected(d)}
                        style={{
                            background: "white",
                            borderRadius: 14,
                            padding: "16px 20px",
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            border: "1px solid #EDE6DC",
                            cursor: "pointer",
                        }}
                    >
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                <span
                                    style={{
                                        fontSize: 11,
                                        fontWeight: 700,
                                        color: "#4FB88A",
                                        background: "#E3F5EC",
                                        padding: "2px 9px",
                                        borderRadius: 100,
                                    }}
                                >
                                    {d.subject}
                                </span>
                                <span style={{ fontSize: 11, color: "#B0AAA0" }}>{timeAgo(d.createdAt)}</span>
                            </div>
                            <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {d.title}
                            </p>
                            <p style={{ fontSize: 12.5, color: "#888", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {d.description}
                            </p>
                        </div>
                        <span
                            style={{
                                fontSize: 11,
                                fontWeight: 700,
                                padding: "4px 12px",
                                borderRadius: 100,
                                background: d.status === "resolved" ? "#E3F5EC" : "#FCEFDD",
                                color: d.status === "resolved" ? "#4FB88A" : "#E89B3C",
                                flexShrink: 0,
                            }}
                        >
                            {d.status === "resolved" ? "Resolved" : "Pending"}
                        </span>
                    </div>
                ))}
            </div>

            {/* Detail panel */}
            {selected && (
                <div
                    onClick={() => setSelected(null)}
                    style={{ position: "fixed", inset: 0, background: "rgba(26,26,26,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{ background: "white", borderRadius: 20, width: "100%", maxWidth: 480, padding: "26px 28px" }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                            <span
                                style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: "#4FB88A",
                                    background: "#E3F5EC",
                                    padding: "3px 10px",
                                    borderRadius: 100,
                                }}
                            >
                                {selected.subject}
                            </span>
                            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#888" }}>✕</button>
                        </div>

                        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", marginBottom: 10 }}>{selected.title}</h2>
                        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6, marginBottom: 16, maxHeight: 200, overflowY: "auto" }}>
                            {selected.description}
                        </p>

                        {selected.image && (
                            <a
                                href={selected.image}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 6,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: "#7A73D8",
                                    background: "#EAE8FB",
                                    padding: "6px 12px",
                                    borderRadius: 8,
                                    marginBottom: 18,
                                    textDecoration: "none",
                                }}
                            >
                                📎 View attachment
                            </a>
                        )}

                        <p style={{ fontSize: 12, color: "#B0AAA0", marginBottom: 18 }}>Submitted {timeAgo(selected.createdAt)}</p>

                        {selected.status === "pending" ? (
                            <button
                                onClick={() => markResolved(selected._id)}
                                disabled={updating}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    background: "#4FB88A",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 10,
                                    fontSize: 14,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    fontFamily: "inherit",
                                    opacity: updating ? 0.6 : 1,
                                }}
                            >
                                {updating ? "Updating..." : "Mark as Resolved"}
                            </button>
                        ) : (
                            <div
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    background: "#E3F5EC",
                                    color: "#4FB88A",
                                    borderRadius: 10,
                                    fontSize: 14,
                                    fontWeight: 700,
                                    textAlign: "center",
                                }}
                            >
                                ✓ Resolved
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}