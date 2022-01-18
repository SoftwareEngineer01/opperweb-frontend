import { http } from './http_service'

export function obtenerComentarios() {
  return http().get('/comentario')
}

export function agregarComentario(comentario) {
  return http().post('/comentario', comentario)
}

// export function actualizarCategoria(categoria) {
//   return http().put(`/categoria/${categoria.id}`, categoria)
// }

// export function eliminarCategoria(id) {
//   return http().delete(`/categoria/${id}`)
// }