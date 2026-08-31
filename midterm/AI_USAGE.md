# AI Usage Log — สอบกลางภาค

ชื่อ-รหัส: นางสาวนภัสประภา กุลสุทธิเสถียร 68543210029-3

บันทึกทุกครั้งที่ใช้ AI ระหว่างสอบ

| เวลา | งาน (B1/B2/B3/B4) | ถาม AI ว่าอะไร | ใช้คำตอบส่วนไหน | แก้เอง/ตรวจสอบอย่างไร |
|---|---|---|---|---|
| 11:18 | B1 | ตรวจสอบสาเหตุ React เตือนเรื่อง unique key ใน RequestList | เพิ่ม `key={request.id}` ให้ RequestCard ใน `map()` | ตรวจโค้ด RequestList.jsx และทดสอบหน้า Dashboard/Console หลังแก้ |
| 11:34 | B1 | ตรวจสอบสาเหตุ summary pending นับผิด | ตรวจเงื่อนไข status และแก้ `completed` เป็น `pending` | ตรวจ DashboardPage.jsx และทดสอบ Summary รวมถึงตรวจ localStorage |
| 11:45 | B1 | ตรวจสอบสาเหตุตัวกรองสถานะแสดงรายการไม่ตรงกับที่เลือก | ตรวจเงื่อนไข filteredRequests และเปลี่ยน `!==` เป็น `===` | ทดสอบเลือก pending แล้วพบว่าแสดงเฉพาะรายการสถานะ pending |
| 11:48 | B1 | ตรวจสอบสาเหตุเปลี่ยน requestId ใน URL แล้วข้อมูลไม่เปลี่ยน | ตรวจ dependency ของ `useEffect` และเพิ่ม `requestId` | ทดสอบเปลี่ยน URL จาก REQ-001 เป็น REQ-002 แล้วข้อมูลเปลี่ยนตามทันที |
| 11:58 | B1 | ตรวจสอบสาเหตุลบข้อมูลแล้ว card ยังอยู่จน refresh | ตรวจ state หลัง `deleteRequest` และใช้ `nextRequests` | แก้ `setRequests(requests)` เป็น `setRequests(nextRequests)` และทดสอบว่าการ์ดหายทันที |
| 12:09 | B1 | ตรวจสอบสาเหตุกด Reset Demo Data แล้วหน้าพัง | ตรวจ async/await ของ `resetRequests` | ตรวจ service พบว่า resetRequests เป็น async จึง `await` ก่อน setRequests และทดสอบข้อมูลกลับมา 5 รายการ |
| 12:22 | B2 | เพิ่มช่องค้นหาแบบ controlled input | เพิ่ม state searchText และผูก value/onChange กับ input | ทดสอบพิมพ์ข้อความได้ และรายการยังไม่ถูกกรองตาม checkpoint B2.1 |
| 12:29 | B2 | ทำระบบค้นหาจากชื่อผู้แจ้งหรือรายละเอียด | ใช้ `trim()`, `toLowerCase()` และ `includes()` เพื่อค้นหาแบบไม่สนตัวพิมพ์เล็กใหญ่ | ทดสอบค้นคำว่า `ห้อง` แล้วแสดงเฉพาะ REQ-002 และ REQ-003 |
| 12:34 | B2 | รวมการค้นหากับตัวกรองสถานะ | เพิ่ม `matchesStatus` และ `matchesSearch` แล้วใช้เงื่อนไข `&&` | ทดสอบค้น
`ห้อง` พร้อมเลือกเสร็จสิ้น แล้วเหลือเฉพาะ REQ-003 |
| 12:45 | B2 | เพิ่มข้อความเมื่อค้นหาไม่พบ และตรวจว่า summary ยังใช้ข้อมูลทั้งหมด | แก้ RequestList ให้แสดงข้อความเมื่อ requests ว่าง และคง summary จาก requests เดิม | ทดสอบค้น `zzz` แล้วไม่พบรายการ พร้อมตรวจ summary ยังเป็น 5/3/1/1 |
| 12:57 | B3 | เพิ่มปุ่มทำเสร็จเฉพาะคำร้องที่ยังไม่ completed | เพิ่ม `onMarkDone` callback จาก Dashboard ผ่าน RequestList ไป RequestCard และตรวจ `request.status !== 'completed'` | ทดสอบพบปุ่มใน REQ-001, REQ-002, REQ-004, REQ-005 และไม่มีปุ่มใน REQ-003 |
| 13:10 | B3 | เชื่อมปุ่มทำเสร็จกับการอัปเดตสถานะ | เรียก `updateRequestStatus(requestId, 'completed')` และใช้ `setRequests(nextRequests)` พร้อมส่ง callback ผ่าน RequestList | ทดสอบ REQ-001 เปลี่ยนเป็น completed ทันที ปุ่มหาย และ summary เป็น 5/2/1/2 |
| 13:14 | B3 | ตรวจสอบว่าการเปลี่ยนสถานะยังคงอยู่หลัง refresh | ตรวจการ persist ผ่าน localStorage โดยไม่แก้ service | กด F5 แล้ว summary ยังเป็น 5/2/1/2 และตรวจพบ key `engse203-campus-requests-v1` ใน Local Storage |
| 13:19 | B4 | สร้าง PriorityBadge component สำหรับ priority พื้นฐาน | สร้าง component ให้ urgent แสดง `เร่งด่วน` และ normal แสดง `ปกติ` พร้อม class ตามโจทย์ | ตรวจโค้ดและรัน `npm run build` ว่า build ผ่าน โดยยังไม่เชื่อมกับ RequestCard ตาม checkpoint B4.1 |