const REQUEST_TYPES = ['แจ้งซ่อม', 'บริการบัญชีผู้ใช้', 'ขอใช้อุปกรณ์', 'อื่น ๆ'];
const PRIORITIES = ['normal', 'urgent'];

/** ตัวช่วยอ่านข้อความอย่างปลอดภัย — ให้มาแล้ว */
function readText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function validateRequest(req, res, next) {
  const requesterName = readText(req.body.requesterName);
  const requestType = readText(req.body.requestType);
  const location = readText(req.body.location);
  const details = readText(req.body.details);
  const priority = readText(req.body.priority);

  const errors = [];

  if (!requesterName) {
    errors.push('requesterName จำเป็นต้องระบุ');
  }

  if (!requestType) {
    errors.push('requestType จำเป็นต้องระบุ');
  } else if (!REQUEST_TYPES.includes(requestType)) {
    errors.push('requestType ไม่ถูกต้อง');
  }

  if (!location) {
    errors.push('location จำเป็นต้องระบุ');
  }

  if (!details) {
    errors.push('details จำเป็นต้องระบุ');
  } else if (details.length < 10) {
    errors.push('details ต้องมีอย่างน้อย 10 ตัวอักษร');
  }

  if (!priority) {
    errors.push('priority จำเป็นต้องระบุ');
  } else if (!PRIORITIES.includes(priority)) {
    errors.push('priority ไม่ถูกต้อง');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'ข้อมูลไม่ถูกต้อง',
      details: errors
    });
  }

  next();
}