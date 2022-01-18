import { http } from './http_service'

export function obtenerComentarios() {
  return http().get('/comentario')
}

export function agregarComentario(comentario) {
  return http().post('/comentario', comentario)
}

export function actualizarComentario(comentario) {
  return http().put(`/comentario/${comentario.id}`, comentario)
}

export function eliminarComentario(id) {
  return http().delete(`/comentario/${id}`)
}