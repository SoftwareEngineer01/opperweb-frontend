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
                v-b-modal.modal-post
                variant="primary"             
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

       <!-- Column: Comentarios -->
        <template #cell(comentarios)="data">          
              <small v-if="data.item.comentarios.length < 1">No tiene Comentarios</small>
              <div v-for="comentario in data.item.comentarios" :key="comentario.id">
                  <b>{{ comentario.id }}</b> - <small>{{ comentario.contenido }}</small>
              </div>
        </template>  

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

            <!-- Editar Post -->
            <b-dropdown-item 
              v-b-modal.editCategoryModal
              @click="editCategory(data.item)"
            >
              <feather-icon icon="EditIcon" />
              <span class="align-middle ml-50">Editar</span>
            </b-dropdown-item>

            <!-- Eliminar Post -->
            <b-dropdown-item               
              @click="eliminarCategoria(data.item.id)"
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

    <!-- Modal para agregar post -->
    <PostAdd
      ref="refPostAdd"
      @reload="obtenerPosts"
    />

    <!-- Modal para editar categoría -->
    <!-- <CategoriaEdit
      ref="refCategoriaEdit"      
      :categoriaEdit="this.categoria"
       @reload="obtenerCategorias"
    /> -->


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
import * as servicioPost from '@/services/post'

// Componentes
import PostAdd from '@/views/apps/posts/PostAdd.vue'
// import CategoriaEdit from '@/views/apps/categorias/CategoriaEdit.vue'

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
    PostAdd,
    // CategoriaEdit,
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
      categoria: {},
      empty: 'No hay datos para mostrar',
      columns: [
        { key: 'id', label: 'Código', sortable: true },
        { key: 'categoria', label: 'Categoría', sortable: true },
        { key: 'titulo', label: 'Título', sortable: true },
        { key: 'contenido', label: 'Contenido', sortable: true },
        { key: 'comentarios', label: 'Comentarios', sortable: true },
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
    currentPage: { handler: 'obtenerPosts', deep: true },
  },


  created() {
    this.obtenerPosts()
  },

  methods: {

    async obtenerPosts() {
      try {
        const response = await servicioPost.obtenerPosts()
        if (response.status === 200) {
          this.items = response.data.data
        }
      } catch (error) {
        this.showToast('Warning', 'AlertCircleIcon', 'No se pudieron obtener los datos', 'warning')
      }
    },

    editCategory(item) {
      this.categoria = item
    },

    async eliminarCategoria(id) {
      try {

        const modal = await this.$bvModal.msgBoxConfirm('¿Está seguro de eliminar el registro?', {
          okTitle: 'Si',
          okVariant: 'danger',
          cancelTitle: 'No',
          cancelVariant: 'primary',
        })

        if (modal) {
          const response = await servicioCategoria.eliminarCategoria(id)
          
          if (response.status === 200) {
            this.showToast('Success', 'CheckCircleIcon', 'Registro eliminado correctamente', 'success')
            this.obtenerCategorias()
          }          
        }

      } catch (error) {
        this.showToast('Warning', 'AlertCircleIcon', 'La categoría no se pudo eliminar', 'warning')
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
