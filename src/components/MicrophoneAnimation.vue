<template>
    <div class="mic-container" @click="toggleAnimation"
        :class="{ 'small-screen': isSmallScreen, 'disabled': props.disabled }">
        <div class="circle" :class="{ active: isAnimationActive }">
            <div class="col">
                <div class="flex items-center mb-2">
                    <pauseIcon v-if="paused" alt=""
                        :class="{ 'icon-disabled': props.disabled, 'icon-small': isSmallScreen }" class="ml-2.5 mt-2" />
                    <microOnIcon v-else alt="" :class="{ 'icon-disabled': props.disabled, 'icon-small': isSmallScreen }" />
                </div>
                <div>
                    {{ recordingTime }}
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, watchEffect, onMounted, onBeforeUnmount, defineProps } from 'vue';
import pauseIcon from '@/assets/icons/pause.svg';
import microOnIcon from '@/assets/icons/microOn.svg';

const props = defineProps({
    recordingTime: {
        type: String,
        required: true
    },
    paused: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false,
    }
});

const isAnimationActive = ref(true);

watchEffect(() => {
    isAnimationActive.value = !props.paused;
});

const emit = defineEmits(['toggle-recording']);

const toggleAnimation = () => {
    if (!props.disabled) {
        emit('toggle-recording');
    }
};


const isSmallScreen = ref(window.innerWidth < 768); // 假設 768px 以下為手機屏幕尺寸
const checkScreenSize = () => {
    isSmallScreen.value = window.innerWidth < 768;
};

onMounted(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkScreenSize);
});

</script>
  
  
<style scoped>
.mic-container {
    display: flex;
    /* 使用 Flexbox */
    justify-content: center;
    /* 水平置中 */
    align-items: center;
    /* 垂直置中 */
    margin-top: 3rem;
    position: absolute;
    top: 40%;
    /* 調整為 0 */
    left: 0;
    /* 調整為 0 */
    right: 0;
    /* 新增 */
    bottom: 0;
    /* 新增 */
    transform: translateY(-50%);
    /* 垂直向上偏移 50% */
}

.mic-container .circle {
    width: 340px;
    height: 340px;
    border-radius: 50%;
    background: #ffffff;
    display: flex;
    /* 使用 Flexbox */
    justify-content: center;
    /* 水平置中 */
    align-items: center;
    /* 垂直置中 */
    transition: 0.5s;
    box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.05), 0 1px 18px 0 rgba(0, 0, 0, 0.05),
        0 3px 5px -3px rgba(0, 0, 0, 0.05);
}


.mic-container .circle.active {
    background: #fff;
}

.mic-container .circle i {
    color: #b2b1b1;
    font-size: 84px;
    transition: 0.9s;
}

.mic-container .circle.active i {
    color: #2c8eee;
    text-align: center;
    transition: 0.1s all ease-in;
    position: relative;
}

/* 線動畫 */
.mic-container .circle.active:before {
    content: "";
    width: 240px;
    height: 240px;
    border-radius: 100%;
    background-color: transparent;
    border: 1px solid #e4f2ff;
    z-index: -1;
    position: absolute;
    transition: 1.5s all ease;
    animation: woong 1.5s infinite;
    animation-delay: 0.2s;
}

.mic-container .circle.active::before {
    content: "";
    width: 240px;
    height: 240px;
    border-radius: 100%;
    background-color: #90c6fb;
    z-index: -1;
    position: absolute;
    transition: 1.5s all ease;
    animation: woong-3 1.5s infinite;
}

.mic-container .circle.active:after {
    content: "";
    width: 280px;
    height: 280px;
    border-radius: 100%;
    background-color: #90c6fb;
    z-index: -1;
    position: absolute;
    transition: 1.5s all ease;
    animation: woong-2 1.5s infinite;
    animation-delay: 0.2s;
    /* 延遲以與其他動畫同步 */
}

@keyframes woong {
    0% {
        -webkit-transform: scale(1.5);
        opacity: 0.9;
    }

    50% {
        -webkit-transform: scale(5);
        opacity: 0.5;
    }

    100% {
        -webkit-transform: scale(3);
        opacity: 0;
    }
}

@keyframes woong-2 {
    0% {
        -webkit-transform: scale(1);
        opacity: 0.3;
    }

    50% {
        -webkit-transform: scale(1.5);
        opacity: 0.2;
    }

    100% {
        -webkit-transform: scale(2);
        opacity: 0;
    }
}

@keyframes woong-3 {
    0% {
        -webkit-transform: scale(1);
        opacity: 0.4;
    }

    50% {
        -webkit-transform: scale(1.4);
        opacity: 0.2;
    }

    100% {
        -webkit-transform: scale(2);
        opacity: 0;
    }
}


.small-screen .circle {
    width: 240px;
    height: 240px;
}

/* 適應小屏幕的其他樣式 */
.small-screen .circle:before {
    width: 200px;
    height: 200px;
}

.small-screen .circle.active::before {
    content: "";
    width: 200px;
    height: 200px;
    border-radius: 100%;
    background-color: #90c6fb;
    z-index: -1;
    position: absolute;
    transition: 1.5s all ease;
    animation: woong-3 1.5s infinite;
}

.small-screen .circle.active:after {
    content: "";
    width: 180px;
    height: 180px;
}



/* 省略其他不變的樣式 */

@media (max-width: 480px) {
    .mic-container {
        margin-top: 1rem;
    }

    .mic-container .circle {
        width: 200px;
        /* 更小尺寸的圓 */
        height: 200px;
    }

    .icon-small {
        width: 3rem;
        /* 調整為較小尺寸 */
        height: 3rem;
    }
}

/* 新增的媒體查詢 */
@media (max-width: 768px) {
    .mic-container {
        margin-top: 2rem;
    }
}

.disabled {
    pointer-events: none;
    opacity: 0.5;
}

.icon-disabled {
    filter: grayscale(100%);
}</style>

  