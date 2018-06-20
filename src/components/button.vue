<template>
  <button class="resp-button"
          :class="className"
          @click="action">{{name}}
  </button>
</template>

<script>
  export default {
    name: 'respButton',
    props: {
      options: {
        type: Object,
        default: () => {
          return {};
        }
      }
    },
    data() {
      return {
        id: 0,
        state: '',
        name: '',
        className: ''
      }
    },
    watch: {
      id() {
        this.state = this.respButton.pool[this.id].state;
      },
      state() {
        if (this.options[this.state]) {
          this.name = this.options[this.state].label;
          this.className = this.options[this.state].className;
        } else {
          this.name = this.name;
          this.className = this.className;
        }
      }
    },
    methods: {
      action() {
        if (this.state !== 'NORMAL') {
          return false
        }
        this.respButton.stock.push(this.id)
        this.$trigger(this.id)
        this.$emit('triggered', this.id)
      }
    },
    mounted() {
      this.id = this.$subscribe()
    }
  }
</script>

<style lang="scss">
  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    25% {
      transform: rotate(90deg);
    }
    50% {
      transform: rotate(180deg);
    }
    75% {
      transform: rotate(270deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .resp-button {
    outline: 0;
    border: 0;
    min-width: 4em;
    display: block;
    margin-left: auto;
    margin-right: auto;
    background-color: #2196f3;
    text-align: center;
    color: #fff;
    padding: 5px 20px;
    border-radius: 5px;
    transition: all .2s linear !important;
    transform-origin: 50% 50%;
    overflow: hidden;
    &.button-actting,
    &.button-pendding {
      text-indent: -999px;
      background-color: #fff;
      border-radius: 50%;
      width: 2em;
      min-width: 2em;
      height: 2em;
      padding: 0;
      border: 2px solid #2196f3;
      border-left-color: #fff;
      animation: rotate .35s linear infinite;
    }
    &.button-success {
      background-color: #0f0;
      width: 2em;
      min-width: 2em;
      height: 2em;
      padding: 0;
      border-radius: 50%;
      color: #0f0;
      text-align: center;
      &:before{
        content: '√';
        color: #f00;
      }
    }

  }
</style>
