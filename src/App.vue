<template>
  <div id="app">
    {{msg}}
    <resp-button ref="btn1" @triggered="act1"></resp-button>
    <resp-button ref="btn2" @triggered="act2"></resp-button>
    <resp-button ref="btn3" @triggered="act3"></resp-button>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    methods: {
      act1 (id) {
        let self = this
        setInterval(function () {
          console.log(self.$refs.btn1.$trigger(id, 'ERROR'), 'mock next state of btn1')
        }, 2500);
      },
      act3 (id) {
        let self = this
        setInterval(function () {
          console.log(self.$refs.btn3.$trigger(id), 'mock next state of btn3')
        }, 3500);
      },
      act2 (id) {
        let self = this
        setInterval(function () {
          console.log(self.$refs.btn2.$trigger(id), 'mock next state of btn2')
        }, 3500);
      },
    }
  }
</script>

<style lang="scss">
 button{
   margin-bottom: 20px;
 }
</style>
