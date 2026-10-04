# AI Usage

ในการพัฒนา LAB 07 — RESTful API, Validation & Error Handling ผู้จัดทำมีการใช้ AI เป็นเครื่องมือช่วยสนับสนุนการเรียนรู้และการพัฒนาระบบ โดยใช้สำหรับอธิบายแนวคิด ตรวจสอบข้อผิดพลาด และเสนอแนวทางในการแก้ไขโค้ด

## การใช้งาน AI

AI ถูกนำมาใช้ช่วยในหัวข้อต่อไปนี้

- อธิบายการเชื่อมต่อระหว่าง React Frontend และ Express API
- แนะนำแนวทางการตั้งค่า CORS และ Environment Variables
- ตรวจสอบการเรียกใช้งาน RESTful API ผ่าน Service Layer
- ช่วยวิเคราะห์และแก้ไข Validation และ Error Handling
- แนะนำการใช้งาน Morgan สำหรับบันทึก HTTP Request
- ช่วยออกแบบ Automated Test ด้วย Supertest
- ช่วยตรวจสอบและวิเคราะห์ผลจาก LAB Checker

## การตรวจสอบโดยผู้จัดทำ

ผู้จัดทำเป็นผู้ดำเนินการแก้ไขโค้ด ทดสอบระบบ และตรวจสอบผลลัพธ์ด้วยตนเองทุกขั้นตอน รวมถึงทดสอบการทำงานของ Frontend และ API ผ่าน Browser, Network DevTools และ Terminal

ผลการตรวจสอบสุดท้าย

- LAB Checker: **36/36 ผ่าน**
- Automated Test: **6/6 ผ่าน**
- Frontend สามารถเชื่อมต่อและรับส่งข้อมูลกับ REST API ได้สำเร็จ
- สามารถสร้างคำร้องผ่าน API และได้รับ HTTP Status `201 Created`