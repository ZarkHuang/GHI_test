<template>
  <div class="flex flex-col items-center">
    <div class="py-2.5 flex items-center justify-between md:w-8/12 w-11/12 border-b-[1px] ">
      <button @click="goBack" class="hoverButton acitvebutton">
        <arrowLeft alt="" class="iconStyle" />
      </button>

      <div class="text-center flex-grow md:w-8/12 w-11/12">
        <h4 class="m-auto px-2 font-bold truncate w-[calc(100%-2px)] text-base md:text-base ">
          {{ sceneTitle }}
        </h4>
      </div>


      <!-- 搜索框 -->
      <div class="relative inline-block text-center">
        <button @click="startSearch" class="hoverButton acitvebutton">
          <search alt="" class="iconStyle" />
        </button>


        <!-- 搜索框 -->
        <div v-if="isSearching" class="absolute right-0 top-full mt-2" id="isSearching"
          :class="{ 'right-': isMobile, 'm-2': !isMobile }">
          <div class="modal-shadow flex items-center  bg-primary-hover2 p-4 rounded-lg border">
            <input v-model="searchText" type="text" placeholder="專案名稱/情境類型/狀態"
              class="custom-placeholder  mr-3 flex-grow border  text-sm font-montserrat py-2.5 p-3 rounded-md focus:border-primary focus:outline-none focus:ring focus:ring-blue-100 transition-all duration-300"
              style="height:40px" />
            <div class="flex items-center justify-between">
              <button @click="performSearch" class="confirm-button flex items-center"
                :class="{ 'p-1': isMobile, 'p-4': !isMobile }">搜尋</button>
              <button @click="cancelSearch" class="confirm-button flex items-center"
                :class="{ 'p-1': isMobile, 'p-4': !isMobile }">取消</button>
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
            <filterwhite alt="" class="h-4 w-4 mr-3" />
            <span class="text-base mr-3">{{ filterLabel }}</span>
            <close alt="" srcset="" class="h-4 w-4 mr-3" />
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

          <h4 class="font-bold text-xl flex justify-center items-center mb-6">進階搜尋</h4>
          <div class="text-start">
            <div class="flex items-center mb-3">
              <label :class="isMobile ? 'w-1/3' : 'w-1/6'" class="text-sm mr-3">專案名稱</label>
              <input v-model="projectSearchText" type="text" placeholder="請輸入專案名稱"
                class="custom-placeholder w-full border border-primary-hover text-base font-montserrat px-2 rounded-md focus:border-primary focus:outline-none  transition-all duration-300" />
            </div>

            <div class="flex items-center mb-3">
              <label :class="isMobile ? 'w-1/3' : 'w-1/6'" class="text-sm mr-3">狀態</label>
              <n-select
                class="custom-placeholder w-full border border-primary-hover text-base font-montserrat  rounded-md  hover:text-white transition-all duration-300"
                v-model:value="selectedOption" :options="statusOptions" placeholder="請選擇狀態" />
            </div>

            <!-- <div class="flex items-center mb-3 ">
              <label :class="isMobile ? 'w-1/3' : 'w-1/6'" class="text-sm mr-3">群組</label>
              <n-select
                class="w-full border border-primary-hover text-base font-montserrat  rounded-md  hover:text-white transition-all duration-300"
                placeholder="請選擇群組" />
            </div> -->
            <div class="flex items-center mb-3">
              <label :class="isMobile ? 'w-1/3' : 'w-1/6'" class="text-sm mr-3">上傳人員</label>
              <n-select
                class="custom-placeholder w-full border border-primary-hover text-base font-montserrat  rounded-md  transition-all duration-300"
                v-model:value="selectedOwner" :options="ownerOptions" placeholder="請選擇人員" />
            </div>

            <div class="flex items-center">
              <label :class="isMobile ? 'w-1/3' : 'w-1/6'" class="text-sm mr-3">時間區間</label>
              <n-date-picker v-model:value="range" type="daterange" clearable
                class="custom-placeholder w-full border border-primary-hover  text-base font-montserrat  rounded-md focus:border-primary transition-all duration-300" />
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
import filterwhite from '@/assets/icons/filterwhite.svg'
import trashCart from '@/assets/icons/trashCart.svg'
import search from '@/assets/icons/search.svg'
import close from '@/assets/icons/close.svg'
import arrowLeft from '@/assets/icons/arrowLeft.svg'


type RowData = {
  id: string
  key: number
  name: string
  scene: string
  STT_Status: string;
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
const selectedOwner = ref(null);
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

    console.log(response.data)
    projects.value = response.data.map((project: Project) => {
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
      scene: `${currentScene}`
    };

    const response = await postProject(newProjectData);
    console.log("Project created:", response.data);

    const newProjectId = response.data.id;
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

const adjustDate = (dateStr: string) => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 2);
  return date.toISOString().split('T')[0];
};

const projectSearchText = ref('');


//篩選專案
const onPositiveClick = async () => {
  const filterObj = {
    status: selectedOption.value,
    offset: 0,
    rowsPerPage: 100,
    scene_type: sceneType.value,
    start_date: range.value ? adjustDate(new Date(range.value[0]).toISOString().split('T')[0]) : "",
    end_date: range.value ? adjustDate(new Date(range.value[1]).toISOString().split('T')[0]) : "",
    ProjectName: projectSearchText.value,
    Owenr: selectedOption.value,
  };
  console.log('發送到後端的篩選條件:', filterObj);
  try {
    console.log("篩選（filterObj）：", filterObj);
    const response = await getFilterProjectsByUser(filterObj);

    showFilterLabel.value = true;


    projects.value = response.data.map((project: Project) => {
      return {
        ...project,
        generate_time: new Date(project.generate_time).toLocaleDateString(),
        update_time: new Date(project.update_time).toLocaleDateString()
      };
    });

    filterLabel.value = `符合篩選： ${projects.value.length} 筆`;
  } catch (error) {
    console.error('篩選項目時出錯:', error);
    message.error('篩選項目失敗');
  }

  selectedOption.value = null;
  showModalRef.value = false;
};

const temporaryOption = ref('');
const onNegativeClick = () => {
  temporaryOption.value = ''; // 如果用戶取消就清空選擇
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
const selectedOption = ref(null)

const clearFilter = async () => {
  selectedOption.value = null;
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
          const projectData = response.data;
          console.log('STT 狀態:', projectData.STT_Status);
          if (projectData.STT_Status === 'pending') {
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
const startSearch = () => {
  isSearching.value = !isSearching.value;
};

const performSearch = async () => {
  try {
    const response = await getFuzzyProjectsByUser({
      offset: 0,
      FuzzySearch: searchText.value,
      rowsPerPage: 100,
      scene: sceneType.value
    });
    projects.value = response.data.map((project: Project) => {
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

const cancelSearch = () => {
  isSearching.value = false; // Hide the input field and search button
  searchText.value = '';
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
        switch (row.scene) {
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
            return row.scene; // 如果沒有符合的，就返回原始值
        }
      }
    },
    {
      title: '語音辨識狀態',
      align: 'center',
      key: 'STT_Status',
      render(row: RowData) {
        // 根据 row.STT_Status 的值返回相应的中文字符串
        switch (row.STT_Status) {
          case 'init':
            return '草稿';
          case 'finished':
            return '判讀完成';
          case 'pending':
            return '判讀中';
          case 'error':
            return '判斷失敗';
          default:
            return row.STT_Status; // 如果没有匹配，返回原始值
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
}

.custom-placeholder:hover {
  -webkit-box-shadow: 0 0 5px var(--primary-hover);
  -moz-box-shadow: 0 0 5px var(--primary-hover);
  box-shadow: 0 0 5px var(--primary-hover);
  /* border: 1px solid var(--primary-hover); */
}

.custom-placeholder::placeholder {
  color: rgba(194, 194, 194, 1);
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 1px;
  padding: 2px;
}


@media (max-width: 480px) {
  button.project-button {
    max-height: 31px;
    padding: 16px;
  }
}
</style>