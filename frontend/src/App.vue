<template>
<div>
  <Header/>
  <RouterView/>
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

<style lang="scss">

#app {
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>