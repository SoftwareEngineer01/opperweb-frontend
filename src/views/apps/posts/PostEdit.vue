<template>
  <!--  eslint-disable -->
  <div>
    <validation-observer 
      ref="post"
      #default="{invalid}">

      <!-- Modal para Editar Post -->
      <b-modal
        id="editPostModal"
        ref="refPostEdit"
        hide-footer
        title="Editar Post"
        scrollable
        @hidden="hidePostModal"
      >
        <div class="d-block">
          <form @submit.prevent="updateCategoria">
            <div class="form-row">

              <!-- Título -->
              <div class="form-group col-md-12">
                <label for="titulo">Título</label>
                <validation-provider
                    #default="{ errors }"
                    name="titulo"
                    rules="required"
                  >
                  <b-form-input
                    id="titulo"
                    v-model="postEdit.titulo"
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
                @click="hidePostModal"
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
    postEdit: {
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
        const response = await categoriaServicio.actualizarCategoria(this.postEdit)

        if (response.status === 200) {
          this.$emit('reload')
          this.hidePostModal()
          this.showToast('Actualizada', 'CheckIcon', 'Categoría Actualizada', 'success')
        }
      } catch (error) {         
        this.showToast('Advertencia!', 'AlertCircleIcon', 'Ocurrió un error al actualizar la categoría', 'warning')         
      }
    },

    hidePostModal() {
      this.$refs.post.reset()
      this.$refs.refPostEdit.hide()
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
