<img width="1860" height="942" alt="image" src="https://github.com/user-attachments/assets/021490e2-eb92-4923-bdde-45f1dac0ce5d" /># 🌱 EcoAudit

An AI-ready waste auditing platform that helps users log waste disposal with geolocation, proof images, and interactive map visualization. EcoAudit promotes transparent waste tracking and encourages cleaner communities through digital record keeping.

---

## 🚀 Live Demo

**Frontend:** https://eco-audit-lbuo7ve13-adarshecoaudit.vercel.app

**Backend API:** https://eco-audit-p85i.onrender.com

---

## ✨ Features

- 📍 Automatic GPS location capture
- 🗺️ Interactive map visualization using Leaflet
- ♻️ Waste category selection
- ⚖️ Waste weight logging
- 📷 Proof of disposal image upload
- ☁️ MongoDB Atlas cloud database
- 🚫 Graceful handling of denied location permission
- 📌 Live map pin generation for every waste entry
- 📱 Responsive modern UI
- 🌍 Cloud deployment with Vercel and Render

---

## 🛠 Tech Stack

### Frontend
- React.js
- Vite
- Axios
- React Leaflet
- Leaflet
- CSS3

### Backend
- FastAPI
- Python
- PyMongo
- MongoDB Atlas
- python-dotenv

### Deployment
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

---

## 📂 Project Structure

```
EcoAudit/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── uploads/
│   ├── main.py
│   ├── requirements.txt
│   └── runtime.txt
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/adarshds1224-pixel/Eco-audit.git

cd Eco-audit
```

---

### Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt
```

Create a `.env` file

```env
MONGO_URL=your_mongodb_atlas_connection_string
```

Run the backend

```bash
uvicorn main:app --reload
```

Backend runs on

```
http://127.0.0.1:8000
```

---

### Frontend Setup

```bash
cd frontend

npm install
```

Create

```
.env
```

```env
VITE_API_URL=http://127.0.0.1:8000
```

Run

```bash
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

## 🌍 API Endpoints

### Get API Status

```
GET /
```

---

### Create Waste Log

```
POST /logs
```

Parameters

| Field | Type |
|--------|------|
| category | String |
| weight | Float |
| latitude | Float |
| longitude | Float |
| image | File |

---

### Fetch All Logs

```
GET /logs
```

---

## 📸 Screenshots
<img width="1860" height="942" alt="image" src="https://github.com/user-attachments/assets/9dc7c8fd-0dab-4536-bf6b-7bb71f6ff9ec" />
<img width="1180" height="936" alt="image" src="https://github.com/user-attachments/assets/f5b8805a-18a2-49ae-a27f-783db836b133" />

- Dashboard
- Waste Logging
- Interactive Map
- MongoDB Records

---

## 🔒 Environment Variables

Backend

```env
MONGO_URL=your_mongodb_connection_string
```

Frontend

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## 🚀 Future Improvements

- User authentication
- Waste analytics dashboard
- AI-based waste image classification
- Carbon footprint estimation
- Admin dashboard
- QR code verification
- PDF report generation
- Leaderboard and rewards
- Real-time notifications

---





## 👨‍💻 Author

**Adarsh S P L**

GitHub

https://github.com/adarshds1224-pixel

---

## 📄 License

This project is licensed under the MIT License.
