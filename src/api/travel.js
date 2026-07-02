import request from './request'

export function getTravelLocations() {
  return request('/api/travel/locations')
}

export function addTravelLocation(location) {
  return request('/api/travel/locations', {
    method: 'POST',
    body: JSON.stringify(location)
  })
}

export function updateTravelLocation(id, updates) {
  return request(`/api/travel/locations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  })
}

export function deleteTravelLocation(id) {
  return request(`/api/travel/locations/${id}`, {
    method: 'DELETE'
  })
}
