from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime
import os
import shutil

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "https://eco-audit-lbuo7ve13-adarshecoaudit.vercel.app",
        "https://eco-audit-sand.vercel.app",
        "http://localhost:5173",
    ],
    allow_credentials=True,

    allow_origins=["*"],
    allow_credentials=False,

    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

client = MongoClient(os.getenv("MONGO_URL"))
db = client["EcoAudit"]
logs_collection = db["waste_logs"]


@app.get("/")
def home():
    return {"message": "EcoAudit API running"}


@app.post("/logs")
async def create_log(
    category: str = Form(...),
    weight: float = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    image: UploadFile = File(None),
):
    image_url = None

    if image:
        filename = f"{datetime.utcnow().timestamp()}_{image.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        image_url = f"https://eco-audit-p85i.onrender.com/uploads/{filename}"

    data = {
        "category": category,
        "weight": weight,
        "latitude": latitude,
        "longitude": longitude,
        "image_url": image_url,
        "createdAt": datetime.utcnow(),
    }

    result = logs_collection.insert_one(data)

    return {
        "message": "Waste log saved successfully",
        "id": str(result.inserted_id),
    }


@app.get("/logs")
def get_logs():
    logs = []

    for log in logs_collection.find().sort("createdAt", -1):
        logs.append({
            "id": str(log["_id"]),
            "category": log["category"],
            "weight": log["weight"],
            "latitude": log["latitude"],
            "longitude": log["longitude"],
            "image_url": log.get("image_url"),
            "createdAt": log["createdAt"],
        })

    return logs
