import { http } from './http_service'

export function obtenerPosts() {
  return http().get('/post')
}

export function agregarPosts(data) {
  return http().post('/post', data)
}