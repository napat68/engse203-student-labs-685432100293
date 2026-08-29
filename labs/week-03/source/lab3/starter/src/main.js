import './style.css';

const form = document.querySelector('#request-form');

const previewName = document.querySelector('#preview-name');
const previewType = document.querySelector('#preview-type');
const previewDetails = document.querySelector('#preview-details');

const previewStatus = document.querySelector('#preview-status');
const formStatus = document.querySelector('#form-status');
const detailsCount = document.querySelector('#details-count');
const requestList = document.querySelector('#request-list');

function readForm() {
  return Object.fromEntries(new FormData(form).entries());
}

function renderPreview(data) {
  previewName.textContent =
    data.requesterName.trim() || 'ยังไม่ระบุชื่อ';

  previewType.textContent =
    data.requestType || 'ยังไม่ได้เลือกประเภทคำขอ';

  previewDetails.textContent =
    data.details.trim() || 'ยังไม่มีรายละเอียด';

  detailsCount.textContent =
    `${data.details.length} Characters`;
}

function validate(data) {
  const errors = {};

  if (data.requesterName.trim().length < 2) {
    errors.requesterName =
      'Please enter at least 2 characters.';
  }

  if (!data.requestType) {
    errors.requestType =
      'Please select a request type.';
  }

  if (data.details.trim().length < 10) {
    errors.details =
      'Please enter at least 10 characters.';
  }

  return errors;
}

function renderErrors(errors) {
  const fieldNames = [
    'requesterName',
    'requestType',
    'details',
  ];

  for (const name of fieldNames) {
    const field = document.querySelector(`[name="${name}"]`);
    const errorOutput = document.querySelector(`#${name}-error`);

    const message = errors[name] ?? '';

    errorOutput.textContent = message;

    field.setAttribute(
      'aria-invalid',
      String(Boolean(message)),
    );
  }
}

function renderStatus(state, message) {
  formStatus.dataset.state = state;
  formStatus.textContent = message;

  previewStatus.dataset.state = state;
  previewStatus.textContent = message;
}

function addRequest(data) {
  const item = document.createElement('li');

  const title = document.createElement('strong');
  title.textContent =
    `${data.requesterName} — ${data.requestType}`;

  const details = document.createElement('p');
  details.textContent = data.details;

  item.append(title, details);
  requestList.append(item);
}

function resetFormView() {
  renderPreview({
    requesterName: '',
    requestType: '',
    details: '',
  });

  renderErrors({});

  renderStatus(
    'idle',
    'Ready to fill the form',
  );
}

form.addEventListener('input', () => {
  const data = readForm();

  renderPreview(data);

  renderStatus(
    'idle',
    'Editing request...',
  );
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = readForm();
  const errors = validate(data);

  renderErrors(errors);

  if (Object.keys(errors).length > 0) {
    renderStatus(
      'invalid',
      'Please check the highlighted fields.',
    );

    return;
  }

  addRequest(data);

  renderStatus(
    'success',
    'Request submitted successfully.',
  );

  form.reset();

  window.setTimeout(() => {
    resetFormView();
  }, 800);
});

form.addEventListener('reset', () => {
  window.setTimeout(() => {
    resetFormView();
  }, 0);
});

resetFormView();

console.log('LAB 3 Campus Service Request ready');