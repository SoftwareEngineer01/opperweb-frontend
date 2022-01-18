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
          <form @submit.prevent="actualizarPost">
            <div class="form-row">

              <!-- Categorías -->
              <b-col 
               cols="12" 
               md="12">
                <b-form-group 
                  label="Categoría" 
                  label-for="categoria">
                  <v-select 
                    v-model="postEdit.categoria_id" 
                    label="nombre"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" 
                    :options="categorias"
                    :reduce="categorias => categorias.id" 
                    :clearable="false" 
                    input-id="categoria" 
                  />
                </b-form-group>
              </b-col>


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

              <!-- Contenido -->
              <div class="form-group col-md-12">
                <label for="contenido">Contenido</label>
                <validation-provider
                    #default="{ errors }"
                    name="contenido"
                    rules="required"
                  >
                  <b-form-textarea
                    id="contenido"
                    v-model="postEdit.contenido"
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

import vSelect from 'vue-select'

// Servicios
import * as categoriaServicio from '@/services/categorias'
import * as postServicio from '@/services/post'

export default {

  name: 'AddCategory',

  props: {
    postEdit: {
      type: Object,
      default: () => {},
    },
  },

  components: {
    vSelect,
    ToastificationContent,
  },

  data() {
    return {
      categorias : [],
    }
  },

  created()
  {
    this.obtenerCategorias();
  },

  methods: {

    async obtenerCategorias() {
      try {
        const response = await categoriaServicio.obtenerCategorias()
        this.categorias = response.data.data
      } catch (error) {
        this.showToast('Advertencia!', 'AlertCircleIcon', 'Ocurrió un error al obtener las categorías', 'warning')   
      }
    },

    async actualizarPost() {
      try {
        const response = await postServicio.actualizarPost(this.postEdit)

        if (response.status === 200) {
          this.$emit('reload')
          this.hidePostModal()
          this.showToast('Actualizada', 'CheckIcon', 'Post Actualizado', 'success')
        }
      } catch (error) {         
        this.showToast('Advertencia!', 'AlertCircleIcon', 'Ocurrió un error al actualizar el post', 'warning')         
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
