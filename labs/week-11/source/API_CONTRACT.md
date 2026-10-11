# API Contract — Campus Service Request API

**เวอร์ชัน:** 2.0.0 · **Base URL:** `http://localhost:3001`
**รูปแบบข้อมูล:** JSON (`Content-Type: application/json`)

> **API Contract คืออะไร** — ข้อตกลงระหว่างคนทำ front-end กับคนทำ back-end
> ว่าจะคุยกันด้วย endpoint อะไร ส่งอะไรไป ได้อะไรกลับ
> มีไว้เพื่อให้สองฝั่ง**ทำงานคู่ขนานกันได้** โดยไม่ต้องรอกัน

---


## Data Model / ฐานข้อมูล SQLite

ระบบ Campus Service Request API ใช้ฐานข้อมูล SQLite
จัดเก็บข้อมูลถาวรในไฟล์ `api/data/campus.db`
โดยกำหนดโครงสร้างฐานข้อมูลใน `api/data/schema.sql`

### ตาราง users

ใช้จัดเก็บข้อมูลผู้ใช้งานและผู้ส่งคำร้อง
โดยมี `id` เป็น Primary Key

### ตาราง requests

ใช้จัดเก็บข้อมูลคำร้องขอบริการ ประกอบด้วย
รหัสคำร้อง ประเภทคำร้อง สถานที่ รายละเอียด
ระดับความสำคัญ และสถานะการดำเนินงาน

- `id` เป็น Primary Key ของคำร้อง
- `requester_id` เป็น Foreign Key อ้างอิง `users.id`
- `requesterName` เป็นชื่อผู้ส่งคำร้องที่ API คืนค่าจากการ JOIN ตาราง users

### ความสัมพันธ์ระหว่างตาราง

users (1) -------- (N) requests

ผู้ใช้งานหนึ่งคนสามารถสร้างคำร้องได้หลายรายการ
แต่คำร้องแต่ละรายการเชื่อมโยงกับผู้ใช้งานหนึ่งคน

### การจัดการข้อมูล

- ใช้ SQL JOIN เพื่อดึงชื่อผู้ส่งคำร้อง
- ใช้ Parameterized Query เพื่อลดความเสี่ยง SQL Injection
- เปิดใช้งาน `PRAGMA foreign_keys = ON`
- รองรับ CRUD ได้แก่ Create, Read, Update และ Delete
- ข้อมูลยังคงอยู่ใน SQLite หลังจาก Restart Server

## API Endpoints — Request Management

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/requests | Retrieve all requests |
| GET | /api/requests/:id | Retrieve a request by ID |
| POST | /api/requests | Create a new request |
| PUT | /api/requests/:id | Update request status |
| DELETE | /api/requests/:id | Delete a request |