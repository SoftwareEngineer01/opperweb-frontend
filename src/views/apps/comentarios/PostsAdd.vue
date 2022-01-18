 <!-- eslint-disable -->
<template>
  <b-card title="Agregar Post">

    <div>
      <validation-observer
        ref="form_post"
        #default="{invalid}">
        <b-form
          ref="formPost"
          :style="{height: trHeight}"
          class="repeater-form"
          @submit.prevent="repeateAgain"
        >

          <br><br>

          <b-row ref="row">

            <!-- Categoría -->
            <b-col md="4">
              <b-form-group
                label="Categoría"
                label-for="categoria"
              >
                <v-select
                  v-model="categoria_id"
                  label="nombre"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="categorias"
                  :reduce="categorias => categorias.id"
                  :clearable="false"
                  input-id="nombre"
                  placeholder="Seleccione la categoría"
                />
              </b-form-group>
            </b-col>

            <!-- Título -->
            <b-col md="8">
              <b-form-group
                label="Título"
                label-for="titulo"
              >
                <validation-provider
                    #default="{ errors }"
                    name="titulo"
                    rules="required"
                  >
                  <b-form-input
                    id="titulo"
                    v-model="titulo"
                    type="text"
                    class="form-control"
                    placeholder="Título del Post"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <!-- Contenido -->
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
                    v-model="contenido"
                    type="text"
                    class="form-control"
                    placeholder="Contenido del Post"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            
          </b-row>

          <!-- Row Loop -->
          <b-row
            v-for="(item, index) in items"
            :id="item.id"
            :key="item.id"
            ref="row"
          >

            <h2>Comentarios del Post</h2>

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
                    v-model="contenido"
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
            @click="addPurchase"
          >
            <feather-icon
              icon="CheckIcon"
              class="mr-25"
            />
            <span>Registrar Compra</span>
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
import * as categoriaServicio from '@/services/categorias'
// import * as inventoryService from '@/services/store/store'
// import * as userCostCenterService from '@/services/user'
// import * as purchase from '@/services/purchases/purchases'

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
      purchaseType: true,
      text : "Inventario",
      validationErrors: "",
      categorias : [],
      data :  [],
      categoria_id : "",
      titulo : "",
      contenido : "",
      validationErrors: '', 
      maintenance_id : "",   
      items: [{
        id: 1,
        cost_centers_id : null,
        store_inventories_id : null,
        quantity_requested : 0,
        article_reference : '',
      }],
      nextInventoryEntryId: 1,
    }
  },

  mounted() {
    this.initTrHeight()
  },

  created() {
    window.addEventListener('resize', this.initTrHeight)
    this.obtenerCategorias()
  },

  destroyed() {
    window.removeEventListener('resize', this.initTrHeight)
  },

  methods: {

    repeateAgain() {
      this.items.push({
        id: this.nextInventoryEntryId += this.nextInventoryEntryId,
        store_inventories_id : 1,
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
        this.trSetHeight(this.$refs.form_post.scrollHeight)
      })
    },

    togglePurchaseType() {
      this.text = this.purchaseType ? 'Directo' : 'Inventario'
      this.text2 = this.purchaseType ? 'Inventario' : 'Directo'
      this.purchaseType = !this.purchaseType
      this.clearForm()
    },

    async obtenerCategorias() {
      try {
        const response = await categoriaServicio.obtenerCategorias()
        this.categorias = response.data.data
      } catch (error) {
        this.showToast('Advertencia!', 'AlertCircleIcon', 'Ocurrió un error al obtener las categorías', 'warning')   
      }
    },

    // async addPurchase() {
    //   try {

    //     this.items.forEach(item => {
    //       if(item.store_inventories_id == null) {
    //         item.store_inventories_id = 1
    //       }else {
    //         item.store_inventories_id = item.store_inventories_id
    //       }
    //       return item
    //     })


    //     this.data.push({
    //       purchase_type_id: this.purchaseType ? 1 : 2,
    //       origin_purchase_id : this.maintenance_id === '' ? 1 : 2,
    //       maintenance_id : this.maintenance_id === '' ? 'N.A': this.maintenance_id,
    //       priority_id : this.maintenance_id === '' ? 3 : 1,
    //       status_id : 1,
    //       description: this.description,
    //       purchase_details: this.items
    //     })

    //     //Valida si el formulario es correcto
    //     const isValid = await this.$refs.form_post.validate();
    //     if(!isValid) {
    //       this.showToast('Alerta', 'AlertTriangleIcon', 'Validar el formulario', 'warning')
    //     }else {

    //       const response = await purchase.addPurchase(this.data)

    //       if(response.status === 200) {
    //         this.clearForm()
    //         this.showToast('Agregado', 'CheckIcon', 'Se registra la compra correctamente', 'success')
    //       }
    //     }
    //   } catch (error) {
    //       if (error.response.status === 422){
    //         this.validationErrors = error.response.data.errors;
    //       }
    //   }
    // },

    // async getInventoryCodes(){
    //   try {
    //     const response = await inventoryService.getInventoryCodes()

    //     if(response.status === 200) {
    //       this.inventoryCodes = response.data.data
    //     }
    //   } catch (error) {
    //     if (error.response.status === 422){
    //       const errorInfo = error.response.data.errors;
    //       this.showToast('Advertencia!', 'AlertCircleIcon', errorInfo, 'warning')
    //     }
    //   }
    // },

    // async getUserCostCenters(){
    //   try {
    //     const user = localStorage.getItem('userData')
    //     const userJson = JSON.parse(user)
    //     const user_id = userJson.id

    //     const response = await userCostCenterService.getUserCostCenters(user_id)

    //     if(response.status === 200) {
    //       this.userCostCenters = response.data.data
    //     }
    //   } catch (error) {
    //     if (error.response.status === 422){
    //       const errorInfo = error.response.data.errors;
    //       this.showToast('Advertencia!', 'AlertCircleIcon', errorInfo, 'warning')
    //     }
    //   }
    // },

    // clearForm() {
    //   this.$refs.formPost.reset()
    //   this.validationErrors = ''
    //   this.data = []
    //   this.items = [{
    //     cost_centers_id : null,
    //     store_inventories_id : null,
    //     quantity_requested : 0,
    //     article_reference : '',
    //   }]
    // },

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
