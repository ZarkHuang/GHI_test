<template>
    <n-modal v-model:show="showModal" :width="isMobile ? '100%' : '400px'"
        class="bg-white p-10 rounded-lg card-shadow border border-blue-300">
        <n-card bordered :style="`width: ${isMobile ? '340px' : '600px'}`">
            <button class="absolute top-3 right-3" @click="resetFeedback">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="feather feather-x w-3 h-3 sm:w-3 sm:h-3">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <h4 class="text-xl font-bold pb-2 text-center">使用心得回饋</h4>
            <div class="flex flex-col space-y-5 bg-white mt-5">
                <div v-for="item in feedbackItems" :key="item.id" class="flex items-center justify-between">
                    <span class="mr-8">{{ item.text }}</span>
                    <div class="flex items-center feedbackButton">
                        <button @click="toggleLiked(item.id)" :class="{ 'button-active': item.liked }"
                            class="border p-2 rounded-md">
                            <thumbUp />
                        </button>
                        <button @click="toggleUnLiked(item.id)" :class="{ 'button-active': item.unliked }"
                            class="ml-5 border p-2 rounded-md">
                            <thumbDown />
                        </button>
                    </div>
                </div>
                <div>
                    <span>其他回饋與建議:</span>
                    <input placeholder="請輸入文字" v-model="additionalFeedback"
                        class="rounded-md py-1.5 px-3 custom-placeholder mt-1  w-full border   text-base font-montserrat  outline-primary-hover focus:border-primary transition-all duration-300">
                </div>
            </div>
            <n-space justify="center" class="mt-5">
                <button class="confirm-button flex items-center" @click="resetFeedback">取消</button>
                <button class="confirm-button flex items-center" @click="submitFeedback">確定</button>
            </n-space>
        </n-card>
    </n-modal>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue';
import { NModal, useMessage } from 'naive-ui';
// Icons
import thumbUp from '@/assets/icons/thumb-up.svg';
import thumbDown from '@/assets/icons/thumb-down.svg';

const message = useMessage();
const feedbackItems = ref([
    { id: 1, text: 'LM語言模型生成的文字是否與提供的資料一致？', liked: false, unliked: false },
    { id: 2, text: 'LM語言模型是否生成了一些提供資料中不存在的內容', liked: false, unliked: false },
    { id: 3, text: 'LM語言模型生成的內容是否符合需求？', liked: false, unliked: false },
    { id: 4, text: 'LM語言模型生成的文字是否遺漏了原本資料中的重要內容？', liked: false, unliked: false },
    { id: 5, text: '生成的文字是否包含可能對患者有害的內容，無論是故意的還是無意的？', liked: false, unliked: false },
]);
const additionalFeedback = ref('');
const isMobile = computed(() => window.innerWidth <= 640);

const toggleLiked = (id: number) => {
    feedbackItems.value.forEach(item => {
        if (item.id === id) {
            item.liked = !item.liked;
            item.unliked = false;
        }
    });
};
const toggleUnLiked = (id: number) => {
    feedbackItems.value.forEach(item => {
        if (item.id === id) {
            item.unliked = !item.unliked;
            item.liked = false;
        }
    });
};

const props = defineProps({
    show: Boolean
});
const emits = defineEmits(['update:show']);

const showModal = computed({
    get: () => props.show,
    set: (value) => emits('update:show', value)
});

const resetFeedback = () => {
    feedbackItems.value.forEach(item => {
        item.liked = false;
        item.unliked = false;
    });
    additionalFeedback.value = '';
    showModal.value = false;
};

const submitFeedback = () => {
    console.log('Feedback Submitted:', feedbackItems.value, additionalFeedback.value);
    // TODO: 提交逻辑
    feedbackItems.value.forEach(item => {
        item.liked = false;
        item.unliked = false;
    });
    additionalFeedback.value = '';
    showModal.value = false;
    message.success('提交成功!');
};

</script>

<style scoped>
.confirm-button {
    display: flex;
    justify-content: center;
    width: 113px;
    height: 40px;
    margin: 0 auto;
    border-radius: 4px;
    border: 1px solid var(--primary);
    background-color: var(--background-white);
    transition: .3s ease-in-out;
}

.feedbackButton button {
    color: #90C6FB;
    transition: .3s ease-in-out;
}

.feedbackButton button:hover {
    background-color: var(--primary);
    color: var(--text-white);
}

.feedbackButton button:active {
    background-color: var(--primary);
    color: var(--text-white);
}

.button-active {
    background-color: var(--primary);
    color: var(--text-white);
}

.button-active svg {
    fill: var(--text-white);
}
</style>
  