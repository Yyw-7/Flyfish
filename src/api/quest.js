import request from './request'

export function getQuests() {
  return request('/api/quests')
}

export function addQuest(quest) {
  return request('/api/quests', {
    method: 'POST',
    body: JSON.stringify(quest)
  })
}

export function updateQuest(id, updates) {
  return request(`/api/quests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  })
}

export function deleteQuest(id) {
  return request(`/api/quests/${id}`, {
    method: 'DELETE'
  })
}
