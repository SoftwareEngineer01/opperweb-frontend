import { http } from './http_service'

export function obtenerPosts() {
  return http().get('/post')
}

export function agregarPosts(data) {
  return http().post('/post', data)
}

export function actualizarPost(data) {
    return http().put(`/post/${data.id}`, data)
}

export function eliminarPost(id) {
    return http().delete(`/post/${id}`)
}