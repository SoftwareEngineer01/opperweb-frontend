import { http } from './http_service'

export function obtenerPosts() {
  return http().get('/post')
}