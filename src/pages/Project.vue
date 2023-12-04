<template>
  <div class="flex flex-col items-center">
    <div class="py-2.5 flex items-center justify-between md:w-8/12 w-11/12 border-b-[1px] ">
      <button @click="goBack" class="headerControlButton ">
        <arrowLeft alt="" class="iconStyle" />
      </button>

      <div class="text-center flex-grow md:w-8/12 w-11/12">
        <h4 class="m-auto px-2 font-bold truncate w-[calc(100%-2px)] text-base md:text-base ">
          {{ sceneTitle }}
        </h4>
      </div>


      <!-- 搜索框 -->
      <div class="relative inline-block text-center">
        <button @click="startSearch" class="headerControlButton">
          <search alt="" class="iconStyle" />
        </button>


        <!-- 搜索框 -->
        <div v-if="isSearching" class="absolute right-0 top-full mt-2 transition-all" id="isSearching"
          :class="{ 'w-auto': isMobile, 'm-2': !isMobile }">
          <div class="modal-shadow flex items-center  bg-primary-hover2 p-4 rounded-lg border">
            <input v-model="searchText" type="text" placeholder="專案名稱/情境類型/狀態"
              class="custom-placeholder  mr-3  flex-grow border  text-sm font-montserrat py-2.5 p-3 rounded-md focus:border-primary focus:outline-none focus:ring focus:ring-blue-100 transition-all duration-300"
              style="height:40px ;" />
            <div class="flex items-center justify-between">
              <button @click="performSearch" class="confirm-button flex items-center"
                :class="{ 'p-1': isMobile, 'p-4': !isMobile }">搜尋</button>
              <!-- <button @click="cancelSearch" class="confirm-button flex items-center"
                :class="{ 'p-1': isMobile, 'p-4': !isMobile }">取消</button> -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增刪除 -->
    <div class="flex md:w-8/12 w-11/12 justify-between pt-8">
      <div class="flex gap-2">

        <button
          class="project-button flex items-center justify-center border text-sm sm:text-base font-montserrat py-1 sm:py-4 px-4 sm:px-6 mx-1 sm:mx-2 rounded-md hover:bg-white transition duration-300 ease-in-out disabled:opacity-30"
          @click="createProject" :disabled="selectedRows.length > 0">
          <AddIcon class="h-2.5 w-2.5 sm:h-4 sm:w-2 mr-1 sm:mr-3" />
          新增
        </button>

        <button
          class="project-button flex items-center justify-center borde text-base sm:text-base font-montserrat py-2 sm:py-4 px-4 sm:px-6 mx-1 sm:mx-2  rounded-md hover:bg-white transition duration-300 ease-in-out disabled:opacity-30"
          @click="deleteSelectedProjects" :disabled="selectedRows.length === 0">
          <trashCart class="h-2.5 w-2.5 sm:h-4 sm:w- mr-1 sm:mr-3" />
          刪除
        </button>
      </div>

      <div class="flex items-center">
        <div v-if="showFilterLabel" class="hidden md:flex items-center filterLabel px-4 rounded-full text-white">
          <button @click="clearFilter"
            class="text-white flex items-center px-4 py-1 bg-blue-300 hover:bg-blue-400 rounded-full ease-in-out duration-300">
            <filterWhite alt="" class="h-3 w-3 mr-3" />
            <span class="text-base mr-3">{{ filterLabel }}</span>
            <close alt="" srcset="" class="h-3 w-3 mr-3" />
          </button>
        </div>
        <button
          class="hidden project-button md:flex  items-center justify-center border border-primary-hover text-base sm:text-base font-montserrat py-2 sm:py-4 px-4 sm:px-6 mx-1 sm:mx-2  rounded-md hover:bg-white hover:shadow-md hover:shadow-blue-300/20 transition duration-300 ease-in-out disabled:opacity-30"
          @click="showModalRef = true">
          <Filter class="h-2.5 w-2.5 sm:h-4 sm:w- mr-1 sm:mr-3" />
          進階搜尋
        </button>
      </div>

      <n-modal v-model:show="showModalRef" class="modalStyle">
        <n-card class="text-center" style="width: 600px" :bordered="false"
          :style="`width: ${isMobile ? '340px' : '600px'}`" role="dialog" aria-modal="true">
          <button class="absolute top-3 right-3" @click="showModalRef = false">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" class="feather feather-x w-3 h-3 sm:w-3 sm:h-3">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <h4 class="font-bold text-xl flex justify-center items-center mb-6">進階搜尋</h4>
          <div class="text-start">
            <div class="flex items-center mb-3">
              <label :class="isMobile ? 'w-1/3' : 'w-1/6'" class="text-sm mr-3">專案名稱</label>
              <input v-model="projectSearchText" type="text" placeholder="請輸入專案名稱"
                class="custom-placeholder px-2 mt-1  w-full border border-primary-hover  text-base font-montserrat outline-blue-400 rounded-md focus:border-primary transition-all duration-300" />
            </div>

            <div class="flex items-center mb-3">
              <label :class="isMobile ? 'w-1/3' : 'w-1/6'" class="text-sm mr-3">狀態</label>
              <select v-model="selectedOption" :class="['custom-select w-full border border-primary-hover text-base font-montserrat outline-blue-400 rounded-md focus:border-primary transition-all duration-300',
                isOptionSelected ? 'text-text-color' : 'text-text-disabled']">
                <option disabled value="" selected hidden class="disabled-style">請選擇狀態</option>
                <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>

            <!-- <div class="flex items-center mb-3 ">
              <label :class="isMobile ? 'w-1/3' : 'w-1/6'" class="text-sm mr-3">群組</label>
              <n-select
                class="w-full border border-primary-hover text-base font-montserrat  rounded-md  hover:text-white transition-all duration-300"
                placeholder="請選擇群組" />
            </div> -->
            <div class="flex items-center mb-3">
              <label :class="isMobile ? 'w-1/3' : 'w-1/6'" class="text-sm mr-3">上傳人員</label>
              <select v-model="selectedOwner" :class="['custom-select w-full border border-primary-hover text-base font-montserrat outline-blue-400 rounded-md focus:border-primary transition-all duration-300',
                isOwnerSelected ? 'text-text-color' : 'text-text-disabled']">
                <option disabled value="" hidden class="disabled-style">請選擇人員</option>
                <option v-for="option in ownerOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>

            <div class="flex items-center mb-3">
              <label :class="isMobile ? 'w-1/3' : 'w-1/6'" class="text-sm mr-3">建立時間</label>
              <n-date-picker v-model:value="generateTimeRange" type="daterange" clearable
                class="custom-placeholder w-full border border-primary-hover text-base font-montserrat rounded-md focus:border-primary transition-all duration-300" />
            </div>


            <div class="flex items-center mb-3">
              <label :class="isMobile ? 'w-1/3' : 'w-1/6'" class="text-sm mr-3">變更時間</label>
              <n-date-picker v-model:value="updateTimeRange" type="daterange" clearable
                class="custom-placeholder w-full border border-primary-hover text-base font-montserrat rounded-md focus:border-primary transition-all duration-300" />
            </div>
          </div>



          <!-- 取消確認 -->
          <div class="mt-6">
            <button
              class="confirm-button border border-primary-hover text-base font-montserrat py-2 px-2 mx-2  rounded-md transition-all duration-300"
              @click="onNegativeClick">取消</button>
            <button
              class="confirm-button border border-primary-hover text-base font-montserrat py-2 px-2 mx-2  rounded-md transition-all duration-300"
              @click="onPositiveClick">確認</button>
          </div>
        </n-card>
      </n-modal>

    </div>
    <div class="flex justify-center md:w-8/12 w-11/12 mt-5">
      <n-data-table pagination-behavior-on-filter="first" size="medium" :columns="columns" :data="projects" :locale="zhCN"
        :date-locale="dateZhCN" :row-props="rowProps" :pagination="pagination" :rowKey="row => row.id"
        @update:checked-row-keys="handleSelectionChange" class="custom-data-table">

        <template v-slot:projectName="{ row }">
          <div>
            <div>{{ row.project_name }}</div>
            <div v-if="isSmallScreen" class="text-xs text-gray-500">{{ row.generate_time }}</div>
          </div>
        </template>

      </n-data-table>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted, ComputedRef } from 'vue'
import { useMessage, DataTableColumns } from 'naive-ui'
import { getFuzzyProjectsByUser, postProject, deleteProjectById, getFilterProjectsByUser, getProjectById } from "@/apis/projectAPI.ts"
import { useRoute, useRouter } from "vue-router"
import { zhCN, dateZhCN } from 'naive-ui'
// icon
import AddIcon from '@/assets/icons/add.svg'
import Filter from '@/assets/icons/filter.svg'
import filterWhite from '@/assets/icons/filterwhite.svg'
import trashCart from '@/assets/icons/trashCart.svg'
import search from '@/assets/icons/search.svg'
import close from '@/assets/icons/close.svg'
import arrowLeft from '@/assets/icons/arrowLeft.svg'


type RowData = {
  id: string
  key: number
  name: string
  scene_type: string
  stt_status: string;
  sttResult: string
  selected: boolean
  owner: string
  generate_time: string
  update_time: string
}

const range = ref(null)
const pagination = ref({});
const projects = ref<Project[]>([]);
const message = useMessage();
const route = useRoute();
const router = useRouter();
const sceneType = ref(route.query.sceneType as string || 'defaultSceneType');
console.log(sceneType)
const searchText = ref('')
const isSearching = ref(false)
const selectedRows = ref<number[]>([])
const selectedOwner = ref('');
const isOwnerSelected = computed(() => {
  return selectedOwner.value !== '';
});
const isSmallScreen = ref(window.innerWidth < 768); //螢幕分界

// 定義項目類型，解決Project any類型問題
type Project = {
  id: number;
  llm_result: string;
  llm_status: string;
  owner: string;
  generate_time: string;
  project_name: string;
  scene: string;
  STT_Result: string;
  STT_Status: string;
  update_time: string;
};

const sceneTitle = computed(() => {
  switch (sceneType.value) {
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

/****************************************************************
    Get Api
*****************************************************************/

// 獲取項目列表
const fetchAndProcessProjects = async () => {
  const currentScene = sceneType.value.toString();
  try {
    const response = await getFuzzyProjectsByUser({
      "offset": 0,
      "fuzzy_search": "",
      "rowsPerPage": 100,
      "scene_type": `${currentScene}`
    });

    console.log(response.data.data)
    projects.value = response.data.data.map((project: Project) => {
      return {
        ...project,
        generate_time: new Date(project.generate_time).toLocaleDateString(),
        update_time: new Date(project.update_time).toLocaleDateString()
      };
    });
    console.log(projects.value);
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
};
//新增專案
const createProject = async () => {
  try {
    const currentDate = new Date().toISOString().slice(0, 10);
    const currentScene = sceneType.value.toString();
    const newProjectData = {
      project_name: `${currentDate}`,
      scene_type: `${currentScene}`
    };

    const response = await postProject(newProjectData);
    console.log("Project created:", response.data.data);

    const newProjectId = response.data.data.id;

    // 重新獲取項目列表以更新畫面
    router.push(`/task/${currentScene}/${newProjectId}`);
    await fetchAndProcessProjects();
  } catch (error) {
    console.error("Error creating project:", error);
  }
};


const deleteSelectedProjects = async () => {
  if (selectedRows.value.length === 0) {
    message.warning('請至少選擇一個項目進行刪除');
    return;
  }

  try {
    for (const projectId of selectedRows.value) {
      // console.log(`Deleting project with ID: ${projectId}`);
      await deleteProjectById(projectId);
      // console.log(`Deleted project response:`, response);
    }
    message.success('選中項目已成功刪除');
    await fetchAndProcessProjects(); // 重新獲取項目列表以更新 UI
  } catch (error) {
    console.error('刪除項目時出錯:', error);
    message.error('刪除項目失敗');
  }

  selectedRows.value = [];
};
const projectSearchText = ref('');
const generateTimeRange = ref(null);
const updateTimeRange = ref(null);


//篩選專案
const onPositiveClick = async () => {
  const filterObj = {
    status: selectedOption.value,
    offset: 0,
    rowsPerPage: 100,
    scene_type: sceneType.value,
    update_time_start: updateTimeRange.value ? formatISODate(updateTimeRange.value[0]) : "",
    update_time_end: updateTimeRange.value ? formatISODate(updateTimeRange.value[1], true) : "",
    project_name: projectSearchText.value,
    generate_time_start: generateTimeRange.value ? formatISODate(generateTimeRange.value[0]) : "",
    generate_time_end: generateTimeRange.value ? formatISODate(generateTimeRange.value[1], true) : "",
  };

  console.log(filterObj.update_time_start)
  console.log(filterObj.update_time_end)
  try {
    const response = await getFilterProjectsByUser(filterObj);
    showFilterLabel.value = true;
    projects.value = response.data.data.map(formatProjectData);

    filterLabel.value = `符合篩選： ${projects.value.length} 筆`;
  } catch (error) {
    console.error('篩選項目時出錯:', error);
    message.error('篩選項目失敗');
  }

  selectedOption.value = '';
  showModalRef.value = false;
};

const formatISODate = (date: string, isEndDate = false) => {
  const d = new Date(date);
  if (isEndDate) {
    // 如果是結束日期，將日期加1以包含選擇的整天
    d.setDate(d.getDate() + 1);
  }
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};



const formatProjectData = (project) => {
  return {
    ...project,
    generate_time: new Date(project.generate_time).toLocaleDateString(),
    update_time: new Date(project.update_time).toLocaleDateString()
  };
};

const temporaryOption = ref('');
const onNegativeClick = () => {
  temporaryOption.value = ''; // 如果用戶取消就清空選擇
  selectedOption.value = '';
  selectedOwner.value = '';
  message.info('已取消');
  showModalRef.value = false;
};



/****************************************************************
  其他
*****************************************************************/
watch(searchText, async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    await performSearch();
  }
});

const goBack = () => {
  router.push("/scene")
  fetchAndProcessProjects(); // 確保返回時刷新列表
};

const handleSelectionChange = (keys: any) => {
  selectedRows.value = keys
}

const showFilterLabel = ref(false);
const filterLabel = ref('');
const showModalRef = ref(false)
const selectedOption = ref('')
const isOptionSelected = computed(() => {
  return selectedOption.value !== '';
});

const clearFilter = async () => {
  selectedOption.value = '';
  showFilterLabel.value = false;
  filterLabel.value = '';
  searchText.value = ''; // 重置搜索條件，如果它與篩選相關聯
  await fetchAndProcessProjects();
}

const windowWidth = ref(window.innerWidth);
const isMobile = computed(() => windowWidth.value <= 640); // 640px 可以根据需要调整
window.addEventListener('resize', () => {
  windowWidth.value = window.innerWidth;
});


const rowProps = (row: RowData) => {
  return {
    style: { cursor: 'pointer' },
    onClick: async (event: MouseEvent) => {
      // 檢查點擊是否發生在 checkbox 或其父元素上
      const isCheckboxClick = (event.target as HTMLElement).closest('.n-checkbox');
      if (!isCheckboxClick) {
        // 如果不是 checkbox 的點擊，則檢查項目狀態並可能導航
        try {
          const response = await getProjectById(row.id);
          const projectData = response.data.data;
          console.log('STT 狀態:', projectData.stt_status);
          if (projectData.stt_status === 'pending') {
            router.push(`/task/${sceneType.value}/${row.id}`);
          } else {
            router.push(`/task/${sceneType.value}/${row.id}`);
          }
        } catch (error) {
          console.error('獲取項目詳細信息時出錯:', error);
        }
      }
    },
  };
};

// header-Search

// 打開搜尋框並添加監聽器
const startSearch = () => {
  if (!isSearching.value) {
    isSearching.value = true;
    // 延遲添加全局點擊監聽器，避免立即觸發關閉
    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
    }, 0);
  }
};

// 關閉搜尋框並移除監聽器
const cancelSearch = () => {
  isSearching.value = false;
  document.removeEventListener('click', handleOutsideClick);
};

// 處理全局點擊事件
const handleOutsideClick = (event: any) => {
  if (!event.target.closest('#isSearching')) {
    cancelSearch();
  }
};



const performSearch = async () => {
  try {
    const response = await getFuzzyProjectsByUser({
      offset: 0,
      fuzzy_search: searchText.value,
      rowsPerPage: 100,
      scene_type: sceneType.value
    });
    projects.value = response.data.data.map((project: Project) => {
      return {
        ...project,
        generate_time: new Date(project.generate_time).toLocaleDateString(),
        update_time: new Date(project.update_time).toLocaleDateString()
      };
    });

  } catch (error) {
    console.error('搜索時出錯:', error);
    message.error('搜索失敗');
  }
};


//狀態選項
const statusOptions = [
  { label: "判讀完成", value: 'finished' },
  { label: "判讀失敗", value: 'error' },
  { label: "判讀中", value: 'pending' },
  { label: "草稿", value: 'init' }
];

//上傳人員選項
const ownerOptions = computed(() => {
  // 從項目中提取所有唯一的 'owner' 值
  const uniqueOwners = new Set(projects.value.map(p => p.owner)); //這裡的 p 只是一個臨時變量，代表了迭代過程中的當前項目
  return Array.from(uniqueOwners).map(owner => {
    return { label: owner, value: owner };
  });
});


const columns: ComputedRef<DataTableColumns<RowData>> = computed(() => {
  if (windowWidth.value < 768) {
    return [
      {
        type: 'selection',
        width: '48px',
        align: 'center',
        ellipsis: true,
        minWidth: 60,
      },
      {
        title: '專案名稱',
        key: 'project_name',
        ellipsis: true,
        minWidth: 160,
      },
    ]
  }
  return [
    {
      type: 'selection',
      width: '48px',
      align: 'center',
      ellipsis: true,
      minWidth: 60,
    },
    {
      title: '專案名稱',
      key: 'project_name',
      ellipsis: true,
      minWidth: 150,
    },

    {
      title: '情境類型',
      key: 'scene',
      align: 'center',
      ellipsis: true,
      minWidth: 120,
      render(row: RowData) {
        switch (row.scene_type) {
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
            return row.scene_type; // 如果沒有符合的，就返回原始值
        }
      }
    },
    {
      title: '語音辨識狀態',
      align: 'center',
      key: 'STT_Status',
      render(row: RowData) {
        // 根据 row.STT_Status 的值返回相应的中文字符串
        switch (row.stt_status) {
          case 'init':
            return '草稿';
          case 'finished':
            return '判讀完成';
          case 'pending':
            return '判讀中';
          case 'error':
            return '判斷失敗';
          default:
            return row.stt_status; // 如果没有匹配，返回原始值
        }
      },
    },
    {
      title: '上傳人員',
      key: 'owner',
      ellipsis: true,
      minWidth: 120,
      align: 'center',
    },
    {
      title: '建立時間',
      key: 'generate_time',
      align: 'center',
      ellipsis: true,
      minWidth: 120,
    },
    {
      title: '變更時間',
      key: 'update_time',
      align: 'center',
      ellipsis: true,
      minWidth: 120,

    },
  ];
});


onMounted(async () => {
  window.addEventListener('resize', () => {
    isSmallScreen.value = window.innerWidth < 768;
  });

  try {
    await fetchAndProcessProjects()
  } catch (error) {
    console.error("data have somethin Wrong!", error)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
  window.removeEventListener('resize', () => {
    isSmallScreen.value = window.innerWidth < 768;
  });
});

</script>

<style scoped>
body {
  color: var(--text);
}

.n-data-table-thead {
  height: 100%;
}

#isSearching {
  z-index: 99;
}

#isSearching button {
  width: 100%;
  text-wrap: nowrap;
}

button.project-button {
  max-height: 48px;
  margin: 0 auto;
  border-radius: 4px;
  border: 1px solid var(--primary);
  background-color: var(--background-white);
  transition: .3s ease-in-out;
}

button.project-button:hover {
  -webkit-box-shadow: 0 0 5px var(--primary-hover);
  -moz-box-shadow: 0 0 5px var(--primary-hover);
  box-shadow: 0 0 5px var(--primary-hover);

}

button.project-button:active {
  background-color: var(--primary);
  color: white;
}

.confirm-button {
  max-width: 116px;
  margin: 0 .5rem;
}

.custom-placeholder {
  height: 36px;
  border-radius: 4px;
}

.custom-placeholder:hover {
  -webkit-box-shadow: 0 0 5px var(--primary-hover);
  -moz-box-shadow: 0 0 5px var(--primary-hover);
  box-shadow: 0 0 5px var(--primary-hover);
  /* border: 1px solid var(--primary-hover); */
}

.custom-placeholder::placeholder {
  color: var(--text-disabled);
  font-weight: 400;
  letter-spacing: 1px;
  padding: 2px;
  font-size: 16px;
}


@media (max-width: 480px) {
  button.project-button {
    max-height: 31px;
    padding: 16px;
  }
}

.custom-select {
  height: 36px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M104.704 338.752a64 64 0 0 1 90.496 0l316.8 316.8l316.8-316.8a64 64 0 0 1 90.496 90.496L557.248 791.296a64 64 0 0 1-90.496 0L104.704 429.248a64 64 0 0 1 0-90.496z"/></svg>') no-repeat;
  background-position: right 12px center;
  background-size: 1em;
  cursor: pointer;
}


.custom-placeholder:hover {
  -webkit-box-shadow: 0 0 5px var(--primary-hover);
  -moz-box-shadow: 0 0 5px var(--primary-hover);
  box-shadow: 0 0 5px var(--primary-hover);
}

.custom-select {
  width: 100%;
  height: 36px;
  background-color: white;
  border-radius: 4px;
  padding: 0 12px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  font-size: 16px;
  letter-spacing: 1px;
}

.custom-select option {
  color: black;
}

.disabled-style {
  color: var(--text-disabled);
  font-weight: 400;
  letter-spacing: 1px;
  padding: 2px;
}

.custom-select:hover {
  -webkit-box-shadow: 0 0 5px var(--primary-hover);
  -moz-box-shadow: 0 0 5px var(--primary-hover);
  box-shadow: 0 0 5px var(--primary-hover);
}

.custom-select option:hover {
  background-color: #2c8eee;
  color: white;
}
</style>