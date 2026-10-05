# CP25 — Constraint Testing

การทดสอบนี้มีวัตถุประสงค์เพื่อตรวจสอบว่า Constraint ที่กำหนดไว้ในฐานข้อมูลสามารถป้องกันข้อมูลที่ไม่ถูกต้องได้จริง โดยทดสอบทั้งหมด 5 กรณี

## 1. FOREIGN KEY Constraint

**ทดสอบ:** เพิ่มคำร้องโดยกำหนด `requester_id = 99999` ซึ่งไม่มีอยู่ในตาราง `users`

**ผลลัพธ์:**

```text
FOREIGN KEY constraint failed
```

**สรุป:** ผ่าน — ฐานข้อมูลไม่อนุญาตให้สร้างคำร้องที่อ้างอิงผู้ใช้งานที่ไม่มีอยู่จริง

---

## 2. CHECK Constraint — status

**ทดสอบ:** เพิ่มคำร้องโดยกำหนดค่า `status` ที่ไม่ได้อยู่ในค่าที่ระบบอนุญาต

**ผลลัพธ์:**

```text
CHECK constraint failed: status IN (
    'pending',
    'in-progress',
    'completed'
)
```

**สรุป:** ผ่าน — ฐานข้อมูลยอมรับเฉพาะสถานะที่กำหนดไว้

---

## 3. UNIQUE Constraint — email

**ทดสอบ:** เพิ่มผู้ใช้งานใหม่โดยใช้อีเมลที่มีอยู่แล้วในตาราง `users`

**ผลลัพธ์:**

```text
UNIQUE constraint failed: users.email
```

**สรุป:** ผ่าน — ไม่สามารถมีผู้ใช้งานที่ใช้อีเมลซ้ำกันได้

---

## 4. UNIQUE Constraint — Request ID

**ทดสอบ:** เพิ่มคำร้องโดยใช้รหัส `REQ-001` ซึ่งมีอยู่แล้ว

**ผลลัพธ์:**

```text
UNIQUE constraint failed: requests.id
```

**สรุป:** ผ่าน — รหัสคำร้องแต่ละรายการต้องไม่ซ้ำกัน

---

## 5. NOT NULL Constraint — location

**ทดสอบ:** เพิ่มคำร้องโดยไม่กำหนดค่า `location`

**ผลลัพธ์:**

```text
NOT NULL constraint failed: requests.location
```

**สรุป:** ผ่าน — ทุกคำร้องต้องระบุสถานที่

---

## สรุปผลการทดสอบ

| การทดสอบ | Constraint | ผล |
|---|---|---|
| requester_id ที่ไม่มีอยู่จริง | FOREIGN KEY | PASS |
| status ที่ไม่อนุญาต | CHECK | PASS |
| email ซ้ำ | UNIQUE | PASS |
| request ID ซ้ำ | UNIQUE / PRIMARY KEY | PASS |
| ไม่ระบุ location | NOT NULL | PASS |

**ผลรวม: ผ่านการทดสอบ 5/5 กรณี**

Constraint ที่กำหนดในฐานข้อมูลสามารถป้องกันข้อมูลที่ไม่ถูกต้องได้ตามที่ออกแบบไว้