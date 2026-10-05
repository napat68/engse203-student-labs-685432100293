# Week 10 — Evidence Report

## Node.js & Database Integration

**ผู้จัดทำ:** นภัสประภา กุลสุทธิเสถียร  
**รหัสนักศึกษา:** 685432100293  
**รายวิชา:** ENGSE203

---

## ผลการทำ LAB

LAB10 เป็นการพัฒนาต่อยอดจากฐานข้อมูล SQLite ใน Week 09 โดยนำฐานข้อมูล `campus.db` มาเชื่อมต่อกับ Node.js และ Express API ผ่าน Service Layer

ดำเนินการครบตาม Checkpoint ดังนี้

- CP26 — เชื่อมต่อ SQLite ด้วย `node:sqlite`
- CP27 — กำหนด Database Path ด้วย `import.meta.url`
- CP28 — อ่านข้อมูลด้วย SQL และ JOIN ตาราง `requests` กับ `users`
- CP29 — เพิ่มข้อมูลและแปลง `requesterName` เป็น `requester_id`
- CP30 — แก้ไขสถานะและลบข้อมูลด้วย UPDATE และ DELETE

## ผลการทดสอบ

Week 10 Lab Checker:

```text
20/20 PASS