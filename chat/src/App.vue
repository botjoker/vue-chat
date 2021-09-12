<template>
  <div id="app" class="container">
    <Chat />
  </div>
</template>

<script>
import Chat from './components/Chat.vue'

export default {
  name: 'App',
  components: {
    Chat
  }
}
</script>

<style>
body {
  color: #FFF;
  background: #0D1018;
}
.container {
  width: 1000px;
  margin: 0 auto;
}

</style>
