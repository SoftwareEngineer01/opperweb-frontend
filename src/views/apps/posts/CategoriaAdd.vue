<template>
  <!--  eslint-disable -->
  <div>
    <validation-observer 
      ref="categorias"
      #default="{invalid}">
      <!-- Modal para Agregar Categorías -->
      <b-modal
        id="modal-1"
        ref="refCategoriaAdd"
        hide-footer
        title="Agregar Categoría"
        scrollable
        @hidden="hideCategoryModal"
      >
        <div class="d-block">
          <form @submit.prevent="addCategoria">
            <div class="form-row">

              <!-- Nombre -->
              <div class="form-group col-md-12">
                <label for="nombre">Nombre</label>
                <validation-provider
                    #default="{ errors }"
                    name="nombre"
                    rules="required"
                  >
                  <b-form-input
                    id="nombre"
                    v-model="categoria.nombre"
                    type="text"
                    class="form-control"
                    placeholder="Nombre de la categoría"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </div>

            </div>

            <hr>

            <div class="text-right">
              <button
                type="button"
                class="btn btn-danger btn-sm mx-1"
                @click="hideCategoryModal"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="btn btn-primary btn-sm"
                :disabled="invalid"
              >
                <span class="fa fa-check" /> Guardar
              </button>
            </div>
          </form>
        </div>
      </b-modal>
    </validation-observer>
  </div>
</template>

<script>

/* eslint-disable */

import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

// Servicios
import * as categoriaServicio from '@/services/categorias'

export default {

  name: 'AddCategory',

  components: {
    ToastificationContent,
  },

  data() {
    return {
      categoria : { nombre: '' },
    }
  },

  methods: {

    async addCategoria() {
      try {
        const response = await categoriaServicio.agregarCategoria(this.categoria)

        if (response.status === 200) {
          this.$emit('reload')
          this.hideCategoryModal()
          this.showToast('Agregado', 'CheckIcon', 'Categoría Agregada', 'success')
        }
      } catch (error) {         
        this.showToast('Advertencia!', 'AlertCircleIcon', 'Ocurrió un error al agregar la categoría', 'warning')         
      }
    },

    hideCategoryModal() {
      this.$refs.categorias.reset()
      this.$refs.refCategoriaAdd.hide()
      this.cleanForm()
    },

    cleanForm() {
      this.categoria = {
        nombre: '',
      }
    },

    showToast(title, icon, text, variant) {
      this.$toast({
        component: ToastificationContent,
        props: {
          title,
          icon,
          text,
          variant,
        },
      })
    },

  },
}

</script>

<style>

</style>
