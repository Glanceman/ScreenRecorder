<script setup></script>

<template>
  <main
    class="container h-full w-full mx-auto flex flex-col items-center justify-around"
  >
    <h1
      class="w-full p-1 text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-sky-500 text-3xl"
    >
      Screen Recorder
    </h1>

    <div
      ref="videoWrapper"
      class="relative m-2 max-w-full max-h-full w-full h-full"
    >
      <video
        ref="video"
        class="bg-opacity-50 bg-gray-600"
        :style="{ width: videoSize.width, height: videoSize.height }"
      ></video>
    </div>

    <div
      class="p-4 w-full h-fit flex justify-evenly content-center items-center"
    >
      <div class="w-1/3"></div>

      <div class="w-1/3 flex justify-center">
        <button
          type="button"
          class="w-14 h-14 rounded-3xl bg-gradient-to-tr from-teal-400 to-sky-500 text-5xl text-white transition duration-500 hover:scale-125"
        >
          <i class="bi bi-play-fill"></i>
        </button>
      </div>
      <div class="w-1/3 flex justify-center">
        <!-- <button ref="videoSource" @click="this.getVideoSources">Choose Video Resource</button> -->
        <select
          class="max-w-[150px]"
          v-model="this.selectedVideoSource"
          @change="this.selectVideoSource"
        >
          <option
            v-for="videoSource in this.videoSources"
            :key="videoSource.name"
            :value="videoSource.id"
            @click="this.selectVideoSource"
          >
            {{ videoSource.name }}
          </option>
        </select>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      videoSize: {
        width: "100px",
        height: "100px",
      },
      videoSources: [],
      selectedVideoSource: null,
    };
  },

  // Methods are functions that mutate state and trigger updates.
  // They can be bound as event handlers in templates.
  methods: {
    resizeVideoElement() {
      let height = this.$refs["videoWrapper"].clientHeight;
      let width = this.$refs["videoWrapper"].clientWidth;
      let h = Math.min(width / (16 / 9), height) * 0.9;
      this.videoSize.width = h * (16 / 9) + "px";
      this.videoSize.height = h + "px";
    },
    async selectVideoSource() {
      console.log("selected Source id: ", this.selectedVideoSource);
      const constraints = {
        // audio: {
        //   mandatory: {
        //     chromeMediaSource: "desktop",
        //     chromeMediaSourceId: this.selectedVideoSource,
        //   },
        // },
        audio:false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: this.selectedVideoSource,
          },
        },
      };

      let stream = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        /* use the stream */
        this.$refs["video"].srcObject = stream;
        this.$refs["video"].play();
      } catch (err) {
        /* handle the error */
        console.log(err);
      }
    },
    async getVideoSources() {
      //window.$ipc.popUpVideoSource();
      this.videoSources = await window.$ipc.getVideoSources();
      console.log(this.videoSources);
      // const videoSources = await desktopCapturer.getSources({
      //   types: ["screen", "windows"],
      // });

      // const videoOptionsMenu = Menu.buildFromTemplate(videoSources.map((source)=>{
      //   return {
      //     label:source.name,
      //     click:()=>console.log(source)
      //   }
      // }))

      // videoOptionsMenu.popup();
    },
  },

  // Lifecycle hooks are called at different stages
  // of a component's lifecycle.
  // This function will be called when the component is mounted.
  mounted() {
    this.resizeVideoElement();
    this.getVideoSources();
    window.addEventListener("resize", this.resizeVideoElement);
  },
  unmounted() {
    window.removeEventListener("resize", this.resizeVideoElement);
  },
};
</script>

<style scoped>
video {
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* --ratio: calc(16 / 9);
  --h: min(calc(50vw / var(--ratio)), 50vh);
  height: calc(var(--h) / var(--ratio));
  width: var(--h); */
}
</style>
