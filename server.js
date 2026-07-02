const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

app.use(cors());
app.use(express.json());
app.use(express.static(PUBLIC_DIR));

// Data default jika file database tidak ada
const defaultData = {
  profiles: {
    user1: { name: "Abiyu", color: "#a855f7", avatar: "boy" }, // Purple
    user2: { name: "Manda", color: "#ec4899", avatar: "girl" } // Pink
  },
  goals: [
    {
      id: "goal-1",
      name: "Liburan Romantis",
      target: 5000000,
      current: 0,
      deadline: "2026-12-31",
      icon: "✈️"
    },
    {
      id: "goal-2",
      name: "Makan Malam Anniversary",
      target: 1000000,
      current: 0,
      deadline: "2026-10-15",
      icon: "🕯️"
    }
  ],
  transactions: [],
  savingChallenge: {
    targetDays: 30,
    dailyAmount: 20000,
    progress: [] // Menyimpan tanggal yang sudah diisi
  }
};

// Helper untuk membaca database
function readDatabase() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
      return defaultData;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return defaultData;
  }
}

// Helper untuk menulis ke database
function writeDatabase(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error("Error writing database:", error);
    return false;
  }
}

// Route API untuk mendapatkan data
app.get('/api/data', (req, res) => {
  const data = readDatabase();
  res.json(data);
});

// Route API untuk mengupdate data
app.post('/api/data', (req, res) => {
  const newData = req.body;
  if (!newData || !newData.profiles || !newData.goals || !newData.transactions) {
    return res.status(400).json({ error: "Format data tidak valid" });
  }
  
  const success = writeDatabase(newData);
  if (success) {
    res.json({ message: "Data berhasil disimpan", data: newData });
  } else {
    res.status(500).json({ error: "Gagal menulis ke database" });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Celengan Couple backend berjalan di port ${PORT}`);
  console.log(` Buka di browser: http://localhost:${PORT}`);
  console.log(`====================================================`);
});
