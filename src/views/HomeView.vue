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
        muted
      ></video>
    </div>

    <div
      class="p-4 w-full h-fit flex justify-evenly content-center items-center"
    >
      <div class="w-1/3"></div>

      <div class="w-1/3 flex justify-center">
        <Btn_Record v-model:trigger="trigger" @click="captureStream" />
      </div>
      <div class="w-1/3 flex justify-center">
        <!-- <button ref="videoSource" @click="this.getVideoSources">Choose Video Resource</button> -->
        <select
          class="max-w-[150px] rounded-md py-1 w-full bg-gradient-to-tr from-teal-400 to-sky-500 text-white"
          v-model="selectedVideoSource"
          @click="getVideoSources"
          @change="selectVideoSource"
        >
          <option
            class="text-black w-[150px]"
            v-for="videoSource in videoSources"
            :key="videoSource.name"
            :value="videoSource.id"
          >
            {{ videoSource.name }}
          </option>
        </select>
      </div>
    </div>
  </main>
</template>

<script>
import { onMounted, onUnmounted, reactive, ref } from "vue";
import Btn_Record from "../components/icons/Btn_Record.vue";
import fixWebmDuration from "webm-duration-fix";

export default {
  components: {
    Btn_Record: Btn_Record,
  },

  setup(pros, ctx) {
    const videoSize = reactive({ width: "100px", height: "100px" });
    let trigger = ref(false);
    let videoSources = ref([]);
    let selectedVideoSource = ref(null);
    let selectedStream = null;

    let val = ref(0);
    const videoWrapper = ref(null);
    const video = ref(null);
    let timerID = null;

    let mediaRecorder = null;
    const recordedChunks = [];
    let timeSlice = 5000;
    const MIMETYPE = "video/webm; codecs=vp9";

    const captureStream = () => {
      if (selectedVideoSource.value == null) {
        console.log("Warning: no source is selected");
        trigger.value = false;
        return;
      }
      if (trigger.value === true) {
        console.log("Record");
        mediaRecorder.start(timeSlice);
      } else {
        console.log("Stop Record");
        mediaRecorder.stop();
      }
    };

    const resizeVideoElement = () => {
      let height = videoWrapper.value.clientHeight;
      let width = videoWrapper.value.clientWidth;
      let h = Math.min(width / (16 / 9), height) * 0.9;
      videoSize.width = h * (16 / 9) + "px";
      videoSize.height = h + "px";
    };

    async function getVideoSources() {
      let sources = await window.$ipc.getVideoSources();
      videoSources.value = sources;
    }

    async function selectVideoSource() {
      console.log("selected Source id: ", selectedVideoSource.value);

      if (selectedStream) {
        // stop previous stream if have
        const tracks = selectedStream.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
        selectedStream =null;
      }

      const constraints = {
        audio: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: selectedVideoSource.value,
          },
        },
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: selectedVideoSource.value,
          },
        },
      };

      try {
        selectedStream = await navigator.mediaDevices.getUserMedia(constraints);
        /* use the stream */
        video.value.srcObject = selectedStream;
        video.value.play();
      } catch (err) {
        /* handle the error */
        console.log(err);
      }

      if (trigger.value == true) {
        // stop the recording
        mediaRecorder.stop();
        trigger.val = false;
      }

      mediaRecorder = new MediaRecorder(selectedStream, {
        mimeType: MIMETYPE,
        audio: true,
      });
      mediaRecorder.ondataavailable = onDataAvailableHandler;
      mediaRecorder.onstop = onStopHandler;
    }

    function onDataAvailableHandler(e) {
      recordedChunks.push(e.data);
    }

    async function onStopHandler(e) {
      const updateBlob = await fixWebmDuration(
        new Blob([...recordedChunks], { type: MIMETYPE })
      );
      await window.$ipc.saveFileBuffer(updateBlob);
      recordedChunks.length = 0;

      mediaRecorder = null;
    }

    onMounted(() => {
      resizeVideoElement();
      window.addEventListener("resize", resizeVideoElement);
      //timerID =window.setInterval(getVideoSources,2000)
    });

    onUnmounted(() => {
      window.removeEventListener("resize", resizeVideoElement);
      //window.clearInterval(timerID)
    });

    return {
      videoSize,
      trigger,
      videoSources,
      selectedVideoSource,
      selectVideoSource,
      getVideoSources,
      val,
      captureStream,
      videoWrapper,
      video,
    };
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

/* select option{
  width:150px;   
} */
</style>
