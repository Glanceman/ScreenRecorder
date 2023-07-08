<template>
  <button type="button" :class="classObject" @click="emitFunction">
    <i v-show="!trigger" class="bi bi-play-fill"></i>
    <i v-show="trigger" class="bi bi-stop-fill"></i>
  </button>
</template>

<script>
import { computed } from "vue";

export default {
  props: {
    trigger: {
      type: Boolean,
    },
  },
  emits: ["update:trigger", "click"],
  setup(props, ctx) {
    const emitFunction = () => {
      ctx.emit("update:trigger", !props.trigger);
      ctx.emit("click");
    };

    const classObject = computed(() => {
      let classShape = "w-14 h-14 rounded-3xl";
      let classColor =
        props.trigger === false
          ? "bg-gradient-to-tr from-teal-400 to-sky-500 text-5xl text-white"
          : "bg-gradient-to-tr from-red-500 to-teal-500 text-5xl text-white";
      let classAnimation = "transition duration-500 hover:scale-125";
      let classString =
        classShape + " " + classColor + " " + classAnimation + " ";
      return classString;
    });
    return {
      emitFunction,
      classObject,
    };
  },
};
</script>

<style></style>
