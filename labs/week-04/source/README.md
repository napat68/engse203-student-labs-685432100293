# ENGSE203 LAB 4 — Student Evidence README

## ผู้จัดทำ

- ชื่อ–นามสกุล: Napatprapa
- รหัสนักศึกษา: 685432100293
- Section: SEC1

## URLs

- Repository: https://github.com/napat68/engse203-student-labs-685432100293
- Pull Request: Pending
- GitHub Pages: https://napat68.github.io/engse203-student-labs-685432100293/

## Component Tree

```text
App
├── AppHeader
├── SummaryPanel
├── RequestForm
├── FilterBar
└── RequestList
    └── RequestCard
```

`App` เป็นเจ้าของ state หลักของระบบ ได้แก่ `requests` และ `statusFilter`
ส่วน `RequestForm` เป็นเจ้าของ `formData`, validation errors และ feedback ของฟอร์ม

## Setup และ Run

```bash
npm install
npm run dev
npm run check
npm run build
npm run preview
```

## State / Props / Callback Explanation

ระบบใช้ React State เพื่อควบคุมข้อมูลแทนการแก้ไข DOM โดยตรง

- `App` เก็บ `requests` ด้วย `useState(initialRequests)`
- `App` เก็บ `statusFilter` เพื่อควบคุมการกรองสถานะ
- `RequestForm` เก็บ `formData`, `errors` และ `feedback`
- ข้อมูลถูกส่งจาก Parent ไป Child ผ่าน Props
- Child Component ส่งเหตุการณ์กลับ Parent ผ่าน Callback
- การเพิ่มข้อมูลใช้ immutable update `[newRequest, ...currentRequests]`
- การลบข้อมูลใช้ `filter()` โดยไม่แก้ไข Array เดิม

## Test Evidence

| Test ID | Actual Result | Pass/Fail | Evidence/Screenshot |
|---|---|---|---|
| TC-01 Initial | แสดงรายการเริ่มต้นและ Summary ได้ถูกต้อง | PASS | Manual test |
| TC-02 Controlled input | ค่าในฟอร์มเปลี่ยนตาม React state | PASS | Manual test |
| TC-03 Invalid | ไม่เพิ่มรายการและแสดง validation error | PASS | Manual test |
| TC-04 Valid add | เพิ่มคำร้องสถานะ pending และ reset form | PASS | Manual test |
| TC-05 Filter | กรองรายการตามสถานะที่เลือก | PASS | Manual test |
| TC-06 All | แสดงรายการทุกสถานะเมื่อเลือก All | PASS | Manual test |
| TC-07 Empty | แสดง empty state เมื่อไม่มีรายการ | PASS | Manual test |
| TC-08 Delete | ลบรายการตาม id และ Summary อัปเดต | PASS | Manual test |
| TC-09 Mobile | Layout รองรับหน้าจอ 375px | PASS | Manual test |
| TC-10 Keyboard | Form มี label, focus และ validation feedback | PASS | Manual test |
| TC-11 Build | Production build สำเร็จ | PASS | npm run build |
| TC-12 Pages | ตรวจสอบหลัง Deploy GitHub Pages | Pending | GitHub Pages |

## Screenshots

หลักฐาน Screenshot จะจัดเก็บใน `evidence/`

- Desktop: `evidence/desktop.png`
- Mobile 375px: `evidence/mobile-375.png`
- Validation / Empty State: `evidence/validation.png`

## Week 03 → Week 04 Reflection

Week 03 เน้นการจัดการหน้าเว็บด้วย JavaScript และ DOM ขณะที่ Week 04 เปลี่ยนมาใช้แนวคิด State-driven UI ของ React โดยแบ่งส่วนติดต่อผู้ใช้ออกเป็น Component ที่นำกลับมาใช้ซ้ำได้ ข้อมูลถูกส่งผ่าน Props และเหตุการณ์จาก Child Component ส่งกลับไปยัง Parent ผ่าน Callback การเปลี่ยนแปลงข้อมูลใช้ State และ immutable update ทำให้โครงสร้างโปรแกรมแยกหน้าที่ชัดเจนและดูแลรักษาง่ายขึ้น

## AI / External Resource Disclosure

ใช้ ChatGPT เป็นเครื่องมือช่วยอธิบายโจทย์ ตรวจสอบแนวทางการใช้ React State, Props, Callback, Controlled Form และ Validation รวมถึงช่วยตรวจสอบโครงสร้างโค้ดตาม LAB requirements โดยทดสอบผลลัพธ์ด้วย LAB checker และ Manual Test ก่อนส่งงาน