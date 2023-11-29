<template>
    <div class="flex flex-col items-center justify-center loaderPosition">
        <div class="loader"></div>
        <div class="typewriter">
            <h1>{{ animatedText }}<span v-if="showCursor" aria-hidden="true"></span></h1>
        </div>
    </div>
</template>
  
  
<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue';

const dataText: string[] = ["語音資料轉換中..."];
const animatedText = ref<string>('');
const showCursor = ref<boolean>(true);
let textIndex: number = 0;

const typeWriter = (text: string, index: number, callback: () => void) => {
    if (index < text.length) {
        animatedText.value = text.substring(0, index + 1);
        setTimeout(() => typeWriter(text, index + 1, callback), 100);
    } else if (callback) {
        setTimeout(callback, 700);
    }
};

const startTextAnimation = () => {
    if (textIndex < dataText.length) {
        typeWriter(dataText[textIndex], 0, () => {
            textIndex++;
            startTextAnimation();
        });
    } else {
        textIndex = 0;
        startTextAnimation();
    }
};

watchEffect(() => {
    const interval = setInterval(() => {
        showCursor.value = !showCursor.value;
    }, 500);

    onMounted(() => {
        startTextAnimation();
    });

    return () => {
        clearInterval(interval);
    };
});
</script>

<style scoped>
.loader {
    width: 10px;
    height: 10px;
    border-radius: 100%;
    box-shadow: 20px 0 #2c8eee, 14.14213562px 14.14213562px rgba(44, 142, 238, 0.8), 0 20px rgba(44, 142, 238, 0.6), -14.14213562px 14.14213562px rgba(44, 142, 238, 0.4), -20px 0 rgba(44, 142, 238, 0.2);
    animation: load-spin 800ms steps(8) infinite;
}

.loaderPosition{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}


@keyframes load-spin {
    from {
        transform: rotateZ(0);
    }

    to {
        transform: rotateZ(-360deg);
    }
}

/* 文字動畫 */
.typewriter h1 {
    color: black;
    text-transform: uppercase;
    margin-top: 4rem;
    letter-spacing: 2px;
}

.typewriter span {
    border-right: .05em solid;
    animation: caret 3s steps(1) infinite;
}

@keyframes caret {
    50% {
        border-color: transparent;
    }
}
</style>
  