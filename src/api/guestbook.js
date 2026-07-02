import request from './request'

export function getMessages() {
  return request('/api/guestbook/messages')
}

export function addMessage(message) {
  return request('/api/guestbook/messages', {
    method: 'POST',
    body: JSON.stringify(message)
  })
}

export function deleteMessage(id) {
  return request(`/api/guestbook/messages/${id}`, {
    method: 'DELETE'
  })
}
