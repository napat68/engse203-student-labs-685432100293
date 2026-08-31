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