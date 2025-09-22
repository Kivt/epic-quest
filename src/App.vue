<script setup lang="ts">
import VisualNovelReader from './components/VisualNovelReader.vue'
import story from './assets/birthday'
</script>

<template>
  <VisualNovelReader :story="story" />
</template>

<style scoped>
/* App component styles - minimal since VisualNovelReader handles its own layout */
</style>
