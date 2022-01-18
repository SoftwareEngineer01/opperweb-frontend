 <!-- eslint-disable -->
<template>
  <b-card title="Agregar Comentarios">

    <div>
      <validation-observer
        ref="form_comentario"
        #default="{invalid}">
        <b-form
          ref="formComentario"
          :style="{height: trHeight}"
          class="repeater-form"
          @submit.prevent="repeateAgain"
        >

          <br><br>

          <!-- Row Loop -->
          <b-row
            v-for="(item, index) in items"
            :id="item.id"
            :key="item.id"
            ref="row"
          >
            
             <!-- Listado de los Post -->
            <b-col md="4">
              <b-form-group
                label="Post"
                label-for="post"
              >
                <v-select
                  v-model="item.post_id"
                  label="titulo"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="posts"
                  :reduce="posts => posts.id"
                  :clearable="false"
                  input-id="titulo"
                  placeholder="Seleccione el post"
                />
              </b-form-group>
            </b-col>

            <!-- Contenido Comentarios -->
            <b-col md="12">
              <b-form-group
                label="Contenido"
                label-for="contenido"
              >
                <validation-provider
                    #default="{ errors }"
                    name="contenido"
                    rules="required"
                  >
                  <b-form-textarea
                    id="contenido"
                    v-model="item.contenido"
                    type="text"
                    class="form-control"
                    placeholder="Contenido del Post"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <!-- Remove Button -->
            <b-col
              lg="2"
              md="3"
              class="mb-50"
            >
              <b-button
                v-ripple.400="'rgba(234, 84, 85, 0.15)'"
                variant="outline-danger"
                class="mt-0 mt-md-2"
                @click="removeItem(index)"
              >
                <feather-icon
                  icon="XIcon"
                  class="mr-25"
                />
                <span>Eliminar</span>
              </b-button>
            </b-col>
            <b-col cols="12">
              <hr>
            </b-col>
          </b-row>

         

          <!-- Boton Agregar Campos -->
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            class="mr-2 my-1"
            variant="secondary"
            @click="repeateAgain"
          >
            <feather-icon
              icon="PlusIcon"
              class="mr-25"
            />
            <span>Agregar Campos</span>
          </b-button>

          <!-- Boton Registrar -->
          <b-button
            class="my-1"
            variant="success"
            :disabled="invalid"
            @click="addComentario"
          >
            <feather-icon
              icon="CheckIcon"
              class="mr-25"
            />
            <span>Registrar Comentarios</span>
          </b-button>

        </b-form>
      </validation-observer>
    </div>
  </b-card>
</template>

<script>

/*eslint-disable */

import {
  BForm, BFormGroup, BFormCheckbox, BFormInput, BRow, BCol, BButton, BCard, BFormTextarea,
} from 'bootstrap-vue'
import { heightTransition } from '@core/mixins/ui/transition'
import Ripple from 'vue-ripple-directive'

// VSelect
import vSelect from 'vue-select'

// Servicios
import * as postServicio from '@/services/post'
import * as comentarioServicio from '@/services/comentarios'

// Notificaciones
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BForm,
    BRow,
    BCol,
    BButton,
    BFormGroup,
    BFormInput,
    BCard,
    BFormTextarea,
    BFormCheckbox,
    vSelect,
  },
  directives: {
    Ripple,
  },
  mixins: [heightTransition],
  data() {
    return {
      posts : [],
      items: [{
        id: 1,
        post_id : null,
        contenido : '',
      }],
      nextComentarioId: 1,
    }
  },

  mounted() {
    this.initTrHeight()
  },

  created() {
    window.addEventListener('resize', this.initTrHeight)
    this.obtenerPost()
  },

  destroyed() {
    window.removeEventListener('resize', this.initTrHeight)
  },

  methods: {

    repeateAgain() {
      this.items.push({
        id: this.nextComentarioId += this.nextComentarioId,
      })

      this.$nextTick(() => {
        this.trAddHeight(this.$refs.row[0].offsetHeight)
      })
    },

    removeItem(index) {
      this.items.splice(index, 1)
      this.trTrimHeight(this.$refs.row[0].offsetHeight)
    },

    initTrHeight() {
      this.trSetHeight(null)
      this.$nextTick(() => {
        this.trSetHeight(this.$refs.form_comentario.scrollHeight)
      })
    },
    
    async obtenerPost() {
      try {
        const response = await postServicio.obtenerPosts()
        this.posts = response.data.data
      } catch (error) {
        this.showToast('Advertencia!', 'AlertCircleIcon', 'Ocurrió un error al obtener los posts', 'warning')   
      }
    },

    async addComentario() {
      try {
        const response = await comentarioServicio.agregarComentario(this.items)
        
        if (response.status === 200) {
          this.clearForm()
          this.showToast('Éxito!', 'CheckCircleIcon', 'Comentarios registrados correctamente', 'success')
          
          setTimeout(() => {
            this.$router.go(-1)
          }, 2000)
        }
      } catch (error) {
        this.showToast('Advertencia!', 'AlertCircleIcon', 'Ocurrió un error al registrar los comentarios', 'warning')
      }
    },

    clearForm() {
      this.$refs.formComentario.reset()
      this.items = [{
        post_id : null,
        contenido : '',
      }]
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

<style lang="scss" scoped>
.repeater-form {
  // overflow: hidden;
  transition: .35s height;
}
</style>
