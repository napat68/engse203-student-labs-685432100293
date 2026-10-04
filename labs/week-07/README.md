# LAB 07 — RESTful API, Validation & Error Handling

## รายละเอียด LAB

LAB 07 เป็นการพัฒนาต่อยอดระบบ Campus Service Request โดยเชื่อมต่อ React Frontend เข้ากับ Express REST API เพื่อให้ระบบสามารถรับส่งและจัดการข้อมูลผ่าน API ได้จริง พร้อมเพิ่ม Validation, Error Handling, Logging และ Automated Testing

## วัตถุประสงค์

- เชื่อมต่อ React Frontend กับ Express REST API
- ตั้งค่า CORS และ Environment Variables
- แยกการเรียก API ผ่าน API Client และ Service Layer
- รองรับ Loading State และ Error State
- รองรับการเปลี่ยนสถานะคำร้องผ่าน PUT Request
- เพิ่ม Validation และ Error Handling
- ใช้ Morgan สำหรับบันทึก HTTP Request
- จัดทำ API Contract
- ทดสอบ REST API ด้วย Supertest

## REST API

ระบบรองรับ Endpoint หลักดังนี้

| Method | Endpoint | รายละเอียด |
|---|---|---|
| GET | `/api/requests` | ดูรายการคำร้องทั้งหมด |
| GET | `/api/requests/:id` | ดูรายละเอียดคำร้องตาม ID |
| POST | `/api/requests` | สร้างคำร้องใหม่ |
| PUT | `/api/requests/:id` | เปลี่ยนสถานะคำร้อง |
| DELETE | `/api/requests/:id` | ลบคำร้อง |

## Validation และ Error Handling

ระบบมีการตรวจสอบข้อมูลก่อนสร้างคำร้อง รวมถึงตรวจสอบสถานะของคำร้องให้เป็นค่าที่ระบบรองรับ ได้แก่

- `pending`
- `in-progress`
- `completed`

นอกจากนี้ยังมี `AppError`, `asyncHandler` และ Error Middleware สำหรับจัดการข้อผิดพลาดของ API โดยใน Production จะไม่ส่ง Stack Trace กลับไปยังผู้ใช้งาน

## Automated Testing

ทดสอบ API ด้วย Node Test Runner และ Supertest จำนวน 6 Test Cases ได้แก่

1. GET รายการคำร้องทั้งหมด
2. GET คำร้องที่มีอยู่
3. GET คำร้องที่ไม่มีอยู่
4. POST ข้อมูลที่ถูกต้อง
5. POST ข้อมูลไม่ครบ
6. ตรวจสอบ CORS Header

ผลการทดสอบ:

- Automated Test: **6/6 ผ่าน**
- LAB Checker: **36/36 ผ่าน**

## หลักฐานการทดสอบ

หลักฐานการทำงานจัดเก็บไว้ในโฟลเดอร์ `evidence/`

- `app-working-api.png` — Frontend เชื่อมต่อกับ API และแสดงข้อมูลได้
- `network-post-201.png` — Network Request แสดง POST และ HTTP Status 201
- `api-terminal-morgan.png` — API Terminal แสดง HTTP Request ผ่าน Morgan
- `AI_USAGE.md` — รายละเอียดการใช้ AI เป็นเครื่องมือช่วยในการพัฒนา

## เทคโนโลยีที่ใช้

- React
- Vite
- Node.js
- Express
- CORS
- Morgan
- Supertest
- RESTful API

## สรุปผล

สามารถพัฒนาระบบให้ Frontend และ Backend ทำงานร่วมกันผ่าน REST API ได้สำเร็จ พร้อมรองรับการตรวจสอบข้อมูล การจัดการข้อผิดพลาด การบันทึก Request และ Automated Testing โดยผลการตรวจสอบ LAB ผ่านครบทุกหัวข้อ