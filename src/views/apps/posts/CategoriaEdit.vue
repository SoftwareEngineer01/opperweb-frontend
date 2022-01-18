<template>
  <!--  eslint-disable -->
  <div>
    <validation-observer 
      ref="categorias"
      #default="{invalid}">
      <!-- Modal para Agregar Categorías -->
      <b-modal
        id="editCategoryModal"
        ref="refCategoriaEdit"
        hide-footer
        title="Editar Categoría"
        scrollable
        @hidden="hideCategoryModal"
      >
        <div class="d-block">
          <form @submit.prevent="updateCategoria">
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
                    v-model="categoriaEdit.nombre"
                    type="text"
                    class="form-control"
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
                <span class="fa fa-check" /> Actualizar
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

  props: {
    categoriaEdit: {
      type: Object,
      default: () => {},
    },
  },

  components: {
    ToastificationContent,
  },

  data() {
    return {}
  },

  methods: {

    async updateCategoria() {
      try {
        const response = await categoriaServicio.actualizarCategoria(this.categoriaEdit)

        if (response.status === 200) {
          this.$emit('reload')
          this.hideCategoryModal()
          this.showToast('Actualizada', 'CheckIcon', 'Categoría Actualizada', 'success')
        }
      } catch (error) {         
        this.showToast('Advertencia!', 'AlertCircleIcon', 'Ocurrió un error al actualizar la categoría', 'warning')         
      }
    },

    hideCategoryModal() {
      this.$refs.categorias.reset()
      this.$refs.refCategoriaEdit.hide()
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
