# API Contract — Campus Service Request API

## 1. ข้อมูลทั่วไป

| หัวข้อ | รายละเอียด |
|---|---|
| **ชื่อระบบ** | Campus Service Request API |
| **เวอร์ชัน** | 2.0.0 |
| **Base URL (พัฒนา)** | `http://localhost:3001` |
| **Base URL (ใช้งานจริง)** | ยังไม่มี |
| **รูปแบบข้อมูล** | JSON (`Content-Type: application/json`) |
| **การยืนยันตัวตน** | ยังไม่มีในเวอร์ชันนี้ |
| **ผู้จัดทำ** | นภัสประภา กุลสุทธิเสถียร 685432100293 |
| **วันที่ปรับปรุงล่าสุด** | 05/10/2026 |

---

## 2. ภาพรวมระบบ

Campus Service Request เป็นระบบรับคำร้องขอใช้บริการภายในมหาวิทยาลัย สำหรับให้นักศึกษาและบุคลากรแจ้งปัญหาหรือขอใช้บริการผ่านเว็บแอปพลิเคชัน เจ้าหน้าที่สามารถตรวจสอบรายการคำร้อง ติดตามสถานะ และดำเนินการกับคำร้องแต่ละรายการได้

API ทำหน้าที่เป็นส่วน Backend สำหรับให้บริการข้อมูลแก่ React Frontend ผ่าน RESTful API โดยแยกส่วนจัดการข้อมูลออกจากส่วนแสดงผลอย่างชัดเจน

---

## 3. โครงสร้างข้อมูลหลัก

### Request (คำร้อง)

| Field | ชนิด | จำเป็น | ข้อจำกัด | ตัวอย่าง |
|---|---|:---:|---|---|
| `id` | string | — | เซิร์ฟเวอร์สร้างให้ และขึ้นต้นด้วย `REQ-` | `"REQ-001"` |
| `requesterName` | string | ✓ | อย่างน้อย 2 ตัวอักษร | `"สมชาย ใจดี"` |
| `requestType` | string | ✓ | ต้องเป็นค่าที่ระบบกำหนด | `"แจ้งซ่อม"` |
| `location` | string | ✓ | ห้ามว่าง | `"ห้องปฏิบัติการ 301"` |
| `details` | string | ✓ | อย่างน้อย 10 ตัวอักษร | `"เครื่องปรับอากาศไม่ทำงาน"` |
| `priority` | string | ✓ | `normal` หรือ `urgent` | `"urgent"` |
| `status` | string | — | เซิร์ฟเวอร์กำหนด เริ่มต้นเป็น `pending` | `"pending"` |

### ค่าที่ยอมรับของ `requestType`

- `แจ้งซ่อม`
- `บริการบัญชีผู้ใช้`
- `ขอใช้อุปกรณ์`
- `อื่น ๆ`

### ค่าที่ยอมรับของ `status`

| ค่า | ความหมาย |
|---|---|
| `pending` | รอดำเนินการ |
| `in-progress` | กำลังดำเนินการ |
| `completed` | เสร็จสิ้น |

---

## 4. สรุป Endpoint ทั้งหมด

| # | Method | Endpoint | รายละเอียด | สำเร็จ | ผิดพลาด |
|---|---|---|---|---|---|
| 1 | `GET` | `/api/requests` | ดูคำร้องทั้งหมด | `200` | — |
| 2 | `GET` | `/api/requests?status=` | กรองคำร้องตามสถานะ | `200` | — |
| 3 | `GET` | `/api/requests/:id` | ดูคำร้องตาม ID | `200` | `404` |
| 4 | `POST` | `/api/requests` | สร้างคำร้องใหม่ | `201` | `400` |
| 5 | `PUT` | `/api/requests/:id` | เปลี่ยนสถานะคำร้อง | `200` | `400`, `404` |
| 6 | `DELETE` | `/api/requests/:id` | ลบคำร้อง | `204` | `404` |

---

## 5. รายละเอียดแต่ละ Endpoint

### 5.1 `GET /api/requests` — ดูคำร้องทั้งหมด

คืนรายการคำร้องทั้งหมดในระบบ และสามารถกรองตามสถานะได้

#### Query Parameters

| ชื่อ | จำเป็น | ค่าที่ใช้ได้ |
|---|:---:|---|
| `status` | — | `pending`, `in-progress`, `completed` |

#### ตัวอย่าง Request

```http
GET /api/requests?status=pending HTTP/1.1
Host: localhost:3001
```

#### Response — `200 OK`

```json
[
  {
    "id": "REQ-001",
    "requesterName": "สมชาย ใจดี",
    "requestType": "แจ้งซ่อม",
    "location": "ห้องปฏิบัติการ 301",
    "details": "เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า",
    "priority": "urgent",
    "status": "pending"
  }
]
```

กรณีไม่มีข้อมูล API จะคืน Array ว่างพร้อม `200 OK`

```json
[]
```

---

### 5.2 `GET /api/requests/:id` — ดูคำร้องรายการเดียว

ค้นหาและคืนข้อมูลคำร้องตาม `id`

#### Path Parameters

| ชื่อ | ชนิด | ตัวอย่าง |
|---|---|---|
| `id` | string | `REQ-001` |

#### Response — `200 OK`

```json
{
  "id": "REQ-001",
  "requesterName": "สมชาย ใจดี",
  "requestType": "แจ้งซ่อม",
  "location": "ห้องปฏิบัติการ 301",
  "details": "เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า",
  "priority": "urgent",
  "status": "pending"
}
```

#### Response — `404 Not Found`

```json
{
  "error": "ไม่พบคำร้องตามรหัสที่ระบุ"
}
```

---

### 5.3 `POST /api/requests` — สร้างคำร้องใหม่

สร้างคำร้องใหม่ โดยเซิร์ฟเวอร์จะสร้าง `id` และกำหนด `status` เริ่มต้นเป็น `pending`

#### Request Body

```json
{
  "requesterName": "สุภาวดี รักเรียน",
  "requestType": "ขอใช้อุปกรณ์",
  "location": "ห้องประชุม 2",
  "details": "ขอยืมโปรเจกเตอร์สำหรับนำเสนอ",
  "priority": "normal"
}
```

#### Response — `201 Created`

```json
{
  "id": "REQ-MTYOA3MX-YEX9",
  "requesterName": "สุภาวดี รักเรียน",
  "requestType": "ขอใช้อุปกรณ์",
  "location": "ห้องประชุม 2",
  "details": "ขอยืมโปรเจกเตอร์สำหรับนำเสนอ",
  "priority": "normal",
  "status": "pending"
}
```

#### Response — `400 Bad Request`

เมื่อข้อมูลไม่ผ่าน Validation:

```json
{
  "error": "ข้อมูลคำร้องไม่ถูกต้อง",
  "details": [
    "ข้อมูลที่ส่งมาไม่ผ่านเงื่อนไขของระบบ"
  ]
}
```

---

### 5.4 `PUT /api/requests/:id` — เปลี่ยนสถานะคำร้อง

ใช้สำหรับเปลี่ยนสถานะของคำร้องที่มีอยู่ โดยสถานะใหม่ต้องเป็น `pending`, `in-progress` หรือ `completed`

#### Path Parameters

| ชื่อ | ชนิด | ตัวอย่าง |
|---|---|---|
| `id` | string | `REQ-001` |

#### Request Body

```json
{
  "status": "in-progress"
}
```

#### Response — `200 OK`

```json
{
  "id": "REQ-001",
  "requesterName": "สมชาย ใจดี",
  "requestType": "แจ้งซ่อม",
  "location": "ห้องปฏิบัติการ 301",
  "details": "เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า",
  "priority": "urgent",
  "status": "in-progress"
}
```

#### Response — `400 Bad Request`

เกิดขึ้นเมื่อส่งสถานะที่ระบบไม่รองรับ

```json
{
  "error": "สถานะต้องเป็น pending, in-progress หรือ completed"
}
```

#### Response — `404 Not Found`

เกิดขึ้นเมื่อไม่พบคำร้องตาม `id`

```json
{
  "error": "ไม่พบคำร้องตามรหัสที่ระบุ"
}
```

---

### 5.5 `DELETE /api/requests/:id` — ลบคำร้อง

ลบคำร้องตาม `id` ที่ระบุ

#### Path Parameters

| ชื่อ | ชนิด | ตัวอย่าง |
|---|---|---|
| `id` | string | `REQ-001` |

#### Response — `204 No Content`

ลบสำเร็จและ **ไม่มี Response Body ส่งกลับ**

หลังจากลบแล้ว หากเรียก `GET` ด้วย ID เดิม จะได้รับ `404 Not Found`

หากสั่งลบ ID เดิมซ้ำอีกครั้ง จะได้รับ `404 Not Found`

#### Response — `404 Not Found`

```json
{
  "error": "ไม่พบคำร้องตามรหัสที่ระบุ"
}
```

---

## 6. รูปแบบ Error มาตรฐาน

Error Response ของ API ใช้ JSON และมี Field `error`

```json
{
  "error": "ข้อความอธิบายข้อผิดพลาด"
}
```

กรณี Validation สามารถมี `details` เพิ่มเติมเพื่อระบุรายละเอียดของข้อมูลที่ไม่ถูกต้อง

```json
{
  "error": "ข้อมูลคำร้องไม่ถูกต้อง",
  "details": [
    "รายละเอียดของข้อมูลที่ไม่ถูกต้อง"
  ]
}
```

### Status Code ที่ใช้

| Status | ความหมาย | การจัดการฝั่ง Client |
|---|---|---|
| `200` | ดำเนินการสำเร็จและมีข้อมูลตอบกลับ | แสดงหรืออัปเดตข้อมูล |
| `201` | สร้างข้อมูลสำเร็จ | แสดงรายการที่สร้าง |
| `204` | ดำเนินการสำเร็จและไม่มี Response Body | อัปเดตหน้าจอโดยไม่ Parse Body |
| `400` | Request ไม่ถูกต้อง | แสดงข้อผิดพลาดให้ผู้ใช้แก้ไข |
| `404` | ไม่พบ Resource | แสดงข้อความไม่พบข้อมูล |
| `500` | Internal Server Error | แจ้งให้ผู้ใช้ลองใหม่ |

ใน Production ระบบจะไม่ส่ง Stack Trace กลับไปยัง Client

---

## 7. CORS

API อนุญาต Origin ตามค่าที่กำหนดใน Environment Variable `CORS_ORIGIN`

ค่าเริ่มต้นสำหรับการพัฒนา:

```text
Access-Control-Allow-Origin: http://localhost:5173
```

การทดสอบ Automated Test ได้ตรวจสอบ CORS Header จาก Origin `http://localhost:5173` และผ่านการทดสอบ

---

## 8. Environment Variables

### API

| ตัวแปร | ค่าเริ่มต้น | คำอธิบาย |
|---|---|---|
| `PORT` | `3001` | Port ของ API Server |
| `CORS_ORIGIN` | `http://localhost:5173` | Origin ที่อนุญาต |
| `NODE_ENV` | `development` | Environment ของระบบ |

### Frontend

| ตัวแปร | ค่าเริ่มต้น | คำอธิบาย |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:3001` | Base URL สำหรับเรียก API |

ไฟล์ `.env` และ `.env.local` ใช้สำหรับการพัฒนาในเครื่องและไม่ถูก Commit เข้าสู่ Repository

---

## 9. วิธีรันระบบ

ระบบต้องเปิด API และ Frontend แยกกัน

### Terminal 1 — API

```bash
cd api
npm install
npm run dev
```

API:

```text
http://localhost:3001
```

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 10. Automated Testing

ระบบใช้ Node Test Runner และ Supertest สำหรับทดสอบ API

ทดสอบทั้งหมด 6 Test Cases:

1. GET รายการคำร้องทั้งหมด → `200`
2. GET คำร้องที่มีอยู่ → `200`
3. GET คำร้องที่ไม่มีอยู่ → `404`
4. POST ข้อมูลถูกต้อง → `201` และ `status = pending`
5. POST ข้อมูลไม่ครบ → `400`
6. ตรวจสอบ CORS Header

ผลการทดสอบ:

```text
tests 6
pass 6
fail 0
```

ผล LAB Checker:

```text
36/36 PASS
```

---

## 11. ประวัติการเปลี่ยนแปลง

| เวอร์ชัน | วันที่ | รายละเอียด | Breaking |
|---|---|---|:---:|
| 1.0.0 | ก่อน LAB 07 | รองรับ GET, POST และ DELETE | — |
| 2.0.0 | 05/10/2026 | เพิ่ม PUT, CORS, Environment Configuration, Error Handling, Logging และ Automated Testing | ไม่ |

---

## 12. Checklist ก่อนส่ง

- [x] ระบุ Base URL และรูปแบบข้อมูล
- [x] ระบุโครงสร้างข้อมูลและข้อจำกัด
- [x] ระบุ Endpoint ครบทั้ง 6 รายการ
- [x] ระบุ Request และ Response
- [x] ระบุกรณี Error และ HTTP Status Code
- [x] ระบุรูปแบบ Error
- [x] ระบุ CORS
- [x] ระบุ Environment Variables
- [x] ระบุวิธีรันระบบ
- [x] ระบุ Automated Testing
- [x] ระบุประวัติการเปลี่ยนแปลง
- [x] ตรวจสอบและลบข้อความ Template ที่ไม่เกี่ยวข้องออกเรียบร้อยแล้ว