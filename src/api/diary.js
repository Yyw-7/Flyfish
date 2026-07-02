import request from './request'

export function getDiaries() {
  return request('/api/diaries')
}

export function addDiary(diary) {
  return request('/api/diaries', {
    method: 'POST',
    body: JSON.stringify(diary)
  })
}

export function updateDiary(id, updates) {
  return request(`/api/diaries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  })
}

export function deleteDiary(id) {
  return request(`/api/diaries/${id}`, {
    method: 'DELETE'
  })
}
