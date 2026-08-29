import './style.css'

const form = document.querySelector('#profile-form')

const previewName = document.querySelector('#preview-name')
const previewRole = document.querySelector('#preview-role')
const previewGoal = document.querySelector('#preview-goal')

const goalCount = document.querySelector('#goal-count')
const formStatus = document.querySelector('#form-status')

function readForm() {
  return Object.fromEntries(new FormData(form).entries())
}

function renderPreview(data) {
  previewName.textContent =
    data.displayName.trim() || 'ยังไม่ระบุชื่อ'

  previewRole.textContent =
    data.learningRole || 'ยังไม่เลือกบทบาท'

  previewGoal.textContent =
    data.learningGoal.trim() || 'ยังไม่มีเป้าหมายการเรียนรู้'

  goalCount.textContent =
    `${data.learningGoal.length} ตัวอักษร`
}

function validate(data) {
  const errors = {}

  if (data.displayName.trim().length < 2) {
    errors.displayName = 'กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร'
  }

  if (!data.learningRole) {
    errors.learningRole = 'กรุณาเลือกบทบาทที่สนใจ'
  }

  if (data.learningGoal.trim().length < 10) {
    errors.learningGoal =
      'กรุณาระบุเป้าหมายการเรียนรู้อย่างน้อย 10 ตัวอักษร'
  }

  return errors
}

function renderErrors(errors) {
  const fieldNames = [
    'displayName',
    'learningRole',
    'learningGoal',
  ]

  for (const name of fieldNames) {
    const field = document.querySelector(`[name="${name}"]`)
    const errorOutput = document.querySelector(`#${name}-error`)
    const message = errors[name] ?? ''

    errorOutput.textContent = message
    field.setAttribute(
      'aria-invalid',
      String(Boolean(message)),
    )
  }
}

function renderStatus(state, message) {
  formStatus.dataset.state = state
  formStatus.textContent = message
}

function handleSubmit(event) {
  event.preventDefault()

  const data = readForm()
  const errors = validate(data)

  renderErrors(errors)

  if (Object.keys(errors).length > 0) {
    renderStatus(
      'invalid',
      'กรุณาตรวจสอบและแก้ไขข้อมูลที่ระบุ',
    )
    return
  }

  renderStatus(
    'success',
    'บันทึกข้อมูลแนะนำตัวเรียบร้อยแล้ว',
  )
}

form.addEventListener('input', () => {
  const data = readForm()

  renderPreview(data)
  renderStatus('idle', 'กำลังแก้ไขข้อมูล')
})

form.addEventListener('submit', handleSubmit)

form.addEventListener('reset', () => {
  window.setTimeout(() => {
    renderPreview(readForm())
    renderErrors({})
    renderStatus('idle', 'พร้อมเริ่มกรอกข้อมูลใหม่')
  }, 0)
})

renderPreview(readForm())
renderStatus('idle', 'พร้อมเริ่มกรอกข้อมูลใหม่')

console.log('PRE-LAB 3 Profile Card Builder ready')