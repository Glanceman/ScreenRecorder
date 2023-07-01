<template>
    <div class="framebar h-fit flex justify-center self-stretch items-center opacity-70 bg-slate-900 backdrop-blur-sm;">
        <div class="flex px-5 flex-row content-center grow">
            <div class="justify-center text-white font-bold text-sm">
                ScreenRecorder
            </div>
        </div>
        <div class="operator flex flex-row-reverse items-center text-white">
            <button class="px-1 text-lg hover:bg-red-500" @click="closeWindow">
                <i class="bi bi-x-lg"></i>
            </button>
            <div>
                <button v-if="fullScreen" class="px-1 text-lg hover:bg-slate-500  text-white" alt="fullscreen" @click="unMaxWindow">
                    <i class="bi bi-fullscreen-exit"></i>
                </button>
                <button v-else class="px-1 text-lg hover:bg-slate-500 text-white" alt="fullscreen" @click="maxWindow">
                    <i class="bi bi-fullscreen"></i>
                </button>
            </div>
            <button class="px-1 text-lg hover:bg-slate-500 text-white" alt="minimize" @click="minWindow">
                <i class="bi bi-dash-lg"></i>
            </button>
        </div>
    </div>
</template>

<script>
const ipc = window.$ipc;
export default {
    data() {
        return {
            fullScreen: false,
        };
    },
    mounted() { },
    methods: {
        closeWindow() {
            ipc.closeWindow();
        },
        maxWindow() {
            ipc.maxWindow();
            this.fullScreen = true;
        },
        unMaxWindow() {
            ipc.unMaxWindow();
            this.fullScreen = false;
        },
        minWindow() {
            ipc.minWindow();
        },
    },
};
</script>
