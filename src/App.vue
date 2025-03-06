<script setup>
import { RouterView } from 'vue-router'
import NavBar from '@/components/layout/NavBar.vue'

</script>

<template>
  <NavBar/>
  <RouterView v-slot="slotProps">
    <transition name="route" mode="out-in">
      <component :is="slotProps.Component"></component>
    </transition>
  </RouterView>
</template>

<style>
.container {
    max-width: 700px;
    padding: 20px;
    margin: 0 auto;
}

.route-enter-from {
 opacity: 0;
 transform: translateY(-30px);
}

.route-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.route-leave-from,
.route-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.route-enter-active {
  transition: all 0.3s ease-out;
}

.route-leave-active {
  transition: all 0.3s ease-in;

}
</style>
