<template>
  <v-app>
    <v-main class="app-main">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
</script>

<style>
.app-main {
  min-height: 100vh;
  padding: 24px;
}

.app-bar.blur-surface {
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  background-color: rgba(255, 255, 255, 0.8) !important;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

* {
  scroll-behavior: smooth;
}
</style>
