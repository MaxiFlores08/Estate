require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const crypto = require("crypto");
const Database = require("better-sqlite3");
const { ethers } = require("ethers");

// ---- Configuracion ----
const PORT = process.env.PORT || 3001;
const RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const ABI = [
  "function registrarPropiedad(string id, string hashDocumento)",
  "function obtenerHash(string id) view returns (string)"
];

// ---- Blockchain ----
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contrato = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

// ---- Base de datos ----
const db = new Database("registro.db");
db.exec(`CREATE TABLE IF NOT EXISTS propiedades (
  id TEXT PRIMARY KEY,
  hash TEXT,
  archivo TEXT,
  fecha TEXT,
  tipo TEXT,
  metadatos TEXT,
  categoria TEXT
)`);
// Agrega columnas nuevas si la tabla ya existía sin ellas.
["tipo", "metadatos", "categoria"].forEach((col) => {
  try { db.exec(`ALTER TABLE propiedades ADD COLUMN ${col} TEXT`); } catch {}
});

// ---- Servidor ----
const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

// Registrar: id + PDF -> calcula hash -> guarda en blockchain y en SQLite.
app.post("/registrar", upload.single("documento"), async (req, res) => {
  try {
    const id = req.body.id;
    if (!id || !req.file) {
      return res.status(400).json({ error: "Falta el id o el documento PDF." });
    }
    const tipo = req.body.tipo || "";
    const metadatos = req.body.metadatos || "{}";
    const categoria = req.body.categoria || "";
    const hash = sha256(req.file.buffer);
    const tx = await contrato.registrarPropiedad(id, hash);
    await tx.wait();
    db.prepare("INSERT INTO propiedades (id, hash, archivo, fecha, tipo, metadatos, categoria) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(id, hash, req.file.originalname, new Date().toISOString(), tipo, metadatos, categoria);
    res.json({ ok: true, id, hash, txHash: tx.hash });
  } catch (e) {
    res.status(400).json({ error: e.shortMessage || e.message });
  }
});

// Verificar: id + PDF -> recalcula hash -> compara con el guardado en blockchain.
app.post("/verificar", upload.single("documento"), async (req, res) => {
  try {
    const id = req.body.id;
    if (!id || !req.file) {
      return res.status(400).json({ error: "Falta el id o el documento PDF." });
    }
    const hashCalculado = sha256(req.file.buffer);
    const hashRegistrado = await contrato.obtenerHash(id);
    if (!hashRegistrado) {
      return res.json({ resultado: "NO_REGISTRADO", hashCalculado, hashRegistrado: "" });
    }
    const coincide = hashCalculado === hashRegistrado;
    res.json({
      resultado: coincide ? "INTACTO" : "MODIFICADO",
      coincide,
      hashCalculado,
      hashRegistrado
    });
  } catch (e) {
    res.status(400).json({ error: e.shortMessage || e.message });
  }
});

// Historial: devuelve todos los registros ordenados por fecha descendente.
app.get("/historial", (req, res) => {
  try {
    const filas = db.prepare("SELECT id, hash, archivo, fecha, tipo, metadatos, categoria FROM propiedades ORDER BY fecha DESC").all();
    res.json(filas);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});