# Campus Service — ENGSE203 LAB 11

ระบบจัดการคำร้องบริการภายในมหาวิทยาลัย (Campus Service Request Management System)

## 1. ภาพรวมระบบ

Campus Service เป็นเว็บแอปพลิเคชันสำหรับจัดการคำร้องขอรับบริการภายในมหาวิทยาลัย ผู้ใช้สามารถดูรายการคำร้อง เพิ่มคำร้องใหม่ เปลี่ยนสถานะ และลบคำร้องได้ โดยข้อมูลจะถูกจัดเก็บในฐานข้อมูล SQLite และยังคงอยู่หลังจากปิดและเปิดเซิร์ฟเวอร์ใหม่

เทคโนโลยีที่ใช้:
- **Frontend:** React และ Vite
- **Backend:** Node.js และ Express
- **Database:** SQLite (`node:sqlite`)
- **API:** REST API รับส่งข้อมูลรูปแบบ JSON

## 2. สถาปัตยกรรม 3 ชั้น (Three-Tier Architecture)

ระบบแบ่งการทำงานออกเป็น 3 ชั้น ดังนี้

**React (Frontend) → Express (API) → SQLite (Database)**

| ชั้น | หน้าที่ | ตำแหน่งไฟล์ |
|---|---|---|
| Frontend | แสดงหน้าจอ รับข้อมูลและส่ง HTTP Request | `frontend/` |
| Backend / API | รับ Request ตรวจสอบข้อมูล และประมวลผลคำสั่ง | `api/src/` |
| Database | จัดเก็บข้อมูลผู้ใช้และคำร้อง | `api/data/` |

เมื่อผู้ใช้เพิ่มคำร้อง React จะส่งข้อมูลผ่าน HTTP POST ไปยัง Express จากนั้น Route ส่งต่อไปยัง Controller และ Service เพื่อบันทึกข้อมูลลง SQLite แล้วส่งผลลัพธ์กลับมาแสดงบนหน้าเว็บ

## 3. วิธีรันระบบ Development

ต้องติดตั้ง Node.js เวอร์ชัน 22.13.0 ขึ้นไป

เปิด Terminal ที่โฟลเดอร์ `labs/week-11/source`

**Terminal 1 — Backend**

```bash
cd api
npm install
npm run dev
```

Backend ทำงานที่ `http://localhost:3001`

**Terminal 2 — Frontend**

```bash
cd frontend
npm install
npm run dev
```

Frontend ทำงานที่ `http://localhost:5173`

เปิดเบราว์เซอร์ที่ `http://localhost:5173` เพื่อใช้งานระบบ

## 4. วิธีรัน Production

Production จะ Build React เป็นไฟล์ Static และให้ Express ให้บริการทั้ง Frontend และ API ผ่านพอร์ตเดียว

เปิด Terminal ที่โฟลเดอร์ `labs/week-11/source`

```bash
npm run build
```

สำหรับ Windows PowerShell:

```powershell
$env:NODE_ENV="production"
$env:PORT="10000"
npm start
```

จากนั้นเปิด `http://localhost:10000`

ตรวจสอบสถานะระบบได้ที่ `http://localhost:10000/api/health`

หมายเหตุ: ต้องกำหนดคำสั่ง `build` และ `start` ใน `package.json` ระดับ `source/` ตาม CP43 ก่อนใช้งานคำสั่งนี้

## 5. Environment Variables

| ตัวแปร | ค่าเริ่มต้น | หน้าที่ |
|---|---|---|
| `NODE_ENV` | `development` | กำหนดโหมด Development หรือ Production |
| `PORT` | `3001` | กำหนดพอร์ตของ Backend |
| `CORS_ORIGIN` | `http://localhost:5173` | กำหนด Origin ที่อนุญาตให้เรียก API |
| `DB_FILE` | `api/data/campus.db` | ตำแหน่งไฟล์ฐานข้อมูล SQLite |
| `STATIC_DIR` | `frontend/dist` | ตำแหน่งไฟล์ Frontend หลัง Build |
| `VITE_API_BASE_URL` | ค่าว่างใน Production | กำหนด Base URL สำหรับ Frontend เรียก API |

ไม่ควร Commit ไฟล์ `.env` ที่มีข้อมูลลับขึ้น GitHub

## 6. API Endpoints

| Method | Endpoint | หน้าที่ |
|---|---|---|
| GET | `/api/requests` | ดูคำร้องทั้งหมด |
| GET | `/api/requests/:id` | ดูรายละเอียดคำร้อง |
| POST | `/api/requests` | เพิ่มคำร้อง |
| PUT | `/api/requests/:id` | เปลี่ยนสถานะคำร้อง |
| DELETE | `/api/requests/:id` | ลบคำร้อง |
| GET | `/api/users` | ดูรายชื่อผู้ใช้ |
| GET | `/api/health` | ตรวจสอบสถานะระบบ |

## 7. การตัดสินใจออกแบบระบบ

**เหตุผลที่แยกระบบเป็น 3 ชั้น**

การแยก Frontend, Backend และ Database ทำให้แต่ละส่วนมีหน้าที่ชัดเจน สามารถแก้ไขหรือพัฒนาแต่ละชั้นได้ง่ายขึ้น เช่น หากเปลี่ยนรูปแบบหน้าจอ React ก็ไม่จำเป็นต้องเปลี่ยนคำสั่ง SQL ใน Service

**เหตุผลที่เลือก SQLite**

ระบบมีข้อมูลที่มีโครงสร้างชัดเจน ได้แก่ ตาราง `users` และ `requests` ซึ่งเชื่อมโยงกันด้วย Foreign Key จึงเหมาะกับฐานข้อมูลเชิงสัมพันธ์อย่าง SQLite อีกทั้ง SQLite ไม่ต้องติดตั้ง Database Server แยก ทำให้สะดวกต่อการพัฒนาและทดสอบในเครื่อง

**การเตรียมระบบสำหรับ Production**

ระบบอ่านค่าการตั้งค่าจาก Environment Variables มี Health Check สำหรับตรวจสอบสถานะ และสามารถให้บริการ Frontend กับ Backend ผ่านพอร์ตเดียวได้

## 8. การตรวจสอบระบบ

รันคำสั่งต่อไปนี้จากโฟลเดอร์ `labs/week-11/source`

```bash
node --disable-warning=ExperimentalWarning check-week07.mjs
node --disable-warning=ExperimentalWarning check-week10.mjs
node --disable-warning=ExperimentalWarning check-week11.mjs
```

ผลการตรวจ Regression ก่อนเริ่มงาน Take-Home:
- Week07: 36/36
- Week10: 31/31
- Week11 In-class: 17/17

## 9. เอกสารประกอบ

- `API_CONTRACT.md` — รายละเอียด REST API และ Data Model
- `DATABASE_CHOICES.md` — คำตอบเรื่องการเลือกฐานข้อมูล (CP41)
- `DEMO.md` — ลิงก์วิดีโอสาธิตและอธิบาย Source Code (CP42)
- `AI_USAGE.md` — บันทึกการใช้ AI ช่วยพัฒนาและตรวจสอบงาน
