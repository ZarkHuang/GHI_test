<template>
  <div class="flex flex-col items-center">
    <!-- Hedader -->
    <div class="py-2.5 flex items-center justify-between md:w-8/12 w-11/12 border-b-[1px] ">
      <button @click="goBack" class="headerControlButton ">
        <arrowLeft alt="" class="iconStyle" />
      </button>
      <div class="text-center flex-grow md:w-8/12 w-11/12">
        <h4 class="m-auto px-2 font-bold truncate w-[calc(100%-2px)] text-base md:text-base ">
          {{ sceneTitle }}
        </h4>
      </div>
      <div class="relative inline-block text-center">
        <button @click="startSearch" class="headerControlButton">
          <search alt="" class="iconStyle" />
        </button>
        <!-- 搜索框 -->
        <div v-if="isSearching" class="absolute  right-0 top-full mt-2 transition-all" id="isSearching"
          :class="{ 'm-2': !isMobile, 'right-1': isMobile }">
          <div class="modal-shadow flex items-center  bg-primary-hover2 p-4 rounded-lg border">
            <input v-model="searchText" type="text" placeholder="專案名稱/情境類型/狀態"
              class="custom-placeholder  w-72  flex-grow border  text-sm font-montserrat p-3 rounded-md focus:border-primary-hover focus:outline-none focus:ring focus:ring-blue-100 transition-all duration-300"
              :class="{ 'w-40': isMobile, 'mx-2': isMobile }" style="height:40px ;" />
            <div class="flex items-center justify-between">
              <button @click="performSearch" class="confirm-button flex items-center text-center justify-center"
                :class="{ 'p-1.5': isMobile, 'py-1.5': !isMobile ,'px-4': !isMobile }">搜尋</button>
            </div>
          </div>
        </div>
        <div v-if="isSearching" class="overlay"></div>
      </div>
    </div>
    <!-- 新增刪除 Button -->
    <div class="flex md:w-8/12 w-11/12 justify-between pt-8">
      <div class="flex gap-2">
        <button
          class="project-button flex items-center justify-center border text-sm sm:text-base font-montserrat py-1 sm:py-4 px-4 sm:px-6 mx-1 sm:mx-2 rounded-md hover:bg-white transition duration-300 ease-in-out disabled:opacity-30"
          @click="createProject" :disabled="selectedRows.length > 0 || !isAvailableCreateProject">
          <AddIcon class="h-2.5 w-2.5 sm:h-4 sm:w-2 mr-1 sm:mr-3" />
          新增
        </button>
        <button
          class="project-button flex items-center justify-center borde text-base sm:text-base font-montserrat py-2 sm:py-4 px-4 sm:px-6 mx-1 sm:mx-2  rounded-md hover:bg-white transition duration-300 ease-in-out disabled:opacity-30"
          @click="deleteSelectedProjects" :disabled="selectedRows.length === 0 || !isAvailableDeleteProject">
          <trashCart class="h-2.5 w-2.5 sm:h-4 sm:w- mr-1 sm:mr-3" />
          刪除
        </button>
      </div>
      <!-- 進階搜尋 -->
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
                class="custom-placeholder px-2 mt-1  w-full border   text-base font-montserrat  outline-primary-hover  rounded-md focus:border-primary transition-all duration-300" />
            </div>

            <!-- <div class="flex items-center mb-3">
              <label :class="isMobile ? 'w-1/3' : 'w-1/6'" class="text-sm mr-3">狀態</label>
              <select v-model="selectedOption" :class="['custom-select w-full border  text-base font-montserrat  outline-primary-hover rounded-md transition-all duration-300',
                isOptionSelected ? 'text-text-color' : 'text-text-disabled']">
                <option disabled value="" selected hidden class="disabled-style">請選擇狀態</option>
                <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div> -->

            <div class="relative flex items-center mb-3">
              <div :class="isMobile ? 'w-1/3' : 'w-1/6'" class="text-sm mr-3">
                <span>狀態</span>
              </div>
              <div class="select animated" @click="toggleStatusDropdown"
                :class="{ 'text-text-color': isOptionSelected, 'text-text-disabled': !isOptionSelected }">

                <input type="radio" name="option" v-model="selectedOption" value="speedometer">
                <arrowDown alt="" class="toggle icon icon-arrow-down" />
                <span class="placeholder"
                  :class="{ 'text-black': selectedOption && selectedOption !== 'speedometer', 'text-text-disabled': !selectedOption || selectedOption === 'speedometer' }">
                  {{ selectedLabel }}
                </span>
                <div class="options-container mt-1" v-show="isDropdownOpen">
                  <label class="option" v-for="option in statusOptions" :key="option.value">
                    <input type="radio" name="option" v-model="selectedOption" :value="option.value"
                      @change="isDropdownOpen = false">
                    <span class="title animated">{{ option.label }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- <div class="flex items-center mb-3 ">
              <label :class="isMobile ? 'w-1/3' : 'w-1/6'" class="text-sm mr-3">群組</label>
              <n-select
                class="w-full border  text-base font-montserrat  rounded-md  hover:text-white transition-all duration-300"
                placeholder="請選擇群組" />
            </div> -->

            <div class="relative flex items-center mb-3">
              <div :class="isMobile ? 'w-1/3' : 'w-1/6'" class="text-sm mr-3">
                <span>上傳人員</span>
              </div>
              <div class="select animated" @click="toggleOwnerDropdown"
                :class="{ 'text-text-color': isOwnerSelected, 'text-text-disabled': !isOwnerSelected }">
                <input type="radio" name="owner" v-model="selectedOwner" value="">
                <arrowDown alt="" class="toggle icon icon-arrow-down" :class=" {'icon-black': isOwnerDropdownOpen}" />
                <span class="placeholder" :class="{ 'text-black': selectedOwner, 'text-text-disabled': !selectedOwner }">
                  {{ selectedOwnerLabel }}
                </span>
                <div class="options-container mt-1" v-show="isOwnerDropdownOpen">
                  <label class="option" v-for="option in ownerOptions" :key="option.value">
                    <input type="radio" name="owner" v-model="selectedOwner" :value="option.value"
                      @change="isOwnerDropdownOpen = false">
                    <span class="title animated">{{ option.label }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- <div class="flex items-center mb-3">
              <label :class="isMobile ? 'w-1/3' : 'w-1/6'" class="text-sm mr-3">上傳人員</label>
              <select v-model="selectedOwner" :class="['custom-select w-full border  text-base font-montserrat outline-primary-hover rounded-md transition-all duration-300',
                isOwnerSelected ? 'text-text-color' : 'text-text-disabled']">
                <option disabled value="" hidden class="disabled-style">請選擇人員</option>
                <option v-for="option in ownerOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div> -->

            <div class="flex items-center mb-3">
              <label :class="isMobile ? 'w-1/3' : 'w-1/6'" class="text-sm mr-3">建立時間</label>
              <n-date-picker v-model:value="generateTimeRange" type="daterange" clearable
                class="customDateInput w-full  text-base font-montserrat rounded-md outline-primary-hover transition-all duration-300" />
            </div>


            <div class="flex items-center mb-3">
              <label :class="isMobile ? 'w-1/3' : 'w-1/6'" class="text-sm mr-3">變更時間</label>
              <n-date-picker v-model:value="updateTimeRange" type="daterange" clearable
                class="customDateInput w-full text-base font-montserrat rounded-md outline-primary-hover transition-all duration-300" />
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

    <!-- 資料表 / 表格 -->
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
import { usePermissionStore } from '@/store/permiossion'
// icon
import AddIcon from '@/assets/icons/add.svg'
import Filter from '@/assets/icons/filter.svg'
import filterWhite from '@/assets/icons/filterWhite.svg'
import trashCart from '@/assets/icons/trashCart.svg'
import search from '@/assets/icons/search.svg'
import close from '@/assets/icons/close.svg'
import arrowLeft from '@/assets/icons/arrowLeft.svg'
import arrowDown from '@/assets/icons/arrowDown.svg'


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
const isDropdownOpen = ref(false);
const permiossionStore = usePermissionStore();
const pagination = ref({});
const projects = ref<Project[]>([]);
const message = useMessage();
const route = useRoute();
const router = useRouter();
const sceneType = ref(route.query.sceneType as string || 'defaultSceneType');
const searchText = ref('')
const isSearching = ref(false)
const selectedRows = ref<number[]>([])
const selectedOwner = ref('');
const handleSelectionChange = (keys: any) => {
  selectedRows.value = keys
}
const isOwnerSelected = computed(() => {
  return selectedOwner.value !== '';
});
const isSmallScreen = ref(window.innerWidth < 768); //螢幕分界

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
    // 權限設置
*****************************************************************/


const isAvailableCreateProject = computed(() => permiossionStore.permissionList.includes("7121062016688726011")); //新增確認
const isAvailableDeleteProject = computed(() => permiossionStore.permissionList.includes("7121062306393497595")); //刪除確認


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
    const newProjectId = response.data.data.id;
    router.push(`/task/${currentScene}/${newProjectId}`);
    await fetchAndProcessProjects();
  } catch (error) {
    console.error("Error creating project:", error);
  }
};


//刪除選擇的專案
const deleteSelectedProjects = async () => {
  if (selectedRows.value.length === 0) {
    message.warning('請至少選擇一個項目進行刪除');
    return;
  }
  try {
    for (const projectId of selectedRows.value) {
      await deleteProjectById(projectId);
    }
    message.success('選中項目已成功刪除');
    await fetchAndProcessProjects();
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
// 重新計算日期時間
const formatISODate = (date: string, isEndDate = false) => {
  const d = new Date(date);
  if (isEndDate) {
    d.setDate(d.getDate() + 1);// 如果是結束日期，將日期加1以包含選擇的整天
  }
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const formatProjectData = (project: any) => {
  return {
    ...project,
    generate_time: new Date(project.generate_time).toLocaleDateString(),
    update_time: new Date(project.update_time).toLocaleDateString()
  };
};
const temporaryOption = ref('');
const onNegativeClick = () => {
  temporaryOption.value = '';
  selectedOption.value = '';
  selectedOwner.value = '';
  projectSearchText.value='';
  message.info('已取消');
  showModalRef.value = false;
};

/****************************************************************
  其他
*****************************************************************/
const goBack = () => {
  router.push("/scene")
  fetchAndProcessProjects(); // 確保返回時刷新列表
};

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
  projectSearchText.value = '';
  searchText.value = ''; //重置搜索條件，如果它與篩選相關聯
  message.success('已取消篩選')
  await fetchAndProcessProjects();
}

const windowWidth = ref(window.innerWidth);
const isMobile = computed(() => windowWidth.value <= 640);
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
    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
    }, 0);
  }
};

const cancelSearch = () => {
  isSearching.value = false;
  document.removeEventListener('click', handleOutsideClick);
};

const handleOutsideClick = (event: any) => {
  if (!event.target.closest('#isSearching')) {
    cancelSearch();
  }
};

//搜尋框搜尋確認
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


// Select功能樣式
const selectedLabel = computed(() => {
  if (selectedOption.value && selectedOption.value !== 'speedometer') {
    const selected = statusOptions.find(option => option.value === selectedOption.value);
    return selected ? selected.label : '請選擇狀態';
  }
  return '請選擇狀態';
});

const closeDropdown = (event: any) => {
  const selectElement = document.querySelector('.select');
  if (selectElement && !selectElement.contains(event.target)) {
    isDropdownOpen.value = false;
    temporaryOption.value = '';
    selectedOption.value = '';
  }
};

const isOwnerDropdownOpen = ref(false);
const selectedOwnerLabel = computed(() => {
  if (selectedOwner.value && selectedOwner.value !== '') {
    const selected = ownerOptions.value.find(option => option.value === selectedOwner.value);
    return selected ? selected.label : '請選擇人員';
  }
  return '請選擇人員';
});

const handleCloseDropdownOnOutsideClick = (event: any) => {
  if (!event.target.closest('.select')) {
    isOwnerDropdownOpen.value = false;
    temporaryOption.value = '';
    selectedOption.value = '';
    selectedOwner.value = '';
  }
};

const toggleStatusDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
  if (isOwnerDropdownOpen.value) {
    isOwnerDropdownOpen.value = false;
  }
};

const toggleOwnerDropdown = () => {
  isOwnerDropdownOpen.value = !isOwnerDropdownOpen.value;
  if (isDropdownOpen.value) {
    isDropdownOpen.value = false;
  }
};

// -----------


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

watch(searchText, async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    await performSearch();
  }
});
//點任一處仍無法直接關閉

onMounted(async () => {
  window.addEventListener('resize', () => {
    isSmallScreen.value = window.innerWidth < 768;
  });

  try {
    await fetchAndProcessProjects()
  } catch (error) {
    console.error("data have somethin Wrong!", error)
  }

  window.addEventListener('click', handleCloseDropdownOnOutsideClick);
  document.addEventListener('click', closeDropdown);
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
  document.removeEventListener('click', closeDropdown);
  window.removeEventListener('click', handleCloseDropdownOnOutsideClick);
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
/*************************************  
  Search Tool Style 放大鏡搜尋框樣式 
**************************************/
#isSearching {
  z-index: 99;
  animation: slideDown 0.3s ease forwards;
}

@keyframes slideDown {
  0% {
    opacity: 0;
    transform: translate(0);
  }

  100% {
    opacity: 1;
    transform: translate(0);
  }
}

/**************  
  button Style
***************/

#isSearching button {
  width: 100%;
  text-wrap: nowrap;
  white-space: nowrap;
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

@media (max-width: 576px) {
  #isSearching {
    position: fixed;
    top: 108px;
    left: 50%;
    transform: translateX(-50%);
    width: 95%;
    max-width: 400px;
  }

  button.project-button {
    max-height: 31px;
    padding: 16px;
  }

  #isSearching button {
    width: 100%;
    min-width: 60px;
    text-wrap: nowrap;
    white-space: nowrap
  }

  #isSearching input {
    width: 100%;
  }

  #isSearching button {
    width: 100%;
    text-wrap: nowrap;
  }

  @keyframes slideDown {
    0% {
      opacity: 0;
      transform: translate(-50%, -20px);
    }

    100% {
      opacity: 1;
      transform: translate(-50%, -20px);
    }
  }
}

/************  
  input Style 
*************/
.custom-placeholder {
  height: 36px;
  border-radius: 4px;
}

.custom-placeholder:hover {
  -webkit-box-shadow: 0 0 5px var(--primary-hover);
  -moz-box-shadow: 0 0 5px var(--primary-hover);
  box-shadow: 0 0 5px var(--primary-hover);
  border: 1px solid var(--primary-hover);
}

.custom-placeholder::placeholder {
  color: var(--text-disabled);
  font-weight: 400;
  letter-spacing: 1px;
  padding: 2px;
  font-size: 16px;
}

.custom-placeholder:active {
  border: 1px solid var(--primary) !important;
}

.customDateInput {
  height: 34px;
  border-radius: 4px;
}

.customDateInput:hover {
  -webkit-box-shadow: 0 0 5px var(--primary-hover);
  -moz-box-shadow: 0 0 5px var(--primary-hover);
  box-shadow: 0 0 5px var(--primary-hover);
  /* border: 1px solid var(--primary-hover); */
}


/*******************
  overlay Style 遮照 
*******************/
.overlay {
  display: none;
  position: fixed;
  top: 96px;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, .4);
  z-index: 5;
}

@media (max-width: 576px) {
  .overlay {
    display: block;
    animation: fadeIn 0.5s ease forwards;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }
}

/*****************************  
  進階搜尋: 狀態/上傳人員input
******************************/
.select {
  position: relative;
  display: block;
  margin: auto;
  width: 100%;
  height: 100%;
  border-bottom: 0px;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 3px 0;
  font-size: 16px;
  transition: .1s ease-in-out;
}


.select .options-container {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-top: none;
  box-shadow: 0 0px 10px 10px rgb(0 0 0 / 0.05), 0 0px 10px -4px rgb(0 0 0 / 0.1);
}

.select:hover {
  -webkit-box-shadow: 0 0 5px var(--primary-hover);
  -moz-box-shadow: 0 0 5px var(--primary-hover);
  box-shadow: 0 0 5px var(--primary-hover);
  border: 1px solid var(--primary-hover);
}


.select>.toggle {
  position: absolute;
  z-index: 4;
  top: 12px;
  right: 12px;
  /* color: #ccc; */
}

.select .title,
.select .placeholder {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  padding: 6px 0;
  background: inherit;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.select>input {
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: block;
  opacity: 0;
  cursor: pointer;
}

.select>input:checked~i.toggle.icon-arrow-down {
  display: none;
}

.select>input:checked~i.toggle.icon-arrow-up {
  display: block;
}

.select>input:checked div.options label.option .title {
  display: none !important;
}

.select>input:not(:checked) {
  z-index: 4;
}

.select>input:not(:checked)~label.option>span.title {
  display: none;
}

.select>input:not(:checked)~i.toggle.icon-arrow-up {
  display: none;
}

.select>input:not(:checked)~i.toggle.icon-arrow-down {
  display: block;
}

.select>input:disabled {
  cursor: no-drop;
}

.select>span.placeholder {
  position: relative;
  z-index: 0;
  display: inline-block;
  width: 100%;  
  border-top: 0px;
  padding: 2px 12px;
}

.select .placeholder.text-black {
  color: var(--text);
}

.select label.option {
  display: block;
  overflow: hidden;
  z-index: 999;
  width: 100%;
  transition: all .3s ease-out;
}

.select label.option span.title {
  position: relative;
  z-index: 2;
  transition: var(--text-disabled) 0.3s ease-out;
  padding-left: 12px;
}

.select label.option span.title i.icon {
  padding-right: 8px;
  color: #92a8d1;
}

.select label.option span.title:hover {
  color: var(--text-white);
  box-shadow: inset 0px 1px 0px rgba(0, 0, 0, 0.1);
  background-color: var(--primary);
  transition: .3s ease-in-out;
}

.select label.option input {
  display: none;
}

.select label.option input:checked~span.title {
  position: absolute;
  display: block;
  z-index: 3;
  top: 0px;
  background: #fff;
  border-top: 0px;
  box-shadow: none;
  color: inherit;
  width: 100%;
}

.icon-black {
  color: black;
}

.select.text-text-disabled .option .title {
  color: var(--text);
}
</style>