<template>
  <v-container class="pa-6 daftar-diskon-page" fluid>
    <v-row align="center" justify="space-between" class="mb-4">
      <v-col cols="12" md="6">
        <h1 class="text-h5 font-weight-bold mb-1">Daftar Diskon</h1>
        <div class="text-caption text-grey-darken-1 mb-4">
          Total jumlah diskon: {{ discounts.length }}
        </div>

        <v-row class="align-center" no-gutters>
          <v-col cols="12" md="6" class="pr-md-4 mb-3 mb-md-0">
            <v-text-field
              v-model="search"
              placeholder="Cari diskon"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-magnify"
              hide-details
              class="daftar-diskon-search"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-menu :close-on-content-click="false" location="bottom start">
              <template #activator="{ props }">
                <v-btn
                  color="black"
                  v-bind="props"
                  variant="outlined"
                  prepend-icon="mdi-store"
                  append-icon="mdi-chevron-down"
                  class="text-none px-4 daftar-diskon-store-btn"
                  rounded="lg"
                >
                  Kopi Anak Bangsa
                </v-btn>
              </template>
              <v-card min-width="380" class="pa-4 rounded-xl">
                <div class="text-subtitle-2 mb-2">API URL crudcrud.com</div>
                <v-text-field
                  v-model="apiUrl"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="mb-4"
                ></v-text-field>
                <v-btn
                  color="#4CAF50"
                  block
                  class="text-white rounded-pill"
                  @click="terapkanApiUrl"
                >
                  Terapkan
                </v-btn>
              </v-card>
            </v-menu>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="auto" class="text-right">
        <!-- Jika belum ada yang dicentang: tombol tambah data -->
        <v-btn
          v-if="!anySelected"
          color="#4CAF50"
          prepend-icon="mdi-plus"
          rounded="pill"
          size="large"
          class="text-none text-white px-8"
          @click="dialogTambah = true"
        >
          Tambah diskon
        </v-btn>

        <!-- Jika ada item yang dicentang: tombol batalkan & hapus -->
        <div v-else class="header-bulk-actions">
          <v-btn
            variant="outlined"
            color="#f97373"
            rounded="pill"
            class="text-none header-batal-btn"
            @click="batalkanSeleksi"
          >
            Batalkan
          </v-btn>
          <v-btn
            color="#f97373"
            rounded="pill"
            class="text-none text-white header-hapus-btn"
            @click="bukaDialogHapus"
          >
            Hapus
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Empty state card -->
    <v-card
      v-if="discounts.length === 0 && !loading"
      variant="outlined"
      class="daftar-diskon-empty-card d-flex align-center justify-center"
    >
      <div class="text-center">
        <div class="daftar-diskon-illustration mb-6 d-inline-flex align-center justify-center">
         <v-img
            src="src/assets/no-discount.png"
            alt="tidak ada diskon"
            width="120"
            height="80"
          ></v-img>
        </div>
        <div class="text-h6 font-weight-bold mb-2">Belum Ada Diskon</div>
        <div class="text-body-2 text-grey-darken-1 mb-6">
          Silahkan tambah diskon untuk menarik pelanggan dan meningkatkan penjualan.
        </div>
        <v-btn
          color="#4CAF50"
          prepend-icon="mdi-plus"
          rounded="pill"
          size="large"
          class="text-none text-white px-8"
          @click="dialogTambah = true"
        >
          Tambah diskon
        </v-btn>
      </div>
    </v-card>

    <!-- Table list ketika sudah ada data -->
    <v-card
      v-else
      variant="outlined"
      class="rounded-xl border-thin overflow-hidden bg-white mt-6"
    >
      <v-table>
        <thead>
          <tr class="bg-grey-lighten-4">
            <th style="width: 60px">
              <v-checkbox
                :model-value="allSelected"
                @update:model-value="toggleSelectAll"
                hide-details
                density="compact"
              ></v-checkbox>
            </th>
            <th class="text-left font-weight-bold">Nama Diskon</th>
            <th class="text-left font-weight-bold">Nilai Diskon</th>
            <th style="width: 60px"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredDiscounts" :key="item._id">
            <td>
              <v-checkbox
                v-model="item.selected"
                hide-details
                density="compact"
              ></v-checkbox>
            </td>
            <td>
              {{ item.name }}
              <v-chip
                v-if="item.isNew"
                size="x-small"
                color="blue-lighten-4"
                class="ml-2 text-blue-darken-3"
                label
              >
                baru
              </v-chip>
            </td>
            <td>{{ formatValue(item) }}</td>
            <td>
              <v-btn
                icon="mdi-pencil-outline"
                variant="text"
                size="small"
                color="grey-darken-1"
                @click="editItem(item)"
              ></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <div class="mt-10 text-center text-caption text-grey">
      © 2024 PT Nusantara Berkah Digital
    </div>

    <v-dialog v-model="dialogTambah" max-width="500" persistent>
      <v-card class="pa-4 rounded-xl">
        <v-card-title class="d-flex justify-space-between align-center px-2">
          <span class="text-h6 font-weight-bold">
            {{ isEditing ? 'Ubah Diskon' : 'Tambah Diskon' }}
          </span>
          <v-btn icon="mdi-close" variant="text" @click="tutupDialog"></v-btn>
        </v-card-title>

        <v-form
          ref="formRef"
          v-model="isFormValid"
          @submit.prevent="simpanDiskon"
        >
          <div class="text-subtitle-2 mb-1">Nama Diskon</div>
          <v-text-field
            v-model="newDiscount.name"
            placeholder="Misal: Diskon opening"
            variant="outlined"
            :rules="[rules.required, rules.unique]"
            class="mb-2"
          ></v-text-field>

          <div class="text-subtitle-2 mb-1">Diskon</div>
          <v-row no-gutters>
            <v-col cols="8">
              <v-text-field
                v-model.number="newDiscount.value"
                variant="outlined"
                type="number"
                :rules="[rules.required]"
                :prefix="newDiscount.type === 'rp' ? 'Rp' : ''"
                :suffix="newDiscount.type === 'percent' ? '%' : ''"
              ></v-text-field>
            </v-col>
            <v-col cols="4" class="pl-2">
              <v-btn-toggle v-model="newDiscount.type" mandatory color="success" variant="outlined" class="rounded-lg w-100">
                <v-btn value="percent" class="flex-grow-1">%</v-btn>
                <v-btn value="rp" class="flex-grow-1">Rp</v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>

          <v-btn
            type="submit"
            color="#4CAF50"
            block
            rounded="pill"
            size="large"
            class="mt-6 text-white"
            :loading="loading"
            :disabled="loading"
          >
            Simpan
          </v-btn>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Dialog konfirmasi hapus -->
    <v-dialog v-model="dialogHapus" max-width="480">
      <v-card class="pa-6 rounded-xl hapus-dialog-card">
        <h2 class="hapus-title mb-3">Hapus Diskon</h2>
        <p class="hapus-text mb-2">
          Apakah Anda yakin ingin menghapus diskon yang dipilih?
        </p>
        <ul class="hapus-list mb-6">
          <li>Diskon yang dihapus tidak bisa dikembalikan lagi.</li>
        </ul>

        <div class="hapus-actions">
          <v-btn
            variant="outlined"
            color="#f97373"
            rounded="pill"
            class="text-none hapus-btn-batal"
            @click="batalHapus"
            :disabled="loading"
          >
            Batalkan
          </v-btn>
          <v-btn
            color="#f97373"
            rounded="pill"
            class="text-none text-white hapus-btn-ya"
            @click="konfirmasiHapus"
            :loading="loading"
          >
            Hapus
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar"
      color="teal-darken-3"
      rounded="pill"
      location="top"
    >
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const DEFAULT_API_URL = 'https://crudcrud.com/api/1f45b619db6b405fb1e2d23ed65d56a9/diskon'
const apiUrl = ref(
  typeof window !== 'undefined'
    ? window.localStorage.getItem('diskon_api_url') || DEFAULT_API_URL
    : DEFAULT_API_URL,
)
const discounts = ref([])
const loading = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const search = ref('')
const dialogTambah = ref(false)
const dialogHapus = ref(false)
const formRef = ref(null)
const isFormValid = ref(false)

const newDiscount = ref({ name: '', value: 0, type: 'percent', isNew: true })
const editingItem = ref(null)
const isEditing = computed(() => !!editingItem.value)

const rules = {
  required: (v) => !!v || 'Tidak boleh kosong.',
  unique: (v) =>
    !discounts.value.some(d => {
      if (editingItem.value && d._id === editingItem.value._id) return false
      return d.name.toLowerCase() === v.toLowerCase()
    }) || 'Nama sudah digunakan.',
}

const showApiLimitError = () => {
  showSnackbar(
    'Endpoint default crudcrud sudah melewati batas 100 request. Silakan isi API URL crudcrud.com milik Anda sendiri lalu klik Terapkan.',
  )
}

const fetchDiscounts = async () => {
  loading.value = true
  try {
    const response = await axios.get(apiUrl.value)
    discounts.value = response.data.map(d => ({ ...d, selected: false }))
  } catch (e) {
    if (
      e.response &&
      typeof e.response.data === 'string' &&
      e.response.data.includes('Endpoint has exceeded allowed number of requests')
    ) {
      showApiLimitError()
    } else {
      showSnackbar('Gagal memuat data')
    }
  } finally {
    loading.value = false
  }
}

const terapkanApiUrl = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('diskon_api_url', apiUrl.value)
  }
  fetchDiscounts()
}

const simpanDiskon = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    if (editingItem.value) {
      await axios.put(
        `${apiUrl.value}/${editingItem.value._id}`,
        { ...newDiscount.value },
      )
      showSnackbar(`${newDiscount.value.name} berhasil diubah.`)
    } else {
      await axios.post(apiUrl.value, { ...newDiscount.value })
      showSnackbar(`${newDiscount.value.name} berhasil ditambahkan.`)
    }
    await fetchDiscounts()
    tutupDialog()
  } catch (e) {
    if (
      e.response &&
      typeof e.response.data === 'string' &&
      e.response.data.includes('Endpoint has exceeded allowed number of requests')
    ) {
      showApiLimitError()
    } else {
      showSnackbar('Gagal menyimpan')
    }
  } finally {
    loading.value = false
  }
}

const tutupDialog = () => {
  dialogTambah.value = false
  newDiscount.value = { name: '', value: 0, type: 'percent', isNew: true }
  // reset status form
  formRef.value?.resetValidation()
  editingItem.value = null
}

const formatValue = (item) => {
  return item.type === 'rp'
    ? `Rp ${Number(item.value).toLocaleString('id-ID')}`
    : `${item.value}%`
}

const showSnackbar = (text) => {
  snackbarText.value = text
  snackbar.value = true
}

const selectedItems = computed(() =>
  discounts.value.filter(d => d.selected),
)

const allSelected = computed(() =>
  discounts.value.length > 0 &&
  discounts.value.every(d => d.selected),
)

const anySelected = computed(() => selectedItems.value.length > 0)

const toggleSelectAll = (value) => {
  discounts.value.forEach(d => {
    d.selected = value
  })
}

const batalkanSeleksi = () => {
  discounts.value.forEach(d => {
    d.selected = false
  })
}

const bukaDialogHapus = () => {
  if (!anySelected.value) {
    showSnackbar('Pilih minimal satu diskon yang ingin dihapus.')
    return
  }
  dialogHapus.value = true
}

const konfirmasiHapus = async () => {
  const items = selectedItems.value
  if (!items.length) return

  loading.value = true
  try {
    await Promise.all(
      items.map(item => axios.delete(`${apiUrl.value}/${item._id}`)),
    )
    showSnackbar(`${items.length} diskon berhasil dihapus.`)
    await fetchDiscounts()
    dialogHapus.value = false
  } catch (e) {
    if (
      e.response &&
      typeof e.response.data === 'string' &&
      e.response.data.includes('Endpoint has exceeded allowed number of requests')
    ) {
      showApiLimitError()
    } else {
      showSnackbar('Gagal menghapus')
    }
  } finally {
    loading.value = false
  }
}

const filteredDiscounts = computed(() => {
  return discounts.value.filter(d =>
    d.name.toLowerCase().includes(search.value.toLowerCase()),
  )
})

const editItem = (item) => {
  editingItem.value = item
  newDiscount.value = {
    name: item.name,
    value: item.value,
    type: item.type || 'percent',
    isNew: item.isNew ?? false,
  }
  dialogTambah.value = true
}

const goToTambahDiskon = () => {
  router.push({ name: 'TambahDiskon' })
}

onMounted(fetchDiscounts)
</script>

<style scoped>
.daftar-diskon-page {
  max-width: 1200px;
  margin-inline: auto;
}

.daftar-diskon-empty-card {
  margin-top: 16px;
  border-radius: 32px;
  min-height: 420px;
  padding: 40px 24px;
  background-color: #ffffff;
}

.daftar-diskon-illustration {
  width: 220px;
  height: 140px;
  border-radius: 999px;
  background: radial-gradient(circle at top left, #fecaca, #fb7185);
}

.daftar-diskon-store-btn {
  background-color: #ffffff;
}

.daftar-diskon-search :deep(.v-field) {
  border-radius: 999px;
}

.header-bulk-actions {
  display: flex;
  gap: 12px;
}

.header-batal-btn {
  border-color: #f97373 !important;
  color: #f97373 !important;
  background-color: #ffffff !important;
  font-weight: 600;
}

.header-hapus-btn {
  background-color: #f97373 !important;
  font-weight: 600;
}

.hapus-dialog-card {
  border-radius: 24px;
}

.hapus-title {
  font-size: 20px;
  font-weight: 700;
}

.hapus-text {
  font-size: 14px;
  color: #4b5563;
}

.hapus-list {
  margin: 0 0 24px 20px;
  padding: 0;
  font-size: 14px;
  color: #4b5563;
}

.hapus-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.hapus-btn-batal {
  border-color: #f97373 !important;
  color: #f97373 !important;
  background-color: #ffffff !important;
  font-weight: 600;
}

.hapus-btn-ya {
  background-color: #f97373 !important;
  font-weight: 600;
}
</style>