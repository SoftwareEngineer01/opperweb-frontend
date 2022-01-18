import { http } from './http_service'

export function obtenerCategorias() {
  return http().get('/categoria')
}

export function agregarCategoria(categoria) {
  return http().post('/categoria', categoria)
}

export function actualizarCategoria(categoria) {
  return http().put(`/categoria/${categoria.id}`, categoria)
}

export function eliminarCategoria(id) {
  return http().delete(`/categoria/${id}`)
}