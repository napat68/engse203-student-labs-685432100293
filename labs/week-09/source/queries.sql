-- ═══════════════════════════════════════════════════════════
-- queries.sql — คำสั่งค้นหาตอบโจทย์
-- ENGSE203 Week 09 · CP22
-- ═══════════════════════════════════════════════════════════

-- ① คำร้องทั้งหมด เรียงตามรหัส
SELECT *
FROM requests
ORDER BY id;

-- ② คำร้องที่ยังไม่ได้ดำเนินการ
SELECT *
FROM requests
WHERE status = 'pending'
ORDER BY id;

-- ③ คำร้องเร่งด่วนที่ยังไม่เสร็จ
SELECT *
FROM requests
WHERE priority = 'urgent'
  AND status <> 'completed'
ORDER BY id;

-- ④ ค้นคำร้องจากคำบางส่วนในรายละเอียด
SELECT *
FROM requests
WHERE details LIKE '%เครื่อง%';

-- ⑤ คำร้องพร้อมชื่อผู้แจ้ง
SELECT
    r.id,
    u.name AS requesterName,
    r.request_type,
    r.location,
    r.details,
    r.priority,
    r.status,
    r.created_at
FROM requests AS r
JOIN users AS u
    ON r.requester_id = u.id
ORDER BY r.id;

-- ⑥ คำร้องเฉพาะของภาควิชาหนึ่ง
SELECT
    r.id,
    u.name AS requesterName,
    u.department,
    r.request_type,
    r.location,
    r.priority,
    r.status
FROM requests AS r
JOIN users AS u
    ON r.requester_id = u.id
WHERE u.department = 'วิศวกรรมซอฟต์แวร์'
ORDER BY r.id;

-- ⑦ รายชื่อผู้แจ้งที่ไม่ซ้ำกัน
SELECT DISTINCT
    u.name AS requesterName
FROM requests AS r
JOIN users AS u
    ON r.requester_id = u.id
ORDER BY requesterName;

-- ⑧ คำร้อง 3 รายการล่าสุด
SELECT *
FROM requests
ORDER BY created_at DESC, id DESC
LIMIT 3;

-- ⭐ Challenge ─────────────────────────────────────────────

-- ⑨ นับจำนวนคำร้องแยกตามสถานะ
SELECT
    status,
    COUNT(*) AS requestCount
FROM requests
GROUP BY status
ORDER BY status;

-- ⑩ จำนวนคำร้องของผู้ใช้แต่ละคน
-- LEFT JOIN ทำให้ผู้ใช้ที่ยังไม่เคยแจ้งคำร้องยังแสดงในผลลัพธ์
SELECT
    u.id,
    u.name,
    COUNT(r.id) AS requestCount
FROM users AS u
LEFT JOIN requests AS r
    ON u.id = r.requester_id
GROUP BY u.id, u.name
ORDER BY requestCount DESC, u.id;

-- ⑪ สร้าง INDEX สำหรับคอลัมน์ที่ใช้ค้นหา/เชื่อมตารางบ่อย
CREATE INDEX IF NOT EXISTS idx_requests_status
ON requests(status);

CREATE INDEX IF NOT EXISTS idx_requests_requester_id
ON requests(requester_id);