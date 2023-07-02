<script setup>
import { RouterLink, RouterView } from "vue-router";
import FrameBar from "./components/FrameBar.vue";
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <FrameBar />
    <RouterView /> 
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
  },
  methods: {
  },
};
</script>

<style></style>
