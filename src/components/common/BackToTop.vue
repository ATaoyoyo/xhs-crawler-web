<template>
  <transition name="fade">
    <button v-if="show" 
      @click="scrollToTop"
      class="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2"
      :class="buttonClass">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  </transition>
</template>

<script>
export default {
  name: 'BackToTop',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    isDarkMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['scroll-to-top'],
  computed: {
    buttonClass() {
      return this.isDarkMode 
        ? 'bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500'
        : 'bg-white hover:bg-gray-50 text-gray-600 focus:ring-blue-500'
    }
  },
  methods: {
    scrollToTop() {
      this.$emit('scroll-to-top')
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>