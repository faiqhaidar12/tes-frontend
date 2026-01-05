<template>
  <v-container class="py-6 simple-home" max-width="960">
    <!-- Search & Filter -->
    <v-row class="mb-4" align="center" justify="space-between">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          variant="outlined"
          density="comfortable"
          placeholder="Cari promo..."
          prepend-inner-icon="mdi-magnify"
          hide-details
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="selectedCategory"
          :items="categories"
          variant="outlined"
          density="comfortable"
          hide-details
          prepend-inner-icon="mdi-filter-variant"
          placeholder="Kategori"
        />
      </v-col>
    </v-row>

    <!-- List Promo -->
    <v-row dense>
      <v-col
        v-for="promo in filteredPromos"
        :key="promo.id"
        cols="12"
        md="4"
      >
        <v-card rounded="lg" elevation="1">
          <v-img
            :src="promo.image"
            height="140"
            cover
          />
          <v-card-item>
            <v-card-title class="text-subtitle-1 font-weight-medium">
              {{ promo.title }}
            </v-card-title>
            <v-card-subtitle class="text-body-2">
              {{ promo.store }}
            </v-card-subtitle>
          </v-card-item>
          <v-card-text class="pt-0">
            <div class="text-h6 text-black font-weight-bold">
              {{ promo.discount }}
            </div>
            <div class="text-caption text-medium-emphasis">
              Berlaku sampai: {{ promo.validUntil }}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              variant="flat"
              block
              @click="lihatDetail(promo)"
            >
              Lihat Detail
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col
        v-if="filteredPromos.length === 0"
        cols="12"
        class="text-center text-medium-emphasis py-10"
      >
        Tidak ada promo yang cocok.
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'SimpleHome',
  data() {
    return {
      search: '',
      selectedCategory: null,
      categories: ['Semua', 'Makanan', 'Minuman', 'Supermarket', 'Fashion'],
      promos: [
        {
          id: 1,
          title: 'Diskon 50% Makanan',
          store: 'Restaurant A',
          category: 'Makanan',
          discount: '50%',
          validUntil: '31 Jan 2026',
          image: 'https://via.placeholder.com/400x200?text=Promo+1',
        },
        {
          id: 2,
          title: 'Buy 1 Get 1 Minuman',
          store: 'Cafe B',
          category: 'Minuman',
          discount: 'B1G1',
          validUntil: '15 Feb 2026',
          image: 'https://via.placeholder.com/400x200?text=Promo+2',
        },
        // ...tambahkan promo lain di sini...
      ],
    };
  },
  computed: {
    filteredPromos() {
      const text = this.search.toLowerCase();
      const cat =
        !this.selectedCategory || this.selectedCategory === 'Semua'
          ? null
          : this.selectedCategory;

      return this.promos.filter((p) => {
        const matchText =
          p.title.toLowerCase().includes(text) ||
          p.store.toLowerCase().includes(text);
        const matchCat = !cat || p.category === cat;
        return matchText && matchCat;
      });
    },
  },
  methods: {
    lihatDetail(promo) {
      // Ganti dengan navigasi ke halaman detail jika sudah ada router
      console.log('Detail promo:', promo);
    },
  },
};
</script>

<style scoped>
.simple-home {
  /* opsional: sedikit padding/background ringan */
  background-color: transparent;
}
</style>
