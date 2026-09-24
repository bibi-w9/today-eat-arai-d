<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <MiniAssistant />
  </div>
</template>

<script setup>
import MiniAssistant from '~/components/MiniAssistant.vue'
</script>

<style>
body {
  font-family: 'Mali', 'Quicksand', sans-serif;
}
</style>