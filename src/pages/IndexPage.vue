<template>
  <div class="flex  items-center flex-col ">
    <div class="py-2.5 flex items-center justify-between md:w-8/12 w-11/12 border-b-[1px]">
      <button @click="goBack" class="hoverButton acitvebutton">
        <arrowLeft alt="" class="iconStyle" />
      </button>
      <div class="text-center flex-grow md:w-8/12 w-10/12">
        <p class=" text-xs">
          {{ sceneTitle }}
        </p>
        <h4 class="m-auto px-2 font-bold truncate w-[calc(100%-10px)] text-base md:text-base " style="max-width: 600px;">
          {{ projectDetails.project_name }}
        </h4>
      </div>

      <button @click="showEditModal" class="hoverButton acitvebutton">
        <pen alt="" class="iconStyle" />
      </button>

      <n-modal v-model:show="showModal" class="bg-white p-6 rounded-lg shadow-md border border-blue-300">
        <n-card :style="`width: ${isMobile ? '340px' : '600px'}`">
          <h4 class="text-xl font-bold pb-6 text-center">編輯專案名稱</h4>
          <n-input v-model:value="temporaryProjectName" placeholder="輸入新的專案名稱" />
          <n-space justify="center" class="mt-5">
            <button class="confirm-button flex items-center" @click="showModal = false">取消</button>
            <button class="confirm-button flex items-center" @click="updateProjectName">更新</button>
          </n-space>
        </n-card>
      </n-modal>
    </div>
    <template v-if="projectStatus === 'init' && !showMicrophoneAnimation">
      <p class="text-center my-10">語音方式 </p>
      <div>
        <section class="cards">
          <button class="card flex items-center justify-center" @click="startRecording">
            <div class="card__content flex flex-col justify-center items-center">
              <n-icon class="mx-1 card-icon iconSize">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor"
                    d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3m7 9c0 3.53-2.61 6.44-6 6.93V21h-2v-3.07c-3.39-.49-6-3.4-6-6.93h2a5 5 0 0 0 5 5a5 5 0 0 0 5-5h2Z" />
                </svg>
              </n-icon>
              <div class="card__info text-center">
                <h3 class="card__title font-custom-bold-weight text-base">語音錄製</h3>
                <span class="card__category text-xs mt-1">錄製時限為8分鐘</span>
              </div>
            </div>
          </button>
          <button @click="triggerFileInput" class="card flex items-center justify-center">
            <div class="card__content flex flex-col justify-center items-center">
              <n-icon class="mx-1 card-icon iconSize">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M5 20h14v-2H5v2zm0-10h4v6h6v-6h4l-7-7l-7 7z" />
                </svg>
              </n-icon>
              <div class="card__info text-center">
                <h3 class="card__title font-custom-bold-weight text-base">上傳語音</h3>
                <span class="card__category text-xs mt-1">檔案大小限制100MB</span>
              </div>
            </div>
          </button>
          <input type="file" ref="fileInput" class="hidden" @change="handleFileUpload" />
        </section>
      </div>
    </template>
    <template v-else-if="projectStatus === 'init' && showMicrophoneAnimation">
      <div class="flex justify-center items-center overlay">
        <div class="text-center mt-20">
          <MicrophoneAnimation :paused="isPaused" @toggle-recording="handleRecordingToggle"
            :recordingTime="formattedRecordingTime" :disabled="isPauseButtonDisabled" class="disabled:opacity-25"/>
          <div
            class="audioButton flex flex-col sm:flex-row justify-center items-center space-x-0 sm:space-x-2 space-y-2 sm:space-y-0 mt-24">
            <button @click="toggleRecording" :disabled="isPauseButtonDisabled"
              class="ease-in-out disabled:opacity-50   justify-center recordBtn flex items-center border border-blue-300px-2 py-1">
              <!-- 暫停圖標 -->
              <n-icon class="mx-1" v-if="!isPaused">
                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path fill="currentColor"
                    d="M96 479H32c-17.67 0-32-14.33-32-32V65c0-17.67 14.33-32 32-32h64c17.67 0 32 14.33 32 32v382c0 17.67-14.33 32-32 32zM288 479h-64c-17.67 0-32-14.33-32-32V65c0-17.67 14.33-32 32-32h64c17.67 0 32 14.33 32 32v382c0 17.67-14.33 32-32 32z" />
                </svg>
              </n-icon>


              <n-icon class="mx-1" v-else>
                <MicOn alt="" class="iconStyle h-3 w-3 mr-2" />
              </n-icon>
              {{ isPaused ? '繼續' : '暫停' }}
            </button>

            <button @click="stopRecording"
              class=" justify-center recordBtn flex items-center border border-blue-300px-2 py-1">
              <Stop alt="" class="iconStyle h-3 w-3 mr-2" />
              結束並產出報告
            </button>

            <n-modal v-model:show="showRecordingLimitModal"
            class="bg-white py-10 px-4 rounded-lg shadow-md border border-blue-300">
            <n-card bordered :style="`width: ${isMobile ? '340px' : '420px'}; height: ${isMobile ? '220px' : '220px'}`">
                <h4 class="text-xl font-bold pb-2 text-center">錄音時間已達上限</h4>
                <p class="text-base  text-center">已達錄音上限8分鐘，將結束錄音並產生報告。</p>
                <n-space justify="center" class="mt-5">
                  <button class="confirm-button flex items-center" @click="handleModalConfirm">確定</button>
                </n-space>
              </n-card>
            </n-modal>

          </div>
        </div>
      </div>
    </template>

    <!-- 上傳時動畫 -->
    <template v-else-if="projectStatus === 'pending'">
      <Loader />
    </template>

    <!-- 上傳完成後的頁面 -->
    <template v-else>
      <div v-if="isMobile" class="w-full h-[calc(100%-16px)]">
        <!-- Tab 按鈕 -->
        <div class="flex justify-center my-5 gap-2">
          <button class="py-1 px-2  text-center" :class="{
            'font-bold border-b-2 border-blue-300': currentTab === 'sttResult',
            'font-normal': currentTab !== 'sttResult'
          }" @click="currentTab = 'sttResult'">
            語音辨識結果
          </button>
          <button class="py-1 px-2 text-center" :class="{
            'font-bold border-b-2 border-blue-300': currentTab === 'llmResult',
            'font-normal': currentTab !== 'llmResult'
          }" @click="currentTab = 'llmResult'">
            報告結果
          </button>
        </div>



        <!-- 語音辨識結果 -->
        <div v-if="currentTab === 'sttResult'">
          <!-- 語音辨識結果的內容 -->
          <div class="md:w-8/12 w-11/12 rounded overflow-hidden shadow-lg mx-auto mt-8 reportPannel">
            <div class="flex items-end px-4 ">
              <!-- 語音檔案播放器 -->
              <div class="flex-grow ">
                <div class="font-bold text-base mb-2 pt-4">語音檔案</div>
                <AudioPlayer v-if="audioUrl" :audio-url="audioUrl" />
                <div v-else>音樂檔案尚未加載</div>
              </div>
              <div class="flex-shrink-0 flex items-center py-2 px-1 space-x-2">
                <!-- 垃圾icon -->
                <button @click="confirmDelete">
                  <trashCart />
                </button>

                <n-modal v-model:show="showDeleteConfirmation"
                  class="bg-white p-10 rounded-lg shadow-md border border-blue-300">
                  <n-card bordered :style="`width: ${isMobile ? '340px' : '400px'}`">
                    <h4 class="text-xl font-bold pb-2 text-center">確定要刪除語音檔案？</h4>
                    <p class="text-base  text-center">語音檔案刪除後將無法復原</p>
                    <n-space justify="center" class="mt-5">
                      <button class="confirm-button flex items-center" @click="cancelDelete">取消</button>
                      <button class="confirm-button flex items-center" @click="executeDelete">確定</button>
                    </n-space>
                  </n-card>
                </n-modal>
                <!-- 下載icon -->
                <button @click="downloadAudio" class="mt-1">
                  <downloadBlack />
                </button>
              </div>
            </div>
            <div class="px-4 p-4">
              <div class="font-bold text-base mb-2">語音辨識結果</div>
              <textarea
                class="input-style w-full border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-blue-300 focus:ring-sky-200 focus:ring-1 sm:text-base resize-none"
                placeholder="資料讀取中..." v-model="editableSttText" @input="handleSttInput" rows="4">
</textarea>
            </div>
            <div class="px-4 pb-4 flex">
              <button
                class="mx-2 flex items-center justify-center gap-2 rounded-md h-10 w-full bg-white border border-blue-300 hoverhover:shadow-md hover:shadow-blue-300/20 transition duration-300 ease-in-out disabled:opacity-50 button-style"
                @click="reExecuteStt">
                <n-icon class="h-4 w-4 flex items-center">
                  <refresh />
                </n-icon>
                重新辨識
              </button>
              <button
                class="mx-2 flex items-center justify-center gap-2 rounded-md h-10 w-full bg-white border border-blue-300 hoverhover:shadow-md hover:shadow-blue-300/20 transition duration-300 ease-in-out disabled:opacity-50 button-style"
                :disabled="!isSttTextChanged" @click="updateSttContent">
                <img :src="paper" alt=""
                  :class="{ 'filter grayscale': isSttTextChanged, 'opacity-30': !isSttTextChanged }" />
                <n-icon class="h-4 w-4 flex items-center">
                  <paper :class="{ 'filter grayscale': isSttTextChanged, 'opacity-30': !isSttTextChanged }" />
                </n-icon>
                更新內容
              </button>
            </div>

          </div>
        </div>

        <!-- 報告結果 -->
        <div v-if="currentTab === 'llmResult'">
          <!-- llmResult -->
          <div class="md:w-8/12 w-11/12 rounded shadow-lg mx-auto  reportPannel">
            <div class="px-4">
              <div class="font-bold text-base mb-2 pt-6"> {{ scene === 'Nursing' ? 'DART報告' : 'SOAP報告' }}</div>
              <!-- 如果是Nursing狀態顯示 -->
              <div v-if="scene === 'Nursing'"
                class="input-style s-input-style w-full border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm overflow-y-auto max-h-[200px] resize-none">
                <div v-for="(item, index) in llm_result_test" :key="index" class="flex gap-2 mb-5">
                  <div v-if="item[0] !== '結果生成中 ...'"
                    class="bg-primary rounded-md flex mr-2 justify-center items-center tagStyle">
                    <p class="text-white text-sm">{{ item[0] }}</p>
                  </div>

                  <p v-else class="text-base">{{ item[0] }}</p>

                  <p>{{ item[1] }}</p>
                </div>
              </div>
              <!-- 如果場景是其他狀態就顯示 -->
              <textarea v-else
                class="input-style s-input-style w-full border border-slate-300 rounded-md pl-3 pr-3 shadow-sm  resize-none"
                placeholder="資料讀取中..." v-model="editableLlmText" rows="4" readonly>
            </textarea>

              <!-- 其他 -->
            </div>
            <div class="px-6 p-4 flex">
              <button
                class="mx-2 flex items-center justify-center gap-2 rounded-md h-10 w-full bg-white border border-blue-300 hoverhover:shadow-md hover:shadow-blue-300/20 transition duration-300 ease-in-out disabled:opacity-50 button-style"
                @click="reExecutellm">
                <n-icon class="h-4 w-4 flex items-center">
                  <refresh />
                </n-icon>
                重新辨識
              </button>
              <button
                class="flex items-center justify-center gap-2 rounded-md h-10 w-full bg-white border border-blue-300 hoverhover:shadow-md hover:shadow-blue-300/20 transition duration-300 ease-in-out disabled:opacity-50 button-style"
                @click="downloadReport">
                <n-icon class="h-4 w-4 flex items-center">
                  <downloadBlack />
                </n-icon>
                下載報告
              </button>
            </div>
            <div class="text-center mb-6 flex items-center justify-center ">
              <n-icon class="mr-2">
                <Feeback />
              </n-icon>
              <button @click="feedback" class="hover-underline-animation text-xs">協助我們回饋您的使用心得︎ :)</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 這是大螢幕 -->
      <div v-else class="w-full">
        <div class="md:w-8/12 w-11/12 rounded overflow-hidden shadow-lg mx-auto mt-8">
          <div class="flex items-end px-8 ">
            <div class="flex-grow ">
              <div class="font-bold text-base mb-2 pt-6">語音檔案</div>
              <AudioPlayer v-if="audioUrl" :audio-url="audioUrl" />
              <div v-else>音樂檔案尚未加載</div>
            </div>
            <div class="flex-shrink-0 flex items-center py-2 px-1 space-x-2">

              <button @click="confirmDelete">
                <trashCart />
              </button>

              <n-modal v-model:show="showDeleteConfirmation"
                class="bg-white p-10 rounded-lg shadow-md border border-blue-300">
                <n-card bordered :style="`width: ${isMobile ? '340px' : '400px'}`">
                  <h4 class="text-xl font-bold pb-2 text-center">確定要刪除語音檔案？</h4>
                  <p class="text-base  text-center">語音檔案刪除後將無法復原</p>
                  <n-space justify="center" class="mt-5">
                    <button class="confirm-button flex items-center" @click="cancelDelete">取消</button>
                    <button class="confirm-button flex items-center" @click="executeDelete">確定</button>
                  </n-space>
                </n-card>
              </n-modal>

              <button @click="downloadAudio" class="mt-1">
                <downloadBlack />
              </button>
            </div>
          </div>

          <div class="px-6 p-4">
            <div class="font-bold text-base mb-2">語音辨識結果</div>
            <textarea
              class="input-style w-full border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-blue-300 focus:ring-sky-200 focus:ring-1 sm:text-base resize-none"
              placeholder="資料讀取中..." v-model="editableSttText" @input="handleSttInput" rows="4">
</textarea>

          </div>
          <div class="px-6 pb-6 flex">
            <button
              class="mx-2 flex items-center justify-center gap-2 rounded-md h-10 w-full bg-white border border-blue-300 hoverhover:shadow-md hover:shadow-blue-300/20 transition duration-300 ease-in-out disabled:opacity-50 button-style"
              @click="reExecuteStt">
              <refresh />
              重新辨識
            </button>
            <button
              class="mx-2 flex items-center justify-center gap-2 rounded-md h-10 w-full bg-white border border-blue-300 hoverhover:shadow-md hover:shadow-blue-300/20 transition duration-300 ease-in-out disabled:opacity-50 button-style"
              :disabled="!isSttTextChanged" @click="updateSttContent">
              <paper :class="{ 'filter grayscale': isSttTextChanged, 'opacity-30': !isSttTextChanged }" />
              更新內容
            </button>
          </div>
        </div>

        <div class="md:w-8/12 w-11/12 rounded overflow-hidden shadow-lg mx-auto mt-8">
          <div class="px-4">
            <div class="font-bold text-base mb-2 pt-6"> {{ scene === 'Nursing' ? 'DART報告' : 'SOAP報告' }}</div>
            <!-- 如果是Nursing狀態顯示 -->
            <div v-if="scene === 'Nursing'"
              class="input-style s-input-style w-full border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm overflow-y-auto max-h-[200px] resize-none">
              <div v-for="(item, index) in llm_result_test" :key="index" class="flex gap-2">
                <div v-if="item[0] !== '結果生成中 ...'"
                  class="bg-primary rounded-md flex mr-2 justify-center items-center mt-0.5 tagStyle">
                  <p class="text-white text-sm">{{ item[0] }}</p>
                </div>
                <p>{{ item[1] }}</p>
              </div>
            </div>
            <!-- 如果場景是其他狀態就顯示 -->
            <textarea v-else
              class="input-style s-input-style w-full border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm  resize-none"
              placeholder="資料讀取中..." v-model="editableLlmText" rows="4" readonly>
            </textarea>

            <!-- 其他 -->
          </div>
          <div class="px-6 p-5 flex">
            <button
              class="mx-2 flex items-center justify-center gap-2 rounded-md h-10 w-full bg-white border border-blue-300 hoverhover:shadow-md hover:shadow-blue-300/20 transition duration-300 ease-in-out disabled:opacity-50 button-style"
              @click="reExecutellm">
              <refresh />
              重新辨識
            </button>
            <button
              class="mx-2 flex items-center justify-center gap-2 rounded-md h-10 w-full bg-white border border-blue-300 hoverhover:shadow-md hover:shadow-blue-300/20 transition duration-300 ease-in-out disabled:opacity-50 button-style"
              @click="downloadReport">
              <downloadBlack />
              下載報告
            </button>
          </div>

          <div class="text-center mb-6 flex items-center justify-center ">
            <n-icon class="mr-2">
              <Feeback />
            </n-icon>
            <button @click="feedback" class="hover-underline-animation text-xs">協助我們回饋您的使用心得︎ :)</button>
          </div>
        </div>
      </div>

    </template>
  </div>
</template>


<script setup lang="ts">
import { ref, onBeforeUnmount, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from "vue-router"
import { useMessage } from 'naive-ui';
import { getFuzzyProjectsByUser, getProjectById, updateProjectByID, executeStt, executeLlm, createWebSocket, deleteAudioFile, deleteWebSocket } from "@/apis/projectAPI.ts"
import MicrophoneAnimation from "@/components/MicrophoneAnimation.vue";
import AudioPlayer from "@/components/AudioPlayer.vue"
import Loader from '@/components/Loader.vue'
import { jsPDF } from "jspdf";

import mqtt from "mqtt"
import axios from 'axios';
// icon
import paper from '@/assets/icons/paper.svg'
import downloadBlack from '@/assets/icons/downloadBlack.svg'
import trashCart from '@/assets/icons/trashCart.svg'
import refresh from '@/assets/icons/refresh.svg'
import arrowLeft from '@/assets/icons/arrowLeft.svg'
import pen from '@/assets/icons/pen.svg'
import Stop from '@/assets/icons/stop.svg'
import Feeback from '@/assets/icons/Feeback.svg'
import MicOn from '@/assets/icons/mic-on.svg'

const projectStatus = ref('init');
const message = useMessage();
const route = useRoute()
const router = useRouter();
const scene = route.params.sceneType.toString()
const showMicrophoneAnimation = ref(false);
const recordingTime = ref(0);
const isRecording = ref(false);
const isPaused = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const isInference = ref(false);
const audioUrl = ref(''); // 音頻 URL
const editableSttText = ref('這是語音辨識結果初始文字'); // 語音辨識結果的文本
const isSttTextChanged = ref(false); // 語音辨識文本是否改變
const editableLlmText = ref('這是SORT報告初始文字'); // DART報告的文本
const projectId = route.params.projectId.toString() ? route.params.projectId.toString() : "";
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: BlobPart[] = [];
let intervalId: any;
const currentTab = ref('sttResult');
const uploadedFile = ref<File | null>(null);
const showModal = ref(false);
const temporaryProjectName = ref('')
const windowWidth = ref(window.innerWidth);
const isMobile = computed(() => windowWidth.value <= 640);
const isButtonDisabled = ref(false);
const isReExecuteSttButtonDisabled = ref(false);
const showRecordingLimitModal = ref(false);
const isPauseButtonDisabled = ref(false);

window.addEventListener('resize', () => {
  windowWidth.value = window.innerWidth;
});
interface ProjectDetails {
  id: number;
  project_name: string;
}

//Get Api
// 獲取項目列表
const fetchAndProcessProjects = async () => {
  try {
    const response = await getFuzzyProjectsByUser({
      "offset": 0,
      "fuzzy_search": "",
      "rowsPerPage": 1000,
      "scene_type": "FirstVisit"
    });
    return response;
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
};


interface ProjectDetails {
  id: number;
  project_name: string;
  audio_path?: string;
}

// 獲取projectId
const projectDetails = ref<ProjectDetails>({
  id: 0,
  project_name: '',
});

const fetchProjectDetails = async () => {
  const response = await getProjectById(projectId);
  projectStatus.value = response.data.data.stt_status;
  projectDetails.value = response.data.data;
  const audio_path: string = response.data.data.audio_path.split('/')[2];
  audioUrl.value = "https://ghi-dev.everfortuneai.com.tw/api/v1/files/" + audio_path
  editableSttText.value = response.data.data.stt_result;
  editableSttText.value = editableSttText.value.replace(/\s+/g, '');
  editableLlmText.value = response.data.data.llm_result;

  if (response.data.data.llm_status === 'pending') {
    editableLlmText.value = '結果生成中 ...'
  }
};


// DOAT文字重新整理並上色
const llm_result_test = computed(() => {
  // 檢查是否為待處理狀態或非 Nursing 场景
  if (editableLlmText.value === '結果生成中 ...' || scene !== 'Nursing') {
    // 直接返回未經處理的原始數據
    return editableLlmText.value.split("\n").map(item => [item]);
  }

  const list = editableLlmText.value.split("\n");
  let returnList: any[] = [];

  list.forEach((item) => {
    const keyvalue = item.split(":");
    const obj = [keyvalue[0], keyvalue.slice(1).join(":")]; // 確保如果 ":" 出現多次，也能正確處理
    returnList.push(obj);
  });

  return returnList;
});




const deleteAudio = async () => {
  if (projectDetails.value.audio_path) {
    const fileName: string = projectDetails.value.audio_path.split('/')[2];
    console.log(fileName);
    try {
      const result = await deleteAudioFile(fileName);
      if (result.status === 200) {
        fetchProjectDetails(); // 確保此函數在範圍內
      } else {
        console.log('刪除音檔未成功', result.status);
      }
    } catch (error) {
      console.error('刪除音檔時出現錯誤:', error);
      message.error('刪除音檔失敗');
    }
  } else {
    console.error('專案中沒有音檔路徑');
    message.error('無音檔可刪除');
  }
}

// 更新專案標題
const updateProjectName = async () => {
  try {
    const updatedData = {
      project_name: temporaryProjectName.value,
      scene_type: scene
    };
    const response = await updateProjectByID(projectDetails.value.id, updatedData);

    projectDetails.value.project_name = temporaryProjectName.value;
    console.log(response);
    showModal.value = false;
    message.success('專案名稱已更新');
    await fetchAndProcessProjects();
  } catch (error) {
    message.error(`更新專案名稱時出錯:${error}`);
    message.error('更新失敗');
  }
};

// 更新 STT 內容
const updateSttContent = async () => {
  try {
    const updatedData = {
      stt_result: editableSttText.value,
      scene_type: scene
    };
    const response = await updateProjectByID(projectDetails.value.id, updatedData);

    if (response.status === 200) {
      await handlerLLM();
      message.success('STT 内容更新成功，報告生成中...');
    }

    isSttTextChanged.value = false;

  } catch (error) {
    console.error('更新 STT 時出錯:', error);
    message.error('更新失败');
  }
};

const feedback = () => {
  message.warning('功能尚未開放')
  return
}

/****************************************************************
  其他
*****************************************************************/

// 刪除語音檔案的modal
const showDeleteConfirmation = ref(false);
const confirmDelete = () => {
  showDeleteConfirmation.value = true;
};
const cancelDelete = () => {
  showDeleteConfirmation.value = false;
};
const executeDelete = async () => {
  await deleteAudio(); // 假設 deleteAudio 是您的刪除音頻文件的函數
  showDeleteConfirmation.value = false;
};
const showEditModal = () => {
  temporaryProjectName.value = projectDetails.value.project_name;
  showModal.value = true;
};


// 限制錄音時間
const MAX_RECORDING_TIME = 5; // 最大錄音時間（秒）
const checkRecordingTime = () => {
  if (recordingTime.value >= MAX_RECORDING_TIME) {
    isPauseButtonDisabled.value = true;
    pauseRecording(); // 暫停錄音
    showRecordingLimitModal.value = true;
  }
};

const handleModalConfirm = () => {
  showRecordingLimitModal.value = false; // 隱藏模態框
  stopRecording(); // 停止錄音並進行其他處理
};

const startRecording = async () => {
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    let mimeType = 'audio/webm';
    if (MediaRecorder.isTypeSupported('audio/mp4')) {
      mimeType = 'audio/mp4';
    } else if (MediaRecorder.isTypeSupported('audio/webm')) {
      mimeType = 'audio/webm';
    } else if (MediaRecorder.isTypeSupported('audio/wav')) {
      mimeType = 'audio/wav';
    } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
      mimeType = 'audio/ogg';
    } else {
      console.error("no suitable mimetype found for this device");
    }


    if (!window.MediaRecorder) {
      message.error("此瀏覽器不支持 MediaRecorder");
    }

    mediaRecorder = new MediaRecorder(stream, { mimeType: mimeType });
    mediaRecorder.ondataavailable = event => {
      // console.log(Data available: size ${event.data.size});
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };
    mediaRecorder.onstart = () => {         // 錄音開始時，設置錄音狀態和計時器
      console.log('錄音開始');
      isRecording.value = true;
      isPaused.value = false
      intervalId = setInterval(() => {
        recordingTime.value++;
        checkRecordingTime();
      }, 1000);
    };
    mediaRecorder.onstop = handleRecordingStop;
    mediaRecorder.start(1000);
    showMicrophoneAnimation.value = true;
  })
    .catch((error) => {
      message.error("無法訪問麥克風", error);
      message.error("無法訪問麥克風，請檢查權限設置");
    })

};

const sceneTitle = computed(() => {
  switch (scene) {
    case 'FirstVisit':
      return '初診';
    case 'Nursing':
      return '護理紀錄';
    case 'ChildHeartUS':
      return '兒科心臟超音波檢驗檢查報告';
    case 'ThyroidUS':
      return '甲狀腺超音波檢驗檢查報告';
    case 'Meeting':
      return '會議記錄';
    case 'Inpatient':
      return 'Week Summary';
    default:
      return '未知場景';
  }
});

const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.onstop = async () => {
      if (audioChunks.length > 0) {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        console.log(`錄音大小: ${audioBlob.size}`); // 檢查大小
        // const audioUrl = URL.createObjectURL(audioBlob);
        audioUrl.value = URL.createObjectURL(audioBlob);
        const file = new File([audioBlob], "upload.wav", {
          type: audioBlob.type,
          lastModified: new Date().getTime(),
        });
        const sttResponse = await executeStt(projectId, scene, file);
        console.log('STT Response:', sttResponse.data);
        console.log(scene, file)
        // 獲取語音辨識結果
        editableLlmText.value = '結果生成中 ...';
        editableSttText.value = sttResponse.data;
        isInference.value = true; // 更新狀態以顯示成功的模板
        message.success('檔案上傳成功')

        fetchProjectDetails();
      } else {
        console.error('沒有錄音數據');
        message.error('檔案上傳失敗')
      }

      // 重置錄音相關的變量
      audioChunks = [];
      recordingTime.value = 0;
      isRecording.value = false;
      showMicrophoneAnimation.value = false;

      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    };

    mediaRecorder.stop();

  }

  if (typeof intervalId === 'number') {
    clearInterval(intervalId);
    intervalId = undefined;
  }

};

const pauseRecording = () => {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.pause();
    isPaused.value = true;
    clearInterval(intervalId);
  }
};

const resumeRecording = () => {
  if (mediaRecorder && mediaRecorder.state === 'paused') {
    mediaRecorder.resume();
    isPaused.value = false;
    intervalId = setInterval(() => {
      recordingTime.value++;
      checkRecordingTime();
    }, 1000);
  }
};

//切換錄音動畫效果，及暫停與繼續錄音
const toggleRecording = () => {
  if (isRecording.value) {
    if (isPaused.value) {
      resumeRecording();
    } else {
      pauseRecording();
    }
  } else {
    startRecording();
  }
};

// 上傳檔案的邏輯
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files ? target.files[0] : null;
  if (!file) {
    message.error('未選擇任何檔案');
    return;
  }
  uploadedFile.value = file;
  const loadingMessage = message.loading('文件上傳中，請稍後...', { duration: 0 });
  try {
    // 上傳文件並調用 STT API
    const sttResponse = await executeStt(projectId, scene, file);
    console.log('STT Response:', sttResponse.data);
    // 獲取語音辨識結果
    editableSttText.value = sttResponse.data;
    isInference.value = true;

    loadingMessage.destroy();
    message.success('文件上傳和處理成功');
    setTimeout(() => {
      fetchProjectDetails();
    }, 2000);

    fetchProjectDetails();
  } catch (error) {
    console.error('錯誤處理文件:', error);
    loadingMessage.destroy();
    message.error('文件上傳或處理失敗');
  }
};

const handleRecordingStop = () => {
  console.log('錄音結束，狀態:', mediaRecorder ? mediaRecorder.state : '無MediaRecorder');
  if (audioChunks.length > 0) {
    const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
    audioUrl.value = URL.createObjectURL(audioBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = audioUrl.value;
    downloadLink.setAttribute('download', 'recording.mp3');
    downloadLink.click();
    isInference.value = true;
  } else {
    console.error('沒有錄音數據');
  }
  // 重置錄音相關的變量
  audioChunks = [];
  recordingTime.value = 0;
  isRecording.value = false;
  showMicrophoneAnimation.value = false;

  if (mediaRecorder) {
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
  }
};

const formattedRecordingTime = computed(() => {
  const hours = Math.floor(recordingTime.value / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((recordingTime.value % 3600) / 60).toString().padStart(2, '0');
  const seconds = (recordingTime.value % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
})

//返回上一頁
const goBack = () => {
  if (mediaRecorder && (mediaRecorder.state === 'recording' || mediaRecorder.state === 'paused')) {
    mediaRecorder.stop();
    mediaRecorder.onstop = () => {
      // 這裡只需要停止錄音，不處理錄音檔案
      audioChunks = [];
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    };
  }
  router.go(-1); // 執行返回操作
};

const reExecuteStt = async () => {
  if (!audioUrl.value) {
    message.error('沒有音頻文件可用於重新辨識');
    return;
  }
  isReExecuteSttButtonDisabled.value = true;
  try {
    let result = await fetch(audioUrl.value);
    let blob = await result.blob();
    const file = new File([blob], "upload.wav", {
      type: blob.type,
      lastModified: new Date().getTime(),
    });
    const response = await executeStt(projectId, scene, file);
    editableSttText.value = response.data.data;
    editableSttText.value = '結果生成中...';
  } catch (error) {
    console.error('重新辨識時出錯:', error);
    message.error('重新辨識失敗');
  }
  isReExecuteSttButtonDisabled.value = false;
};

const reExecutellm = async () => {
  isButtonDisabled.value = true;
  await handlerLLM();
  isButtonDisabled.value = false;
};

//同時處理傳值跟動畫展現
const handleRecordingToggle = () => {
  toggleRecording();
}

const handleSttInput = () => {
  // 處理語音辨識文本輸入
  isSttTextChanged.value = true;
};


const handlerLLM = async () => {
  const llmResponse = await executeLlm(projectId, scene);
  console.log('LLM Response:', llmResponse.data);
  editableLlmText.value = '結果生成中 ...';

};

// 下載橫向 PDF 報告的方法
const downloadReport = () => {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });


  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 10;
  const maxWidth = pageWidth - margin * 2; // 計算最大寬度
  const lineHeight = 10; // 行高

  // 將文字分割成多行
  const lines = pdf.splitTextToSize(editableLlmText.value, maxWidth);
  let yPosition = 10; // 初始 y 位置

  // 迴圈遍歷每一個文字
  for (let i = 0; i < lines.length; i++) {
    if (yPosition > pdf.internal.pageSize.getHeight() - margin) {
      pdf.addPage(); // 添加新页面
      yPosition = margin; // 重置 y 位置
    }
    pdf.text(lines[i], margin, yPosition); // 添加文本到 PDF
    yPosition += lineHeight; // 增加 y 位置
  }

  pdf.save("report.pdf");
};


// 下載音檔的方法
const downloadAudio = async () => {
  if (audioUrl.value) {
    try {
      const response = await axios.get(audioUrl.value, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'recording.wav');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('下载音檔時發生錯誤:', error);
      message.error('下载失败');
    }
  } else {
    message.error('沒有文件可下载');
  }
};



/****************************************************************
  Websocket相關function
*****************************************************************/

let client = ref<mqtt.MqttClient>()
const userName = ref("")
const CreateChannel = async () => {
  try {
    const result = await createWebSocket();

    if (result.status === 200) {
      console.log(result.data);
      const message = result.data.data.message;
      userName.value = message.split(" ")[1];
      ConnectChannel(); // 確保 ConnectChannel 函式在這個範圍內
    } else {
      console.log("Create ERROR");
    }
  } catch (error) {
    console.error("Error creating WebSocket channel:", error);
  }

  fetchProjectDetails(); // 根據需要調整這一步
}

const ConnectChannel = async () => {
  client.value = mqtt.connect(import.meta.env.VITE_WEBSOCKET_HOST, {
    username: "ghi:ghi",
    password: "ghi",
    clientId: userName.value,
    keepalive: 10,
  });
  client.value!.on("connect", () => {
    client.value!.subscribe(`${userName.value}.llm`, { qos: 1 });
    client.value!.subscribe(`${userName.value}.stt`, { qos: 1 });
    console.log("Connect success")
  });


  client.value!.on("error", (event) => {
    console.log(event)
  });

  client.value!.on("message", (topic, _) => {
    if (topic.indexOf("stt") > -1) {
      console.log("STT 完成")
      handlerLLM()
      console.log("開始文字辨識")
    }
    fetchProjectDetails()
  });
}

CreateChannel()

const isSmallScreen = ref(window.innerWidth < 768);


onMounted(async () => {
  window.addEventListener('resize', () => {
    isSmallScreen.value = window.innerWidth < 768;
  });
  try {
    fetchAndProcessProjects();
    fetchProjectDetails();


  } catch (error) {
    console.error("屬據處理有問題:", error);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', () => {
    isSmallScreen.value = window.innerWidth < 768;
  });
});

onBeforeUnmount(async () => {
  clearInterval(intervalId as number);
  try {
    client.value!.end();

    const result = await deleteWebSocket();
    if (result.status == 200) {
      console.log("Delete SUCCESS");
    }
  } catch (error) {
    console.error("Error deleting WebSocket channel:", error);
  }
});
</script>

<style scoped>
.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.card .card__img,
.card .card__img--hover {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.card {
  margin-bottom: 25px;
  margin: 0 25px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0, 1);
  background-color: #fff;
  width: 400px;
  height: 300px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 5px 15px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.card:hover {
  box-shadow: 0px 30px 18px -8px rgba(0, 0, 0, 0.1);
  transform: scale(1.1, 1.1);
  color: #fff !important;
}

.card__info {
  z-index: 2;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  padding: 8px 24px 0px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--text);
}

.card:hover .card__info {
  color: #FFFFFF;
  /* 白色 */
}

.card:hover {
  background-color: var(--primary);
}

@media (max-width: 1280px) {
  .cards {
    /* flex-direction: column; */
    align-items: center;

  }

  .card {
    /* margin: 0 15px; */
    margin-bottom: 20px;
    width: calc(100% - 16px);
    align-items: top;
    height: 200px;
    /* padding: 0; */
  }
}

.iconSize {
  font-size: 5rem;
}

.recordBtn {
  width: 100%;
  min-width: 240px;
  height: 40px;
  margin: 4px;
  border-radius: 4px;
  font-weight: 600;
  border: 1px solid var(--primary);
}


@media (max-width: 480px) {
  .recordBtn {
    width: 100%;
  }
}

.input-style {
  resize: none;
  width: 100%;
  height: 170px;
  background-color: var(--background-disabled);
  border-radius: 8px;
}

@media (max-width: 640px) {
  .input-style {
    width: 100%;
    height: 100%;
    min-height: 420px;
  }

  .s-input-style {
    height: 100%;
    min-height: 480px;
  }

  .iconSize {
    font-size: 3.5rem;
  }
}

.button-style:disabled {
  color: #ccc;
  /* 深灰色文字 */
  background-color: var(--background-disabled);
  border: 1px solid var(--border);
}

.audioButton {
  position: absolute;
  top: 65%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.reportPannel {
  height: 100%;
  /* min-height: 70vh; */
  overflow: hidden;
}

.flex-container {
  display: flex;
  padding: 0 8px;
}

.flex-grow {
  flex-grow: 1;
  /* 其他样式 */
}

.flex-shrink-0 {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  /* 替代 space-x-2 */
  padding: 8px 4px;
}

@media (max-width: 375px) {
  .flex-container {
    flex-wrap: wrap;
  }

  .flex-shrink-0 {
    justify-content: center;
    padding-bottom: 20px;
  }
}

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
</style>