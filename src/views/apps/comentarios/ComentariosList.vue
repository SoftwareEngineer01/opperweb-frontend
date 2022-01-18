<template>

  <div>

    <!-- Table Container Card -->
    <b-card
      no-body
      class="mb-0"
    >

      <div class="m-2">

        <!-- Table Top -->
        <b-row>

          <!-- Per Page -->
          <b-col
            cols="12"
            md="6"
            class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
          >
            <label>Ver</label>
            <v-select
              v-model="perPage"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="perPageOptions"
              :clearable="false"
              class="per-page-selector d-inline-block mx-50"
            />
            <label>Entradas</label>
          </b-col>

          <!-- Search -->
          <b-col
            cols="12"
            md="6"
          >
            <div class="d-flex align-items-center justify-content-end">
              <b-form-input
                v-model="filter"
                class="d-inline-block mr-1"
                placeholder="Buscar..."
              />
              <b-button
                variant="primary"
                @click="addComentario"             
              >
                <span class="text-nowrap">Agregar</span>
              </b-button>
            </div>
          </b-col>
        </b-row>

      </div>

      <b-table
        ref="refPostListTable"
        class="position-relative animated fadeIn"
        :items="items"
        :fields="columns"
        responsive
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        :empty-text="empty"
        :sort-desc.sync="isSortDirDesc"
        :filter="filter"
        :empty-filtered-text="empty"
        :current-page="currentPage"
        :per-page="perPage"
      >

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <b-dropdown
            variant="link"
            no-caret
            :right="$store.state.appConfig.isRTL"
          >

            <template #button-content>
              <feather-icon
                icon="MoreVerticalIcon"
                size="16"
                class="align-middle text-body"
              />
            </template>
            <!-- eslint-disable-next-line -->

            <!-- Editar Comentario -->
            <b-dropdown-item 
              v-b-modal.editComentarioModal
              @click="editComentario(data.item)"
            >
              <feather-icon icon="EditIcon" />
              <span class="align-middle ml-50">Editar</span>
            </b-dropdown-item>

            <!-- Eliminar Comentario -->
            <b-dropdown-item               
              @click="eliminarComentario(data.item.id)"
            >
              <feather-icon icon="Trash2Icon" />
              <span class="align-middle ml-50">Eliminar</span>
            </b-dropdown-item>

          </b-dropdown>
        </template>

      </b-table>
      <div class="mx-2 mb-2">
        <b-row>

          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-start"
          >
            <span class="text-muted">Mostrando {{ dataMeta.from }} de {{ dataMeta.to }} de {{ dataMeta.of }} entradas</span>
          </b-col>
          <!-- Pagination -->
          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-end"
          >

            <b-pagination
              v-model="currentPage"
              :total-rows="rows"
              :per-page="perPage"
              first-number
              last-number
              class="mb-0 mt-1 mt-sm-0"
              prev-class="prev-item"
              next-class="next-item"
            >
              <template #prev-text>
                <feather-icon
                  icon="ChevronLeftIcon"
                  size="18"
                />
              </template>
              <template #next-text>
                <feather-icon
                  icon="ChevronRightIcon"
                  size="18"
                />
              </template>
            </b-pagination>

          </b-col>

        </b-row>
      </div>

    </b-card>

    <!-- Modal para editar comentario -->
    <ComentarioEdit
      ref="refComentarioEdit"      
      :comentarioEdit="this.comentario"
       @reload="obtenerComentarios"
    />


  </div>
</template>

<script>

/*eslint-disable*/

// Bootstrap
import {
  BCard, BRow, BCol, BFormInput, BButton, BTable, BMedia, BAvatar, BLink,
  BBadge, BDropdown, BDropdownItem, BPagination, BModal, VBModal, BAlert,
} from 'bootstrap-vue'

// vSelect
import vSelect from 'vue-select'

// Notificaciones
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

// Moment - Fechas
import moment from 'moment'
import 'moment/locale/es'

// Servicios
import * as comentarioServicio from '@/services/comentarios'

// Componentes
import ComentarioEdit from '@/views/apps/comentarios/ComentarioEdit.vue'

export default {
  components: {
    ToastificationContent,
    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    vSelect,
    ComentarioEdit,
    BButton,
    BModal,
    BAlert,
  },
  directives: {
    'b-modal': VBModal,
  },
  data() {
    return {
      items: [],
      comentario: {},
      empty: 'No hay datos para mostrar',
      columns: [
        { key: 'id', label: 'Código', sortable: true },
        { key: 'post_id', label: 'Post Id', sortable: true },
        { key: 'contenido', label: 'Contenido', sortable: true },
        { key: 'created_at', label: 'Fecha', sortable: true, formatter: (value) => moment(value).format('LLL') },
        { key: 'actions', label: 'Opciones', sortable: true },
      ],
      perPage: 10,
      sortBy: 'id',
      isSortDirDesc: true,
      perPageOptions: [5, 10, 25, 50],
      currentPage: 1,
      filter: '',
    }
  },

  computed: {
    rows() {
      return this.items.length
    },
    dataMeta() {
      return {
        from: (this.currentPage - 1) * this.perPage + 1,
        to: this.currentPage * this.perPage > this.rows ? this.rows : this.currentPage * this.perPage,
        of: this.rows,
      }
    },
  },

  watch: {
    currentPage: { handler: 'obtenerComentarios', deep: true },
  },


  created() {
    this.obtenerComentarios()
  },

  methods: {

    addComentario() {
      this.$router.push({ name: 'comentarios-add' })
    },

    async obtenerComentarios() {
      try {
        const response = await comentarioServicio.obtenerComentarios()
        if (response.status === 200) {
          this.items = response.data.data
        }
      } catch (error) {
        this.showToast('Warning', 'AlertCircleIcon', 'No se pudieron obtener los datos', 'warning')
      }
    },

    editComentario(item) {
      this.comentario = item
    },

    async eliminarComentario(id) {
      try {

        const modal = await this.$bvModal.msgBoxConfirm('¿Está seguro de eliminar el registro?', {
          okTitle: 'Si',
          okVariant: 'danger',
          cancelTitle: 'No',
          cancelVariant: 'primary',
        })

        if (modal) {
          const response = await comentarioServicio.eliminarComentario(id)
          
          if (response.status === 200) {
            this.showToast('Success', 'CheckCircleIcon', 'Registro eliminado correctamente', 'success')
            this.obtenerComentarios()
          }          
        }

      } catch (error) {
        this.showToast('Warning', 'AlertCircleIcon', 'El comentario no se pudo eliminar', 'warning')
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

<style lang="scss" scoped>
  .per-page-selector {
    width: 90px;
  }
  @import '@core/scss/vue/libs/vue-select.scss';
</style>
