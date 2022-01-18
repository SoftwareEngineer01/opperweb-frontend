import { http } from './http_service'

export function obtenerCategorias() {
  return http().get('/categoria')
}

export function agregarCategoria(categoria) {
  return http().post('/categoria', categoria)
}