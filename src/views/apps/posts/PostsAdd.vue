 <!-- eslint-disable -->
<template>
  <b-card title="Agregar Compra">
    <!-- Componente para mostrar errores -->
    <ErrorValidation :errors="validationErrors" v-if="validationErrors"></ErrorValidation>
    <div>
      <validation-observer
        ref="form_purchases"
        #default="{invalid}">
        <b-form
          ref="formPurchases"
          :style="{height: trHeight}"
          class="repeater-form"
          @submit.prevent="repeateAgain"
        >

        <h4>Realizarás una compra por {{text}}</h4>
        <h5>Si deseas cambiar el tipo de compra pulsa en el siguiente boton</h5>

        <b-button
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          class="mt-1"
          variant="outline-primary"
          @click="togglePurchaseType"
        >
          Cambiar a {{ text2 }}
        </b-button>



          <br><br>

          <!-- Row Loop -->
          <b-row
            v-for="(item, index) in items"
            :id="item.id"
            :key="item.id"
            ref="row"
          >

            <!-- Code -->
            <b-col md="4" v-if="purchaseType">
              <validation-provider
                #default="{ errors }"
                name="Código del Inventario"
                rules="required">
                <b-form-group
                  label="Buscar por Código y Referencia del Inventario"
                  label-for="inventoryCode"
                  :state="errors.length > 0 ? false:null">
                  <v-select v-model="item.store_inventories_id" label="codeRef"
                      :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" :options="inventoryCodes"
                      :reduce="inventoryCodes => inventoryCodes.id" :clearable="true"
                      input-id="inventoryCode" placeholder="Seleccione el código" />
                  <b-form-invalid-feedback :state="errors.length > 0 ? false:null">
                      {{ errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
            </b-col>

            <!-- Referencia -->
            <div v-else>
              <b-col md="12">
                <b-form-group
                  label="Referencia"
                  label-for="reference"
                >
                  <b-form-input
                    id="reference"
                    placeholder="Referencia del artículo"
                    v-model="item.article_reference"
                  />
                </b-form-group>
              </b-col>
            </div>

            <!-- Quantity -->
            <b-col md="2">
              <b-form-group
                label="Cantidad"
                label-for="quantity"
                >
               <validation-provider
                  #default="{ errors }"
                  name="cantidad"
                  rules="required|numeric"
                  >
                  <b-form-input
                    id="quantity"
                    type="number"
                    v-model="item.quantity_requested"
                    :state="errors.length > 0 ? false:null"
                  />
                 <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <!-- Centros de costo del usuario -->
            <b-col md="3">
              <validation-provider
                #default="{ errors }"
                name="Centros de Costo"
                rules="required">
                <b-form-group
                  label="¿Qué uso le dará?"
                  label-for="userCostCenter"
                  :state="errors.length > 0 ? false:null">
                  <v-select v-model="item.cost_centers_id" label="description"
                      :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" :options="userCostCenters"
                      :reduce="userCostCenters => userCostCenters.id" :clearable="true"
                      input-id="userCostCenter" placeholder="Seleccione" />
                  <b-form-invalid-feedback :state="errors.length > 0 ? false:null">
                      {{ errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
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

          <!-- Descripción de la compra -->
          <div>
            <label for="textarea-default">Descripción de la compra</label>
            <validation-provider
                  #default="{ errors }"
                  name="descripcion"
                  rules="required"
                  >
                  <b-form-textarea
                    id="textarea-default"
                    placeholder="Escriba la descripción de la compra"
                    rows="3"
                    v-model="description"
                    :state="errors.length > 0 ? false:null"
                  />
                 <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </div>

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
import * as inventoryService from '@/services/store/store'
import * as userCostCenterService from '@/services/user'
import * as purchase from '@/services/purchases/purchases'

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
      text2 : "Directo",
      validationErrors: "",
      inventoryCodes : [],
      userCostCenters : [],
      data :  [],
      description : "",
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
    this.getInventoryCodes()
    this.getUserCostCenters()
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
        this.trSetHeight(this.$refs.form_purchases.scrollHeight)
      })
    },

    togglePurchaseType() {
      this.text = this.purchaseType ? 'Directo' : 'Inventario'
      this.text2 = this.purchaseType ? 'Inventario' : 'Directo'
      this.purchaseType = !this.purchaseType
      this.clearForm()
    },

    async addPurchase() {
      try {

        this.items.forEach(item => {
          if(item.store_inventories_id == null) {
            item.store_inventories_id = 1
          }else {
            item.store_inventories_id = item.store_inventories_id
          }
          return item
        })


        this.data.push({
          purchase_type_id: this.purchaseType ? 1 : 2,
          origin_purchase_id : this.maintenance_id === '' ? 1 : 2,
          maintenance_id : this.maintenance_id === '' ? 'N.A': this.maintenance_id,
          priority_id : this.maintenance_id === '' ? 3 : 1,
          status_id : 1,
          description: this.description,
          purchase_details: this.items
        })

        //Valida si el formulario es correcto
        const isValid = await this.$refs.form_purchases.validate();
        if(!isValid) {
          this.showToast('Alerta', 'AlertTriangleIcon', 'Validar el formulario', 'warning')
        }else {

          const response = await purchase.addPurchase(this.data)

          if(response.status === 200) {
            this.clearForm()
            this.showToast('Agregado', 'CheckIcon', 'Se registra la compra correctamente', 'success')
          }
        }
      } catch (error) {
          if (error.response.status === 422){
            this.validationErrors = error.response.data.errors;
          }
      }
    },

    async getInventoryCodes(){
      try {
        const response = await inventoryService.getInventoryCodes()

        if(response.status === 200) {
          this.inventoryCodes = response.data.data
        }
      } catch (error) {
        if (error.response.status === 422){
          const errorInfo = error.response.data.errors;
          this.showToast('Advertencia!', 'AlertCircleIcon', errorInfo, 'warning')
        }
      }
    },

    async getUserCostCenters(){
      try {
        const user = localStorage.getItem('userData')
        const userJson = JSON.parse(user)
        const user_id = userJson.id

        const response = await userCostCenterService.getUserCostCenters(user_id)

        if(response.status === 200) {
          this.userCostCenters = response.data.data
        }
      } catch (error) {
        if (error.response.status === 422){
          const errorInfo = error.response.data.errors;
          this.showToast('Advertencia!', 'AlertCircleIcon', errorInfo, 'warning')
        }
      }
    },

    clearForm() {
      this.$refs.formPurchases.reset()
      this.validationErrors = ''
      this.data = []
      this.items = [{
        cost_centers_id : null,
        store_inventories_id : null,
        quantity_requested : 0,
        article_reference : '',
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
