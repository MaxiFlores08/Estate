import { useState, useEffect, useCallback } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

const estilosResultado = {
  INTACTO:       { color: "#22c55e", bg: "rgba(34,197,94,0.12)",  border: "#22c55e" },
  MODIFICADO:    { color: "#ef4444", bg: "rgba(239,68,68,0.12)",  border: "#ef4444" },
  NO_REGISTRADO: { color: "#f97316", bg: "rgba(249,115,22,0.12)", border: "#f97316" },
};

const css = `
  .rp-page {
    min-height: 100vh;
    background: #0f172a;
    color: #e2e8f0;
    display: flex;
    justify-content: center;
    padding: 48px 20px;
    box-sizing: border-box;
    font-family: -apple-system, "Segoe UI", Roboto, sans-serif;
  }
  .rp-container { width: 100%; max-width: 720px; }
  .rp-title {
    text-align: center;
    font-size: 2.3rem;
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: -0.5px;
    color: #f8fafc;
    margin: 0 0 36px;
  }
  .rp-card {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 16px;
    padding: 28px;
    margin-bottom: 24px;
    box-shadow: 0 6px 24px rgba(0,0,0,0.35);
  }
  .rp-card h2 {
    font-size: 1.4rem;
    font-weight: 600;
    color: #f1f5f9;
    margin: 0 0 20px;
  }
  .rp-input {
    width: 100%;
    box-sizing: border-box;
    padding: 14px 16px;
    margin-bottom: 16px;
    font-size: 16px;
    color: #f1f5f9;
    background: #0f172a;
    border: 2px solid #475569;
    border-radius: 10px;
    outline: none;
    transition: border-color 0.15s;
  }
  .rp-input::placeholder { color: #94a3b8; }
  .rp-input:focus { border-color: #6366f1; }
  .rp-file {
    width: 100%;
    box-sizing: border-box;
    font-size: 15px;
    color: #cbd5e1;
    margin-bottom: 20px;
  }
  .rp-file::file-selector-button {
    padding: 11px 18px;
    margin-right: 14px;
    border: none;
    border-radius: 8px;
    background: #334155;
    color: #e2e8f0;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.15s;
  }
  .rp-file::file-selector-button:hover { background: #475569; }
  .rp-btn {
    padding: 13px 28px;
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    background: #6366f1;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
  }
  .rp-btn:hover { background: #4f46e5; transform: translateY(-1px); }
  .rp-btn:active { transform: translateY(0); }
  .rp-btn:disabled { background: #475569; cursor: not-allowed; transform: none; }
  .rp-banner {
    margin-top: 20px;
    padding: 18px 20px;
    border-radius: 12px;
    border: 1px solid;
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
  }
  .rp-error {
    margin-top: 20px;
    padding: 14px 18px;
    border-radius: 10px;
    background: rgba(239,68,68,0.12);
    border: 1px solid #ef4444;
    color: #fca5a5;
    font-size: 15px;
  }
  .rp-json {
    margin-top: 14px;
    background: #0b1120;
    color: #94a3b8;
    border: 1px solid #1e293b;
    border-radius: 10px;
    padding: 14px;
    font-size: 13px;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-all;
  }
  .rp-json-label { font-size: 12px; color: #64748b; margin: 16px 0 0; text-transform: uppercase; letter-spacing: 1px; }
  .rp-historial-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .rp-historial-header h2 { margin: 0; }
  .rp-btn-sm {
    padding: 8px 18px;
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    background: #334155;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s;
  }
  .rp-btn-sm:hover { background: #475569; }
  .rp-btn-sm:disabled { opacity: 0.5; cursor: not-allowed; }
  .rp-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }
  .rp-table th {
    text-align: left;
    padding: 10px 12px;
    color: #64748b;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    border-bottom: 1px solid #334155;
  }
  .rp-table td {
    padding: 12px 12px;
    border-bottom: 1px solid #1e293b;
    color: #cbd5e1;
    vertical-align: top;
    word-break: break-all;
  }
  .rp-table tr:last-child td { border-bottom: none; }
  .rp-table tr:hover td { background: rgba(255,255,255,0.03); }
  .rp-empty {
    text-align: center;
    color: #475569;
    padding: 28px 0;
    font-size: 15px;
  }
  .rp-preview {
    width: 100%;
    height: 400px;
    margin-bottom: 20px;
    border: 2px solid #334155;
    border-radius: 10px;
    background: #0b1120;
  }
`;

export default function App() {
  const [refreshHistorial, setRefreshHistorial] = useState(0);

  function onRegistroExitoso() {
    setRefreshHistorial((n) => n + 1);
  }

  return (
    <div className="rp-page">
      <style>{css}</style>
      <div className="rp-container">
        <h1 className="rp-title">Registro de Propiedades en Blockchain</h1>
        <Seccion
          titulo="1. Registrar propiedad"
          endpoint="/registrar"
          modo="registrar"
          onExito={onRegistroExitoso}
        />
        <Seccion titulo="2. Verificar documento" endpoint="/verificar" modo="verificar" />
        <Historial refreshKey={refreshHistorial} />
      </div>
    </div>
  );
}

function Seccion({ titulo, endpoint, modo, onExito }) {
  const [id, setId] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!archivo) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(archivo);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [archivo]);

  async function enviar() {
    if (!id || !archivo) {
      setResultado({ error: "Completa el ID y elige un PDF." });
      return;
    }
    setCargando(true);
    setResultado(null);
    try {
      const form = new FormData();
      form.append("id", id);
      form.append("documento", archivo);
      const res = await fetch(API + endpoint, { method: "POST", body: form });
      const data = await res.json();
      setResultado(data);
      if (data.ok && onExito) onExito();
    } catch (e) {
      setResultado({ error: e.message });
    } finally {
      setCargando(false);
    }
  }

  const banner = resultado?.resultado ? estilosResultado[resultado.resultado] : null;

  return (
    <div className="rp-card">
      <h2>{titulo}</h2>
      <input
        className="rp-input"
        placeholder="ID de la propiedad"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <input
        className="rp-file"
        type="file"
        accept="application/pdf"
        onChange={(e) => setArchivo(e.target.files[0] || null)}
      />
      {previewUrl && (
        <iframe className="rp-preview" src={previewUrl} title="Vista previa del PDF" />
      )}
      <button className="rp-btn" onClick={enviar} disabled={cargando}>
        {cargando ? "Procesando..." : (modo === "registrar" ? "Registrar" : "Verificar")}
      </button>

      {resultado?.error && <div className="rp-error">{resultado.error}</div>}

      {banner && (
        <div
          className="rp-banner"
          style={{ color: banner.color, background: banner.bg, borderColor: banner.border }}
        >
          {resultado.resultado}
        </div>
      )}

      {resultado && !resultado.error && (
        <>
          <p className="rp-json-label">Detalle técnico</p>
          <pre className="rp-json">{JSON.stringify(resultado, null, 2)}</pre>
        </>
      )}
    </div>
  );
}

function Historial({ refreshKey }) {
  const [filas, setFilas] = useState([]);
  const [cargando, setCargando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const res = await fetch(API + "/historial");
      setFilas(await res.json());
    } catch {
      setFilas([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar, refreshKey]);

  return (
    <div className="rp-card">
      <div className="rp-historial-header">
        <h2>3. Historial de registros</h2>
        <button className="rp-btn-sm" onClick={cargar} disabled={cargando}>
          {cargando ? "Cargando..." : "Actualizar"}
        </button>
      </div>

      {filas.length === 0 && !cargando && (
        <p className="rp-empty">No hay registros todavía.</p>
      )}

      {filas.length > 0 && (
        <table className="rp-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Hash</th>
              <th>Archivo</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f) => (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td title={f.hash}>{f.hash.slice(0, 16)}…</td>
                <td>{f.archivo}</td>
                <td>{new Date(f.fecha).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
