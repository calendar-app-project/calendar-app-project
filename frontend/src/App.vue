<template>
<div>
  <Header />
  <RouterView />
  </div>
</template>

<script>
import Header from './components/Header.vue'

export default {

  components: {
   Header
  }
}
</script>

<style>
#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #676a6d;
}
</style>
