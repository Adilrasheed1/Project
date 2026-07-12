const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = "TutorConnect/Others";

    if (file.fieldname === "resume")
      folder = "TutorConnect/Teachers/Resume";

    if (file.fieldname === "aadhar")
      folder = "TutorConnect/Teachers/Aadhar";

    if (file.fieldname === "marksheet")
      folder = "TutorConnect/Teachers/Marksheet";

    if (file.fieldname === "thumbnail")
      folder = "TutorConnect/Courses/Thumbnail";

    if (file.fieldname === "video")
      folder = "TutorConnect/Courses/Videos";

    if (file.fieldname === "notes")
      folder = "TutorConnect/Courses/Notes";

    return {
      folder: folder,
      resource_type: "auto",
    };
  },
});

const upload = multer({
  storage: storage,
});

module.exports = upload;