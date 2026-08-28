import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import FilterBar from '../components/FilterBar.jsx';
import RequestForm from '../components/RequestForm.jsx';
import RequestList from '../components/RequestList.jsx';
import SummaryPanel from '../components/SummaryPanel.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import useManualReload from '../hooks/useManualReload.js';
import {
  addRequest,
  deleteRequest,
  getRequests,
  resetRequests,
} from '../services/requestService.js';

function DashboardPage() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loadState, setLoadState] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [reloadKey, reload] = useManualReload();

  const scenario = searchParams.get('scenario') ?? '';

  useEffect(() => {
    let cancelled = false;

    async function loadRequests() {
      try {
        setLoadState('loading');
        setErrorMessage('');

        const data = await getRequests({
          scenario: scenario || undefined,
        });

        if (cancelled) return;

        setRequests(data);
        setLoadState('success');
      } catch (error) {
        if (cancelled) return;

        setRequests([]);
        setErrorMessage(
          error.message || 'ไม่สามารถโหลดข้อมูลคำร้องได้'
        );
        setLoadState('error');
      }
    }

    loadRequests();

    return () => {
      cancelled = true;
    };
  }, [scenario, reloadKey]);

  const summary = useMemo(
    () => ({
      total: requests.length,
      pending: requests.filter(
        (request) => request.status === 'pending'
      ).length,
      inProgress: requests.filter(
        (request) => request.status === 'in-progress'
      ).length,
      completed: requests.filter(
        (request) => request.status === 'completed'
      ).length,
    }),
    [requests]
  );

  const filteredRequests =
    statusFilter === 'all'
      ? requests
      : requests.filter(
          (request) => request.status === statusFilter
        );

  function handleRetry() {
    if (scenario) {
      setSearchParams({});
      return;
    }

    reload();
  }

  async function handleAdd(input) {
  const newRequest = await addRequest(input);

  setRequests((current) => [
    ...current,
    newRequest,
  ]);
}

async function handleDelete(requestId) {
  const updatedRequests = await deleteRequest(requestId);
  setRequests(updatedRequests);
}

async function handleReset() {
  const seedRequests = await resetRequests();

  setRequests(seedRequests);
  setStatusFilter('all');
}

  return (
    <section data-testid="page-dashboard">
      <div className="page-heading">
        <div>
          <p className="eyebrow dark">
            CP03 · SERVICE DATA
          </p>
          <h1>Campus Service Request</h1>
          <p>
            โหลดข้อมูลคำร้องผ่าน Service Layer
          </p>
        </div>
      </div>

      {scenario && (
        <p className="notice" role="status">
          โหมดทดสอบ: {scenario}
        </p>
      )}

      {loadState === 'loading' && <LoadingState />}

      {loadState === 'error' && (
        <ErrorState
          message={errorMessage}
          onRetry={handleRetry}
        />
      )}

      {loadState === 'success' &&
        requests.length === 0 && (
          <div className="panel" data-testid="empty-state">
            <h2>ยังไม่มีคำร้อง</h2>
            <p>ขณะนี้ยังไม่มีข้อมูลคำร้องในระบบ</p>

            <Link
              to="/requests/new"
              className="primary-button"
            >
              สร้างคำร้องใหม่
            </Link>
          </div>
    )}

      {loadState === 'success' &&
        requests.length > 0 && (
          <>
            <SummaryPanel summary={summary} />

            <div className="page-actions">
              <button
                type="button"
                className="secondary-button"
                data-testid="reset-button"
                onClick={handleReset}
              >
                  คืนค่าข้อมูลตัวอย่าง
              </button>
            </div>

<div className="workspace-grid">
              <section className="panel form-panel">
                <RequestForm
                  onAddRequest={handleAdd}
                />
              </section>

              <section
                className="panel"
                aria-labelledby="request-list-title"
              >
                <div className="section-heading">
                  <h2 id="request-list-title">
                    รายการคำร้อง
                  </h2>

                  <FilterBar
                    value={statusFilter}
                    onFilterChange={setStatusFilter}
                  />
                </div>

                <RequestList
                  requests={filteredRequests}
                  onDeleteRequest={handleDelete}
                />
              </section>
            </div>
          </>
        )}
    </section>
  );
}

export default DashboardPage;