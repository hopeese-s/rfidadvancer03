const express = require("express");
const cors = require("cors");
const fs = require("fs");
const csv = require("csv-parser");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const maleQueue = [];
const femaleQueue = [];

function convertRoom(room) {
  room = room.trim().toLowerCase();
  if (/^a([1-4])/.test(room)) return `อนุบาล ${room[1]}`;
  if (/^1[a-d]/.test(room)) return "ป.1";
  if (/^2[a-d]/.test(room)) return "ป.2";
  if (/^([3-6])([a-d])/.test(room)) return `ป.${room[0]}`;
  if (/^(1[0-2])/.test(room)) return `ม.${parseInt(room) - 6}`;
  return room;
}

function readStudentsCSV() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream("students.csv")
      .pipe(
        csv({
          mapHeaders: ({ header }) => header.trim().toLowerCase(),
        }),
      )
      .on("data", (row) => results.push(row))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

function getShowOn(student) {
  const room = student.room.trim().toLowerCase();
  const sex = student.sex.trim();
  if (/^a[1-4]/.test(room) || /^1[a-d]/.test(room) || /^2[a-d]/.test(room)) return ["หญิง"];
  if (sex === "หญิง") return ["หญิง"];
  if (sex === "ชาย") return ["ชาย"];
  return [];
}

app.post("/scan", async (req, res) => {
  const { uid } = req.body;
  if (!uid) return res.status(400).json({ error: "Missing UID" });

  try {
    const students = await readStudentsCSV();
    const matches = students.filter((s) => s.uid === uid);

    if (!matches.length) return res.status(404).json({ error: "UID not found" });

    matches.forEach((student) => {
      const showOn = getShowOn(student);
      const obj = {
        name: student.name,
        registration: student.registration,
        room: convertRoom(student.room),
        time: Date.now(),
      };
      if (showOn.includes("ชาย")) maleQueue.unshift(obj);
      if (showOn.includes("หญิง")) femaleQueue.unshift(obj);
    });

    res.json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ error: "internal error" });
  }
});

app.get("/queue", (req, res) => {
  const type = req.query.type;
  if (!["male", "female"].includes(type)) return res.status(400).send("invalid type");
  const list = type === "male" ? maleQueue : femaleQueue;
  res.json(list.slice(0, 20));
});

// ล้างคิวทุก 30 นาที
setInterval(() => {
  maleQueue.length = 0;
  femaleQueue.length = 0;
  console.log("🔥 Cleared queues automatically");
}, 30 * 60 * 1000);

const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => console.log("✅ Backend running on port", PORT));
