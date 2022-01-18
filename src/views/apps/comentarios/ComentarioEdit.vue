<template>
  <!--  eslint-disable -->
  <div>
    <validation-observer 
      ref="comentario"
      #default="{invalid}">

      <!-- Modal para Editar Post -->
      <b-modal
        id="editComentarioModal"
        ref="refComentarioEdit"
        hide-footer
        title="Editar Comentario"
        scrollable
        @hidden="hideComentarioModal"
      >
        <div class="d-block">
          <form @submit.prevent="actualizarComentario">
            <div class="form-row">

              <!-- Post -->
              <b-col 
               cols="12" 
               md="12">
                <b-form-group 
                  label="Post" 
                  label-for="post">
                  <v-select 
                    v-model="comentarioEdit.post_id" 
                    label="titulo"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" 
                    :options="posts"
                    :reduce="posts => posts.id" 
                    :clearable="false" 
                    input-id="post" 
                  />
                </b-form-group>
              </b-col>

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
                    v-model="comentarioEdit.contenido"
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
                @click="hideComentarioModal"
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
import * as postServicio from '@/services/post'
import * as comentarioServicio from '@/services/comentarios'

export default {

  name: 'EditComentario',

  props: {
    comentarioEdit: {
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
      posts : [],
    }
  },

  created()
  {
    this.obtenerPosts();
  },

  methods: {

    async obtenerPosts() {
      try {
        const response = await postServicio.obtenerPosts()
        this.posts = response.data.data
      } catch (error) {
        this.showToast('Advertencia!', 'AlertCircleIcon', 'Ocurrió un error al obtener los posts', 'warning')   
      }
    },

    async actualizarComentario() {
      try {
        const response = await comentarioServicio.actualizarComentario(this.comentarioEdit)

        if (response.status === 200) {
          this.$emit('reload')
          this.hideComentarioModal()
          this.showToast('Actualizada', 'CheckIcon', 'Comentario Actualizado', 'success')
        }
      } catch (error) {         
        this.showToast('Advertencia!', 'AlertCircleIcon', 'Ocurrió un error al actualizar el comentario', 'warning')         
      }
    },

    hideComentarioModal() {
      this.$refs.comentario.reset()
      this.$refs.refComentarioEdit.hide()
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
