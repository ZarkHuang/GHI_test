<template>
    <n-modal v-model:show="isPersonalSettingsModalOpen">
        <div class="p-6 text-base overflow-y-auto personalSettings" style="z-index:99" id="pSettings">
            <button class="absolute top-1 right-1 headerControlButton" @click.stop="tryCloseModal">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="feather feather-x w-3 h-3 sm:w-3 sm:h-3">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            <h4 class="text-xl font-bold pb-6 text-center">帳號資訊</h4>
            <!-- SuperAdmin , Admin -->
            <div class="flex flex-col gap-6" v-if="!isEdit || (user.role === 'SuperAdmin' && isEdit)">
                <div class="flex flex-col bg-white">
                    <p class="px-6 py-2 bg-[#2C8EEE] text-white">
                        帳號資訊
                    </p>

                    <div class="flex flex-col gap-5 p-6">

                        <div class="flex items-center gap-2">
                            <p :class="{ 'w-120px': !isMobile, 'w-90px': isMobile }">角色:</p>

                            <p :class="isEdit ? 'text-[#C2C2C2]' : 'text-black'">{{ user.role }}</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <p :class="{ 'w-120px': !isMobile, 'w-90px': isMobile }">權限:</p>
                            <p :class="isEdit ? 'text-[#C2C2C2]' : 'text-black'">{{ show_permission }}</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <p :class="{ 'w-120px': !isMobile, 'w-90px': isMobile }">啟用/停用</p>
                            <p :class="isEdit ? 'text-[#C2C2C2]' : 'text-black'">{{ user.enabled ? '啟用' : '停用' }}</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <p :class="{ 'w-120px': !isMobile, 'w-90px': isMobile }">建立時間</p>
                            <p :class="isEdit ? 'text-[#C2C2C2]' : 'text-black'">{{ user.generate_time }}</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <p :class="{ 'w-120px': !isMobile, 'w-90px': isMobile }">更新時間</p>
                            <p :class="isEdit ? 'text-[#C2C2C2]' : 'text-black'">{{ user.update_time }}</p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col bg-white">
                    <p class="px-6 py-2 bg-[#2C8EEE] text-white">群組資訊</p>
                    <div class="flex flex-col gap-5 p-6">
                        <div class="flex items-center gap-2">
                            <p :class="{ 'w-120px': !isMobile, 'w-90px': isMobile }">群組</p>
                            <p :class="isEdit ? 'text-[#C2C2C2]' : 'text-black'">{{ groupInfo }}</p>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col bg-white">
                    <p class="px-6 py-2 bg-[#2C8EEE] text-white">使用者資訊</p>
                    <div class="flex flex-col gap-5 p-6">
                        <div class="flex items-center gap-2">
                            <p :class="{ 'w-120px': !isMobile, 'w-90px': isMobile }">員工編號</p>
                            <p c:class="isEdit ? 'text-[#C2C2C2]' : 'text-black'">{{ user.id }}</p>
                        </div>

                        <div class="flex items-start gap-2" v-if="user.role === 'Admin'">
                            <label class="flex-row-label">密碼:</label>
                            <div class="flex-row-content">
                                <button @click.stop="handleChangePassword" v-if="!isChangePassword"
                                    class="confirmButton flex gap-1 border border-[#2C8EEE] items-center justify-center px-3 py-2 rounded h-10">
                                    <p>更換密碼</p>
                                </button>
                                <form class="form-container" v-if="isChangePassword">
                                    <div class="input-container">
                                        <input :type="showPassword ? 'text' : 'password'" v-model="firstPwd"
                                            class="input-field" placeholder="請輸入新密碼" autocomplete="new-password">
                                        <button type="button" @click.stop="showPassword = !showPassword"
                                            class="input-button">
                                            <template v-if="showPassword">
                                                <iconEye />
                                            </template>
                                            <template v-else>
                                                <iconEyeClose />
                                            </template>
                                        </button>
                                    </div>
                                    <div class="input-container">
                                        <input :type="showSecondPassword ? 'text' : 'password'" v-model="secondPwd"
                                            class="input-field" placeholder="再次輸入新密碼" autocomplete="new-password">
                                        <button type="button" @click.stop="showSecondPassword = !showSecondPassword"
                                            class="input-button">
                                            <template v-if="showSecondPassword">
                                                <iconEye />
                                            </template>
                                            <template v-else>
                                                <iconEyeClose />
                                            </template>
                                        </button>
                                    </div>

                                    <button @click.stop="handleChangePassword"
                                        class="flex w-32 border border-blue-400 items-center justify-center px-3 py-2 rounded">
                                        <p>確定更換密碼</p>
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <p :class="{ 'w-120px': !isMobile, 'w-90px': isMobile }">姓名</p>
                            <div class="flex-grow">
                                <p v-if="!isEdit">{{ user.name }}</p>
                                <input v-if="isEdit" v-model="user.name" type="text"
                                    class="rounded-sm pl-2 outline-none border h-8 flex-grow">
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <p :class="{ 'w-120px': !isMobile, 'w-90px': isMobile }">服務單位</p>
                            <p class="flex-grow">{{ user.depart }}</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <p :class="{ 'w-120px': !isMobile, 'w-90px': isMobile }">職稱</p>
                            <p class="flex-grow">{{ user.job_title }}</p>
                        </div>
                        <div class="flex-container gap-2">
                            <p class="flex-label">信箱:</p>
                            <div class="flex-content">
                                <p>{{ user.email }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 編輯模式出現頁面 -->
            <div class="flex flex-col gap-6" v-else-if="user.role === 'Admin' && isEdit">
                <div class="flex flex-col bg-white">
                    <p class="px-6 py-2 bg-[#2C8EEE] text-white">
                        帳號資訊
                    </p>
                    <div class="flex flex-col gap-5 p-6">
                        <!-- <div class="flex items-center">
                            <p :class="{ 'w-120px': !isMobile, 'w-90px': isMobile }">角色:</p>
                            <n-select class="w-full" v-model="user.role" :options="roleList" placeholder="請選擇" />
                        </div> -->
                        <div class="relative flex items-center gap-2">
                            <label :class="{ 'w-120px': !isMobile, 'w-90px': isMobile }">角色:</label>
                            <div class="select animated w-full relative" @click="toggleRoleDropdown">
                                <input type="radio" name="role" v-model="tempUser.role" value="">
                                <span class="placeholder"
                                    :class="{ 'text-text-disabled': !tempUser.role, 'text-black': tempUser.role }">
                                    {{ selectedRoleLabel }}
                                </span>
                                <div class="toggle icon icon-arrow-down"
                                    :class="{ 'icon-black': tempUser.role, 'text-text-disabled': !tempUser.role }">
                                    <arrowDown alt="" />
                                </div>
                                <div class="options-container mt-1" v-show="isRoleDropdownOpen">
                                    <label class="option" v-for="option in roleList" :key="option.value">
                                        <input type="radio" name="role" v-model="tempUser.role" :value="option.value"
                                            @change="isRoleDropdownOpen = false">
                                        <span class="title animated">{{ option.label }}</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="flex-row gap-2">
                            <p class="flex-row-label">權限:</p>
                            <div class="content">
                                <n-radio-group v-model:value="user.permission[0]" name="radiogroup" size="large">
                                    <n-space>
                                        <n-radio v-for="selection in permissionList" :key="selection.value"
                                            :value="selection.value">
                                            <p class="text-base">{{ selection.label }}</p>
                                        </n-radio>
                                    </n-space>
                                </n-radio-group>
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <p :class="{ 'w-120px': !isMobile, 'w-90px': isMobile }">啟用/停用</p>
                            <n-switch size="large" v-model:value="user.enabled" />
                        </div>
                        <div class="flex items-center gap-2">
                            <p :class="{ 'w-120px': !isMobile, 'w-90px': isMobile }">建立時間</p>
                            <p class="text-[#C2C2C2]">{{ user.generate_time }}</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <p :class="{ 'w-120px': !isMobile, 'w-90px': isMobile }">更新時間</p>
                            <p class="text-[#C2C2C2]">{{ user.update_time }}</p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col bg-white">
                    <p class="px-6 py-2 bg-[#2C8EEE] text-white">群組資訊</p>
                    <div class="flex flex-col gap-5 p-6">
                        <div class="flex items-center gap-2">
                            <p :class="{ 'w-120px': !isMobile, 'w-90px': isMobile }">群組</p>
                            <p :class="isEdit ? 'text-[#C2C2C2]' : 'text-black'">{{ groupInfo }}</p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col bg-white">
                    <p class="px-6 py-2 bg-[#2C8EEE] text-white">使用者資訊</p>
                    <div class="flex flex-col gap-5 p-6">
                        <div class="flex items-center gap-2">
                            <p :class="{ 'w-120px': !isMobile, 'w-90px': isMobile }">員工編號</p>
                            <p class=" text-[#C2C2C2]">{{ user.id }}</p>
                        </div>
                        <div class="flex items-start gap-2">
                            <label class="flex-row-label">密碼:</label>
                            <div class="flex-row-content">
                                <button @click.stop="handleChangePassword" v-if="!isChangePassword"
                                    class="confirmButton flex gap-1 border border-[#2C8EEE] items-center justify-center px-3 py-2 rounded h-10">
                                    <p>更換密碼</p>
                                </button>
                                <form class="form-container" v-if="isChangePassword">
                                    <div class="input-container">
                                        <input :type="showPassword ? 'text' : 'password'" v-model="firstPwd"
                                            class="input-field" placeholder="請輸入新密碼" autocomplete="new-password">
                                        <button type="button" @click.stop="showPassword = !showPassword"
                                            class="input-button">
                                            <template v-if="showPassword">
                                                <iconEye />
                                            </template>
                                            <template v-else>
                                                <iconEyeClose />
                                            </template>
                                        </button>
                                    </div>
                                    <div class="input-container">
                                        <input :type="showSecondPassword ? 'text' : 'password'" v-model="secondPwd"
                                            class="input-field" placeholder="再次輸入新密碼" autocomplete="new-password">
                                        <button type="button" @click.stop="showSecondPassword = !showSecondPassword"
                                            class="input-button">
                                            <template v-if="showSecondPassword">
                                                <iconEye />
                                            </template>
                                            <template v-else>
                                                <iconEyeClose />
                                            </template>
                                        </button>
                                    </div>

                                    <button @click.stop="handleChangePassword"
                                        class="flex w-32 border border-blue-400 items-center justify-center px-3 py-2 rounded">
                                        <p>確定更換密碼</p>
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div class="flex-row">
                            <label class="flex-row-label">姓名:</label>
                            <input v-model="user.name" type="text"
                                class="flex-row-content rounded-sm pl-2 outline-none border h-8">
                        </div>

                        <div class="flex-row">
                            <label class="flex-row-label">服務單位:</label>
                            <input v-model="user.depart" type="text"
                                class="flex-row-content rounded-sm pl-2 outline-none border h-8">
                        </div>
                        <div class="flex-row">
                            <label class="flex-row-label">職稱:</label>
                            <input v-model="user.job_title" type="text"
                                class="flex-row-content rounded-sm pl-2 outline-none border h-8">
                        </div>
                        <div class="flex-row">
                            <label class="flex-row-label">信箱:</label>
                            <input v-model="user.email" type="text"
                                class="flex-row-content rounded-sm pl-2 outline-none border h-8">
                        </div>

                    </div>
                </div>
            </div>
            <!-- 取消與確認按鍵 -->
            <div class="flex pt-6 justify-center" v-if="user.role !== 'User'">
                <!-- 如果處於編輯模式，顯示“取消”和“儲存”按鈕 -->
                <template v-if="isEdit">
                    <button @click.stop="handleCancel"
                        class="confirmButton flex gap-1 border border-blue-400 items-center justify-center px-3 py-2 rounded mr-2">
                        <p>取消</p>
                    </button>
                    <button @click.stop="handleSave"
                        class="confirmButton flex gap-1 border border-blue-400 items-center justify-center px-3 py-2 rounded">
                        <p>儲存</p>
                    </button>
                    <n-modal v-model:show="isConfirmCancelModalOpen"
                        class="bg-white p-10 rounded-lg card-shadow border border-blue-300">
                        <n-card bordered :style="`width: ${isMobile ? '340px' : '400px'}`">
                            <button class="absolute top-3 right-3" @click.stop="isConfirmCancelModalOpen = false">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                    class="feather feather-x w-3 h-3 sm:w-3 sm:h-3">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                            <h4 class="text-xl font-bold pb-2 text-center">資料尚未儲存，確定要離開嗎？</h4>
                            <n-space justify="center" class="mt-5">
                                <button
                                    class="confirmButton flex gap-1 border border-blue-400 items-center justify-center px-3 py-2 rounded mr-2"
                                    @click.stop="isConfirmCancelModalOpen = false">取消</button>
                                <button
                                    class="confirmButton flex gap-1 border border-blue-400 items-center justify-center px-3 py-2 rounded mr-2"
                                    @click.stop="confirmCancel">確定</button>
                            </n-space>
                        </n-card>
                    </n-modal>
                </template>
                <!-- 如果不是編輯模式，顯示“編輯”按鈕 -->
                <template v-else>
                    <button @click.stop="handleEdit" v-if="hasQueryPermission"
                        class="confirmButton flex  border border-blue-400 items-center justify-center px-3 py-2 rounded">
                        <p>編輯</p>
                    </button>
                </template>
            </div>

        </div>
    </n-modal>
</template>
  
<script setup lang="ts">
import { ref, watch , onMounted , onUnmounted} from "vue";
import { reactive } from "vue";
import { computed } from "vue";
import { useMessage } from 'naive-ui'
// icon
import iconEye from "@/assets/icons/eye.svg"
import iconEyeClose from "@/assets/icons/eyeClose.svg"
import arrowDown from '@/assets/icons/arrowDown.svg'

const isEdit = ref(false)
const isChangePassword = ref(false)
const firstPwd = ref("")
const secondPwd = ref("")
const showPassword = ref(false)
const showSecondPassword = ref(false)
const isPersonalSettingsModalOpen = ref(false);
const windowWidth = ref(window.innerWidth);
const isMobile = computed(() => windowWidth.value <= 640);
const message = useMessage()
interface userProfile {
    role: string,
    permission: string[],
    enabled: boolean,
    generate_time: string,
    update_time: string,
    group_list: string[],
    id: string,
    name: string,
    depart: string,
    job_title: string,
    email: string,
}
// const user: userProfile = reactive({
//   role: "SuperAdmin",
//   permission: "normal",
//   enabled: true,
//   generate_time: "2023-11-22",
//   update_time: "2023-11-22",
//   group_list: ['IT01', 'IT02', 'IT03', 'IT04'],
//   id: "T11011109",
//   name: "詹曜宇",
//   depart: "-",
//   job_title: "-",
//   email: "-"
// })

const user: userProfile = reactive({
    role: "Admin",
    permission:
        ["7121062508219211771",
            "7121062648980054011"],
    enabled: true,
    generate_time: "2023-11-22",
    update_time: "2023-11-22",
    group_list: ['IT01', 'IT02', 'IT03', 'IT04'],
    id: "T11011109",
    name: "詹曜宇",
    depart: "資訊部",
    job_title: "工程師",
    email: "zhan332066@gmail.com"
})


/****************************************************************
   權限設置
*****************************************************************/
// 確認有沒有權限
const hasQueryPermission = computed(() => user.permission.includes("7121062508219211771"));
// 確認能不能修改
const hasEditPermission = computed(() => user.permission.includes("7121062648980054011"));

/******************************************************** */
// 這是用來改變User Role的臨時工具
const tempUser = ref({ ...user }); //臨時拿來儲存用戶選擇變量
const handleSave = () => {
    if (!hasEditPermission.value) {
        message.error('您沒有修改權限');
        return;
    }
    // 在這裡，將臨時存儲的選擇更新到用戶對象
    Object.assign(user, tempUser.value);
    message.success('儲存變更內容');
    isChangePassword.value = false;
    isEdit.value = false;
};
const handleEdit = () => {
    // 啟用編輯模式時，重置臨時變量
    tempUser.value = { ...user };
    isEdit.value = true;
};

const isConfirmCancelModalOpen = ref(false);
const handleCancel = () => {
    isConfirmCancelModalOpen.value = true;
};
const confirmCancel = () => {
    Object.assign(user, originalUserData.value);
    isEdit.value = false;
    isConfirmCancelModalOpen.value = false;
    closeModal();
};

/******************************************************** */

const isRoleDropdownOpen = ref(false);
const originalRole = ref('')
const selectedRoleLabel = computed(() => {
    const selected = roleList.find(option => option.value === tempUser.value.role);
    return selected ? selected.label : '請選擇角色';
});


const closeDropdownOnGlobalClick = () => {
  if (isRoleDropdownOpen.value) {
    isRoleDropdownOpen.value = false;
    tempUser.value.role = originalRole.value;
  }
};

const toggleRoleDropdown = (event: { stopPropagation: () => void; }) => {
  event.stopPropagation();
  isRoleDropdownOpen.value = !isRoleDropdownOpen.value;
};


const emits = defineEmits(['update:show']);
const closeModal = () => {
    isPersonalSettingsModalOpen.value = false;
    emits('update:show', false)
};

// 權限文字設定
const show_permission = computed(() => {
    const data = permissionList.find((item) => user.permission.includes(item.value));
    if (!data) {
        return '未知權限';
    }

    if (user.role === 'Admin') {
        return data.label;
    } else if (user.role === 'User') {
        return `${data.label}：限制次数 20 次`;
    }

    return data.label;
});

const roleList = [
    {
        label: "User",
        value: 'User',
    },
    {
        label: 'Admin',
        value: 'Admin'
    },
]

const permissionList = [
    {
        label: "標準權限",
        value: "7121062508219211771"
    },
    {
        label: '群組管理權限',
        value: 'group_management'
    },
    {
        label: '群組檢視權限',
        value: 'group_view'
    },
    {
        label: '測試權限',
        value: 'test'
    }
]

const handleChangePassword = () => {
    if (!isChangePassword.value) {
        isChangePassword.value = true
    } else {
        if (firstPwd.value === secondPwd.value) {
            isChangePassword.value = false
            message.success('儲存變更內容')
        } else {
            message.error('儲存變更內容失敗')
        }
    }
}

const originalUserData = ref({});
watch(isPersonalSettingsModalOpen, (newVal) => {
    if (newVal === true) {
        originalUserData.value = { ...user };
    }
});
const hasUnsavedChanges = computed(() => {
    return JSON.stringify(user) !== JSON.stringify(originalUserData.value);
});
const tryCloseModal = () => {
    if (isEdit.value && hasUnsavedChanges.value) {
        isConfirmCancelModalOpen.value = true;
    } else {
        closeModal();
    }
};

const groupInfo = computed(() => {
    if (user.role === 'User') {

        return user.group_list.join("、");
    } else if (user.role === 'Admin') {
        return "ALL";
    }
    return "";
});


onMounted(() => {
  originalRole.value = tempUser.value.role;
  window.addEventListener('click', closeDropdownOnGlobalClick);
});

onUnmounted(() => {
  window.removeEventListener('click', closeDropdownOnGlobalClick);
});



</script>
  
<style lang="scss" scoped>
.personalSettings {
    width: 90%;
    max-height: 80vh;
    max-width: 600px;
    background-color: var(--background-white);
}

@media (max-width: 480px) {
    .personalSettings {
        max-width: 95%;
        max-height: 80vh;
    }
}

@media (max-width: 768px) {
    .personalSettings {
        max-width: 90%;
        max-height: 80vh;
    }
}

/*****************************  
  密碼更改input
******************************/
.custom-select {
    height: 36px;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M104.704 338.752a64 64 0 0 1 90.496 0l316.8 316.8l316.8-316.8a64 64 0 0 1 90.496 90.496L557.248 791.296a64 64 0 0 1-90.496 0L104.704 429.248a64 64 0 0 1 0-90.496z"/></svg>') no-repeat;
    background-position: right 12px center;
    background-size: 1em;
    cursor: pointer;
    background-color: white;
    border-radius: 4px;
    padding: 0 12px;
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
    border: 1px solid var(--primary-hover);
}

.custom-select option:hover {
    background-color: #2c8eee;
    color: white;
}


/*****************************  
  進階搜尋: 狀態/上傳人員input
******************************/
.confirmButton {
    width: 100%;
    min-width: 100px;
    max-width: 130px;
    padding: 8px 12px 8px 12px;
    border-radius: 4px;
    border: 1px solid var(--primary);
    background-color: var(--background-white);
    transition: .3s ease-in-out;
}

.confirmButton:hover {
    -webkit-box-shadow: 0 0 15px var(--primary-hover2);
    -moz-box-shadow: 0 0 15px var(--primary-hover2);
    box-shadow: 0 0 15px var(--primary-hover2);
}

.confirmButton:active {
    background-color: var(--primary) !important;
    color: var(--text-white);
}

// 信箱Flex RWD 
.flex-container {
    display: flex;
    align-items: center;

}

.flex-label {
    width: 120px;
    min-width: 120px;
}

.flex-content {
    flex-grow: 1;
    word-break: break-word;
    overflow-wrap: break-word;
}


// 密碼更改 Flex RWD 
.flex-row {
    display: flex;
    align-items: center;
}

.flex-row-label {
    width: 120px;
    min-width: 120px;
}

.flex-row-content {
    flex-grow: 1;
    width: 100%;

}

@media (max-width: 640px) {
    .flex-label {
        width: 90px;
        min-width: 90px;
    }

    .flex-label,
    .flex-row-label {
        width: 90px;
        min-width: 90px;
    }
}

.form-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
}

input::placeholder {
    color: var(--text-disabled);
}

.input-container {
    display: flex;
    border: 1px solid var(--text-disabled);
    align-items: center;
    position: relative;
}

.input-field {
    flex-grow: 1;
    padding-left: 10px;
    height: 32px;
    border: none;
    outline: none;
    width: 100%;
}

.input-button {
    position: absolute;
    right: 0;
    padding: 0 10px;
    height: 100%;
    border: none;
    background: none;
}

.w-120px {
    width: 120px;
}

.w-90px {
    width: 90px;
}

@media (max-width: 640px) {
    .w-120px {
        width: 90px;
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
  