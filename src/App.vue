<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router'
  import loader from './components/loader/loader.vue';
</script>

<template>
  <loader />
  <RouterView />
</template>

<style>
  * {
    margin: 0;
    padding: 0;

  }

  ul {
    list-style: none;
    padding: 0;
  }



</style>
