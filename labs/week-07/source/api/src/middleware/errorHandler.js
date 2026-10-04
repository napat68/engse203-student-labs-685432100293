export class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = 'AppError';
    this.status = status;
  }
}

/** ใช้ห่อ async route handler เพื่อส่ง error ไปยัง errorHandler */
export function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/** จัดการ error ที่ส่งต่อมาจาก route */
export function errorHandler(err, req, res, next) {
  console.error('เกิดข้อผิดพลาด:', err.message);

  const status = err.status || 500;

  const response = {
    error: err.message || 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
  };

  // Development แสดง stack ได้ แต่ Production ห้ามส่ง stack trace
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(status).json(response);
}

/** จัดการกรณีไม่พบ route */
export function notFound(req, res) {
  res.status(404).json({
    error: `ไม่พบเส้นทาง ${req.method} ${req.originalUrl}`,
  });
}