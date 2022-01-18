<template>
  <!--  eslint-disable -->
  <div>
    <validation-observer 
      ref="posts"
      #default="{invalid}">
      <!-- Modal para Agregar Post -->
      <b-modal
        id="modal-post"
        ref="refPostAdd"
        hide-footer
        title="Agregar Post"
        scrollable
        @hidden="hidePostModal"
      >
        <div class="d-block">
          <form @submit.prevent="addPost">
            <div class="form-row">
            
              <!-- Categorías -->
              <b-form-group
                label="Categorías"
                label-for="categoria"
                class="col-md-12"
              >
                <v-select
                  v-model="post.categoria_id"
                  label="nombre"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="categorias"
                  :reduce="categorias => categorias.id"
                  :clearable="false"
                  input-id="nombre"
                  placeholder="Seleccione la categoría"
                />
              </b-form-group>

              <!-- Título -->
              <b-form-group
                label="Título"
                label-for="titulo"
                class="col-md-12"
              >
                <validation-provider
                    #default="{ errors }"
                    name="titulo"
                    rules="required"
                  >
                  <b-form-input
                    id="titulo"
                    v-model="post.titulo"
                    type="text"
                    class="form-control"
                    placeholder="Título del Post"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- Contenido -->
              <b-form-group
                label="Contenido"
                label-for="contenido"
                class="col-md-12"
              >
                <validation-provider
                    #default="{ errors }"
                    name="contenido"
                    rules="required"
                  >
                  <b-form-textarea
                    id="contenido"
                    v-model="post.contenido"
                    type="text"
                    class="form-control"
                    placeholder="Contenido del Post"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

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

import {
  BSidebar, BForm, BFormGroup, BFormInput, BFormInvalidFeedback, BButton,
} from 'bootstrap-vue'

import vSelect from 'vue-select'

import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

// Servicios
import * as categoriaServicio from '@/services/categorias'

export default {

  name: 'AddCategory',

  components: {
    ToastificationContent,
    BSidebar,
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BButton,
    vSelect,
  },

  data() {
    return {
      categorias : [],
      post: {
        categoria_id: '',
        titulo: '', 
        contenido: '',       
      },
    }
  },

  created() {
    this.obtenerCategorias()
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

    async addPost() {
      // try {
      //   const response = await categoriaServicio.agregarCategoria(this.categoria)

      //   if (response.status === 200) {
      //     this.$emit('reload')
      //     this.hidePostModal()
      //     this.showToast('Agregado', 'CheckIcon', 'Categoría Agregada', 'success')
      //   }
      // } catch (error) {         
      //   this.showToast('Advertencia!', 'AlertCircleIcon', 'Ocurrió un error al agregar la categoría', 'warning')         
      // }
    },

    hidePostModal() {
      this.$refs.posts.reset()
      this.$refs.refPostAdd.hide()
      this.cleanForm()
    },

    cleanForm() {
      // this.categoria = {
      //   nombre: '',
      // }
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
