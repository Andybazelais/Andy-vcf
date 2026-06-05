# ᴀɴᴅʏ sᴡɪғᴛᴛ ʟʟᴄ — VCF Contact Hub

Clone egzak sit la ak design cyberpunk/terminal, MongoDB backend, ak deploy Render.

---

## 📁 Strukti fichye

```
andy-vcf/
├── public/
│   └── index.html      ← Frontend (HTML/CSS/JS)
├── server.js           ← Backend Express + MongoDB
├── package.json
└── README.md
```

> ⚠️ Deplase `index.html` anndan yon dosye `public/` avan deploy!

---

## 🚀 Deploy sou Render (gratis)

### 1. Prepare repo GitHub
```bash
git init
git add .
git commit -m "init andy-vcf"
# Kreye repo sou GitHub lèzòt, push li
git remote add origin https://github.com/TON-USERNAME/andy-vcf.git
git push -u origin main
```

### 2. Konfigire MongoDB Atlas
- Ale sou https://cloud.mongodb.com
- Cluster: `cluster0.wotbgvp.mongodb.net`
- User: `andybazelais380_db_user`
- Ajoute modpas ou nan string la nan server.js oswa via env variable

### 3. Deploy sou Render
1. Ale sou https://render.com → "New Web Service"
2. Konekte repo GitHub ou a
3. **Settings:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`
4. **Environment Variables:**
   ```
   MONGO_URI = mongodb+srv://andybazelais380_db_user:MOTDEPAS@cluster0.wotbgvp.mongodb.net/andy-vcf?retryWrites=true&w=majority
   PORT = 3000
   ```
5. ✅ Deploy!

---

## 🔌 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/count` | Retounen total contacts |
| POST | `/api/register` | `{ name, phone }` → Anrejistre contact |
| POST | `/api/download` | `{ phone?, name? }` → Verifye + retounen .vcf |

---

## ✨ Fonksyonalite

- ✅ Loading screen animé ak logo AS
- ✅ Design cyberpunk/terminal (noir + cyan + violet)
- ✅ Grid background + scanlines
- ✅ Compteur animé + barre de progression
- ✅ Formulaire enregistrement (collapsible)
- ✅ Verrouillage téléchargement (500 contacts requis)
- ✅ Vérification avant download (dwe enrejistre pou telechaje)
- ✅ Génération VCF automatique
- ✅ Bilingue EN / FR
- ✅ Toast notifications
- ✅ MongoDB Atlas pour stockage
- ✅ Refresh automatique du compteur (30s)
