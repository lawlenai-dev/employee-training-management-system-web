const API_URL = import.meta.env.VITE_API_URL || '/api'

export async function api(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(data.message || 'เกิดข้อผิดพลาดจากระบบ')
    error.status = response.status
    error.details = data.errors
    throw error
  }
  return data
}

export const getCourses = () => api('/courses')
export const getCourse = (id) => api(`/courses/${id}`)
export const createCourse = (payload) => api('/courses', { method: 'POST', body: JSON.stringify(payload) })
export const getAttendance = (id) => api(`/courses/${id}/attendance`)
export const checkIn = (id, payload) => api(`/courses/${id}/attendance`, { method: 'POST', body: JSON.stringify(payload) })
export const getEmployees = (search = '') => api(`/employees?search=${encodeURIComponent(search)}`)
export const createEmployee = (payload) => api('/employees', { method: 'POST', body: JSON.stringify(payload) })
