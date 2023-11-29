<template>
  <div class="logoposition">
    <LogoSmall v-if="isSmallScreen" class="loginLogo" />
    <LogoLarge v-else class="loginLogo" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import LogoLarge from '@/assets/icons/logo_large.svg';
import LogoSmall from '@/assets/icons/logo_small.svg'; 

const isSmallScreen = ref(false);

const handleScreenResize = () => {
  isSmallScreen.value = window.innerWidth < 576;
};

onMounted(() => {
  window.addEventListener('resize', handleScreenResize);
  handleScreenResize();
});
</script>

<style scoped>
/* .loginLogo {
  width: 100%;
  max-width: 350px;
  padding: 20px;
}

@media (max-width: 576px) {
  .loginLogo {
    max-width: 250px;
  }
} */
</style>
