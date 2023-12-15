<template>
    <div class="audio-player p-2 mr-2 rounded-full " v-if="audioUrl">
        <button @click="togglePlay" class="px-3">
            <svg v-if="isPlaying" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M14 19V5h4v14h-4Zm-8 0V5h4v14H6Z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
                <path fill="currentColor"
                    d="M240 128a15.74 15.74 0 0 1-7.6 13.51L88.32 229.65a16 16 0 0 1-16.2.3A15.86 15.86 0 0 1 64 216.13V39.87a15.86 15.86 0 0 1 8.12-13.82a16 16 0 0 1 16.2.3l144.08 88.14A15.74 15.74 0 0 1 240 128Z" />
            </svg>
        </button>
        <div class="w-36">
            <span class="w-full time-display">{{ currentTimeFormatted }} / {{ durationFormatted }}</span>
        </div>
        <div class="progress-bar" @click="seek($event)">
            <div class="progress" :style="{ width: progress + '%' }"></div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, watch, computed, onBeforeUnmount } from 'vue';

const props = defineProps({
    audioUrl: String,
});

const emit = defineEmits(['stopAudio']);
const audioElement = ref(new Audio());
const isPlaying = ref(false);
const progress = ref(0);
const currentTime = ref(0);
const duration = ref(0);

// const initializeAudio = () => {
//     audioElement.value = new Audio(props.audioUrl);
//     const countAudioTime = async () => {
//         while (isNaN(audioElement.value.duration) || audioElement.value.duration === Infinity) {
//             await new Promise(resolve => setTimeout(resolve, 200));
//             audioElement.value.currentTime = 10000000 * Math.random();
//         }
//         audioElement.value.currentTime = 0;
//         duration.value = audioElement.value.duration;
//     };

//     countAudioTime().then(() => {
//         console.log('音樂檔案的總時長:', audioElement.value.duration);
//     }).catch(error => {
//         console.error("Error calculating audio duration:", error);
//     });
// };

watch(() => props.audioUrl, (newUrl, oldUrl) => {
    if (newUrl && newUrl !== oldUrl) {
        if (!audioElement.value.paused) {
            audioElement.value.pause();
        }
        audioElement.value.src = newUrl;
        audioElement.value.load(); // 重新加載音頻

        // 當音頻加載完畢時更新持續時間
        audioElement.value.onloadedmetadata = () => {
            duration.value = audioElement.value.duration;
            currentTime.value = 0;
            progress.value = 0;
            isPlaying.value = false;
        };
    }
}, { immediate: true });



const togglePlay = () => {
    if (audioElement.value.paused) {
        audioElement.value.play();
        isPlaying.value = true;
    } else {
        audioElement.value.pause();
        isPlaying.value = false;
    }
};

onBeforeUnmount(() => {
    if (audioElement.value && !audioElement.value.paused) {
        audioElement.value.pause();
        emit('stopAudio');
    }
});

const seek = (event: any) => {
    const bounds = event.target.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const percentage = x / bounds.width;
    audioElement.value.currentTime = audioElement.value.duration * percentage;
};

audioElement.value.addEventListener('timeupdate', () => {
    currentTime.value = audioElement.value.currentTime;
    duration.value = audioElement.value.duration;
    progress.value = (currentTime.value / duration.value) * 100;
});

audioElement.value.addEventListener('ended', () => {
    isPlaying.value = false;
    currentTime.value = 0;
    progress.value = 0;
});

const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
};

const currentTimeFormatted = computed(() => formatTime(currentTime.value));
const durationFormatted = computed(() => formatTime(duration.value));
</script>

<style scoped>


.audio-player {
    display: flex;
    align-items: center;
    background-color: var(--primary);
    color: white;
}

.audio-player button {
    background-color: transparent;
    border: none;
    cursor: pointer;
}

.audio-player .time-display {
    white-space: nowrap;
}


.progress-bar {
    width: 100%;
    height: 4px;
    background-color: #ddd;
    border: 1px solid #fff;
    cursor: pointer;
    margin: 0 10px;
}

.progress {
    height: 100%;
    background-color: var(--primary);
}

@media (max-width: 480px) {
    .audio-player .progress-bar {
        width: 55%;
    }

    .audio-player .time-display {
        font-size: 12px;
    }

    .audio-player .time-display {
        white-space: wrap;
    }
}


@media (max-width: 389px) {
    .audio-player .progress-bar {
        width: 55%;
    }

    .audio-player .time-display {
        font-size: 12px;
    }

    .audio-player .time-display {
        white-space: wrap;
    }

}
</style>
