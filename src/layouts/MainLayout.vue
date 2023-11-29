<template>
    <div class="w-full h-screen">
        <TopBar />
        <router-view></router-view>
    </div>
</template>

<script setup lang="ts">
import TopBar from "@/components/TopBar.vue"

</script>

<style lang="scss" scoped></style>