<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div
    class="framebar h-8 flex justify-center self-stretch items-center opacity-70 bg-slate-900 backdrop-blur-sm;"
  >
    <div class="flex px-5 py-1 flex-row self-stretch grow">
      <div class="justify-center text-white font-bold">ScreenRecorder</div>
    </div>
    <div class="operator px-2 py-1 flex flex-row-reverse items-center self-stretch">
      <div class="hover:bg-red-500">
        <i class="bi bi-x"></i>
      </div>
      <i class="bi bi-fullscreen hover:bg-slate-400"></i>
      <i class="bi bi-dash hover:bg-slate-400"></i>
    </div>
  </div>
  <!--<RouterView />-->
</template>

<style></style>
