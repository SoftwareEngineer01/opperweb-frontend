import { http } from './http_service'

export function obtenerCategorias() {
  return http().get('/categoria')
}