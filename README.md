#  Estate — Registro y Certificación de Propiedades en Blockchain

**Estate** es una plataforma web que certifica la **integridad** y la **existencia temporal** de documentos vinculados a propiedades inmuebles —planos técnicos y escrituras legales— utilizando tecnología **blockchain pública**.

El sistema calcula la huella digital criptográfica (**hash SHA-256**) de cada documento y la registra de forma **inmutable** en la red **Ethereum Sepolia**, permitiendo verificar después si un documento fue alterado, **sin almacenar el documento en sí**.

> 🔗 **App pública:** https://estate-one-sable.vercel.app/
> 🔗 **Contrato en Etherscan:** https://sepolia.etherscan.io/address/0x1b1582aEFCB0AAD37294A5a7c5A7656d8C378baE

---

##  El problema

Los documentos que respaldan una propiedad (escrituras, planos de mensura, arquitectónicos y estructurales) circulan en formato digital y son susceptibles de **falsificación o manipulación**. La verificación de su autenticidad suele depender de la confianza en una entidad centralizada, cuyos registros internos también pueden alterarse sin dejar rastro público.

##  La solución

Estate registra únicamente el **hash** del documento en la blockchain. Como cualquier cambio —incluso de un solo byte— produce un hash completamente distinto, comparar el hash recalculado con el registrado permite **detectar cualquier alteración**.

- El documento **nunca** se sube a la blockchain (privacidad y bajo costo).
- El registro es **verificable públicamente** por cualquiera en Etherscan.
- La verificación es **independiente**: no requiere confiar en un intermediario.

---

##  Funcionalidades

- ✅ Registro de documentos por **categoría** (Planos / Documentos Legales) y **tipo**.
- ✅ Cálculo de **hash SHA-256** del documento.
- ✅ Registro del hash en **blockchain pública (Sepolia)**.
- ✅ **Verificación de integridad**: estados `INTACTO`, `MODIFICADO`, `NO REGISTRADO`.
- ✅ **Historial** de registros con metadatos.
- ✅ **Previsualización** de documentos PDF.
- ✅ Asistente por pasos (wizard) para el registro.

### Tipos de documento soportados

| Categoría | Tipos |
|-----------|-------|
| 📐 **Planos** | Mensura · Arquitectónico · Estructural |
| 📜 **Documentos Legales** | Compraventa · Donación · Sucesión |

---

##  Arquitectura

Arquitectura de tres capas desacopladas, cada una desplegada en un servicio especializado:

| Capa | Tecnología | Despliegue |
|------|-----------|-----------|
| **Frontend** | React + Vite | Vercel |
| **Backend** | Node.js + Express | Render |
| **Persistencia** | SQLite | Render |
| **Blockchain** | Solidity + Hardhat | Ethereum Sepolia |

**Flujo:** el frontend envía el documento → el backend calcula el hash SHA-256 → registra el hash en el contrato inteligente vía Ethers.js → guarda los metadatos en SQLite. La verificación lee el hash directamente desde la **blockchain** (fuente de verdad inmutable).

```
Usuario → Frontend (Vercel) → Backend (Render) → Contrato (Sepolia)
                                      ↓
                                  SQLite (metadatos)
```

---

## 🛠️ Tecnologías

- **Frontend:** React, Vite
- **Backend:** Node.js, Express, Multer, Ethers.js
- **Base de datos:** SQLite (better-sqlite3)
- **Blockchain:** Solidity, Hardhat, red Ethereum Sepolia
- **Hash:** SHA-256 (módulo `crypto` de Node.js)

---

##  Estructura del proyecto

```
registro-propiedades/
├── blockchain/                 # Solidity + Hardhat
│   ├── contracts/
│   │   └── RegistroPropiedades.sol
│   ├── scripts/
│   │   └── deploy.js
│   └── hardhat.config.js
├── backend/                    # Node.js + Express + SQLite
│   └── index.js
└── frontend/                   # React + Vite
    └── src/
        └── App.jsx
```

---

##  Ejecución local

> Requiere Node.js (v20+). El sistema apunta a la red pública Sepolia.

**1. Variables de entorno.** Crear `backend/.env` y `blockchain/.env` con:
```
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/TU_API_KEY
SEPOLIA_PRIVATE_KEY=0xTU_CLAVE_PRIVADA
CONTRACT_ADDRESS=0x1b1582aEFCB0AAD37294A5a7c5A7656d8C378baE
```
>  Los `.env` contienen secretos y **no se versionan** (están en `.gitignore`).

**2. Backend:**
```bash
cd backend
npm install
node index.js
```

**3. Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Abrir `http://localhost:5173/`.

---

##  Cómo se usa

1. **Registrar:** elegí categoría → tipo → completá los metadatos → subí el documento → *Registrar*. Devuelve el hash y el `txHash` (verificable en Etherscan).
2. **Verificar INTACTO:** mismo identificador + mismo documento → estado `INTACTO`.
3. **Verificar MODIFICADO:** mismo identificador + documento distinto → estado `MODIFICADO`.

---

##  Fundamento conceptual

**Qué garantiza Estate:**
- ✅ **Integridad documental** — que el documento no fue alterado desde su registro.
- ✅ **Existencia temporal** — que existía en un momento determinado.

**Qué NO garantiza (delimitación honesta):**
- ❌ La **veracidad** del contenido cargado.
- ❌ La **titularidad legal** del inmueble (depende del registro oficial).

Esto se conoce como el **problema del oráculo**: la blockchain no valida datos del mundo real, solo garantiza que, una vez registrados, no podrán alterarse. Estate lo resuelve como en la práctica: la veracidad la aporta un **actor autorizado** (profesional matriculado u organismo oficial), y la blockchain aporta **inmutabilidad** y **verificación pública**.

**¿Por qué blockchain y no una base de datos centralizada?** Porque una base centralizada puede ser modificada o vulnerada sin dejar rastro público. La blockchain aporta inmutabilidad, verificación pública independiente y trazabilidad temporal: protege incluso frente a la manipulación por parte de la propia autoridad.

---

##  Trabajo futuro

-  Autenticación de actores autorizados con control de roles.
-  Extracción automática de metadatos desde el documento.
-  Más tipos de documento e integración con registros oficiales.
-  Tokenización de la titularidad de la propiedad.

---

##  Limitaciones (prototipo)

- Opera sobre la red de prueba **Sepolia** (no la red principal).
- Sin autenticación ni roles: asume un operador autorizado.
- Carga de metadatos manual.
- En el plan gratuito de Render, la base de metadatos es temporal; la persistencia real reside en la blockchain.

---

##  Equipo

| Integrante             |       Rol                                                  |
|------------------------|------------------------------------------------------------|
| [Maximiliano Flores]   | [Desarrollo full-stack/Investigación de dominio / testing] |
| [Nazareno puchiarelli] | [Diseño y pitch]                                           |
| [Braian Choque]        | [Desarrollo full-stack/Investigación de dominio / testing] |

---

## 📚 Contexto académico

Proyecto desarrollado para **Teoría de la Computación II** — Licenciatura en Sistemas de Información, **Universidad Champagnat** (2026). Integra las líneas temáticas de Lenguajes de programación, Sistemas de tipos, y Seguridad e introducción a Blockchain, junto con el uso de Inteligencia Artificial como herramienta de ingeniería.
