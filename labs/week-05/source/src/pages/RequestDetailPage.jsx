import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRequestById } from '../services/requestService.js';

function RequestDetailPage() {
  const { requestId } = useParams();

  const [request, setRequest] = useState(null);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadRequest() {
      try {
        setStatus('loading');
        setErrorMessage('');

        const result = await getRequestById(requestId);

        if (cancelled) return;

        if (!result) {
          setRequest(null);
          setStatus('not-found');
          return;
        }

        setRequest(result);
        setStatus('success');
      } catch (error) {
        if (cancelled) return;

        setErrorMessage(error.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
        setStatus('error');
      }
    }

    loadRequest();

    return () => {
      cancelled = true;
    };
  }, [requestId]);

  if (status === 'loading') {
    return (
      <section data-testid="page-request-detail">
        <div className="page-heading">
          <div>
            <p className="eyebrow dark">CP05a · REQUEST DETAIL</p>
            <h1>กำลังโหลดรายละเอียดคำร้อง...</h1>
          </div>
        </div>
      </section>
    );
  }

  if (status === 'error') {
    return (
      <section data-testid="page-request-detail">
        <div className="page-heading">
          <div>
            <p className="eyebrow dark">CP05a · REQUEST DETAIL</p>
            <h1>ไม่สามารถโหลดข้อมูลได้</h1>
            <p>{errorMessage}</p>
          </div>
        </div>
      </section>
    );
  }

  if (status === 'not-found') {
    return (
      <section data-testid="page-request-detail">
        <div className="page-heading">
          <div>
            <p className="eyebrow dark">CP05a · REQUEST DETAIL</p>
            <h1>ไม่พบคำร้อง</h1>
            <p>ไม่พบคำร้องรหัส {requestId}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section data-testid="page-request-detail">
      <div className="page-heading">
        <div>
          <p className="eyebrow dark">CP05a · REQUEST DETAIL</p>
          <h1>รายละเอียดคำร้อง</h1>
          <p>รหัสคำร้อง: {request.id}</p>
        </div>
      </div>

      <div className="panel">
        <h2>{request.title}</h2>
        <p><strong>ผู้แจ้ง:</strong> {request.requesterName}</p>
        <p><strong>ประเภท:</strong> {request.requestType}</p>
        <p><strong>สถานที่:</strong> {request.location}</p>
        <p><strong>รายละเอียด:</strong> {request.details}</p>
        <p><strong>สถานะ:</strong> {request.status}</p>
        <p><strong>ความเร่งด่วน:</strong> {request.priority}</p>
      </div>
    </section>
  );
}

export default RequestDetailPage;