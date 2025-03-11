const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());

// Serve static files from the "public" folder
app.use(express.static("public"));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "song") {
      cb(null, "uploads/songs");
    } else if (file.fieldname === "image") {
      cb(null, "uploads/images");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload endpoint
app.post("/upload", upload.fields([
  { name: "song", maxCount: 1 },
  { name: "image", maxCount: 1 },
]), (req, res) => {
  const songFile = req.files["song"][0];
  const imageFile = req.files["image"][0];

  if (!songFile || !imageFile) {
    return res.status(400).json({ error: "Please upload both a song and an image." });
  }

  const songURL = `http://localhost:${PORT}/uploads/songs/${songFile.filename}`;
  const imageURL = `http://localhost:${PORT}/uploads/images/${imageFile.filename}`;

  res.json({ songURL, imageURL });
});

// Fetch all uploaded files
app.get("/files", (req, res) => {
  const songsDir = path.join(__dirname, "uploads/songs");
  const imagesDir = path.join(__dirname, "uploads/images");

  const songs = fs.readdirSync(songsDir).map(file => ({
    name: file,
    url: `http://localhost:${PORT}/uploads/songs/${file}`,
  }));

  const images = fs.readdirSync(imagesDir).map(file => ({
    name: file,
    url: `http://localhost:${PORT}/uploads/images/${file}`,
  }));

  res.json({ songs, images });
});

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});