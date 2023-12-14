<template>
    <div class="  w-full flex justify-between px-4 items-center border-b-2"
        style="background-color:var(--primary); height:100% ; max-height: 40px; z-index: 999;">

        <button class="pl-2 text-3xl font-bold" @click="backToHome">
            <currentLogo alt="Logo" />
        </button>

        <div class="flex gap-4 items-center">
            <div class="text-white relative text-sm sm:text-base">Hi {{ userName || 'Guest' }} </div>
            <div class="rounded-full text-white cursor-pointer">
                <UserInfo alt="User Info" @click="toggleDropdown" />
                <div v-if="isDropdownOpen" class="dropdown-menu shadow-md">
                    <ul>
                        <li class="flex items-center justify-center gap-2 " @click="showPersonalSettingsModal">
                            <n-icon class="flex items-center">
                                <accounts />
                            </n-icon>
                            帳號管理
                        </li>
                        <li class="flex items-center justify-center gap-2 " @click="goToAdminPanel"
                            v-if="isAvailableCheckBackStage">
                            <n-icon>
                                <key />
                            </n-icon>
                            站台管理
                        </li>
                        <li class="flex items-center justify-center gap-2 " @click="handlerLogout">
                            <n-icon>
                                <Logout />
                            </n-icon>登出
                        </li>

                    </ul>
                </div>
            </div>
            <div v-if="isDropdownOpen" class="overlay"></div>
            <PersonalSettings v-model:show="isPersonalSettingsModalOpen" />
            <div class=" rounded-full text-white cursor-pointer">
                <BellRing alt="User Info" @click="functionTips" />
            </div>
        </div>
    </div>
</template> 

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, markRaw } from "vue";
import { useRouteStore } from "@/store/route"
import { useUserStore } from "@/store/user"
import { useRouter } from "vue-router"
import { useMessage } from 'naive-ui';
import PersonalSettings from "./PersonalSettings.vue";
import { usePermissionStore } from '@/store/permiossion'
// Icon
import UserInfo from '@/assets/icons/userInfo.svg'
import logoSmall from '@/assets/icons/logo_small.svg'
import logoIconSmall from '@/assets/icons/logo_icon_small.svg'
import BellRing from '@/assets/icons/bellRing.svg'
import key from '@/assets/icons/key.svg'
import Logout from '@/assets/icons/logout.svg'
// import settings from '@/assets/icons/settings.svg'
import accounts from '@/assets/icons/accounts.svg'


const isPersonalSettingsModalOpen = ref(false);
const permiossionStore = usePermissionStore();


/****************************************************************
   權限設置
*****************************************************************/
// Admin設置
// 假設符合個人資訊新增及修改條件，那就可打開並且編輯
const isAvailableCheckInfo = computed(() => permiossionStore.permissionList.includes("7121062508219211771") ||  "7121062648980054011");
//  假設admin不能使用猴台功能
const isAvailableCheckBackStage = computed(() => permiossionStore.permissionList.includes("7121062508219211771"));


/****************************************************************
   其他
*****************************************************************/
const routerStore = useRouteStore()
const router = useRouter()
const { resetListStatus } = useRouteStore()
const { logout } = useUserStore()

const backToHome = () => {
    routerStore.setStatus(0, 0)
    router.push("/scene")
}


const message = useMessage();
const userStore = useUserStore();
const userName = computed(() => userStore.userName || localStorage.getItem("userName") || 'Guest');

//TODO:TOKEN驗證、儲存TOKEN、及留意TOKEN的安全性 成功跳轉至後台
const goToAdminPanel = () => {
    const token = localStorage.getItem('token');// 檢查用戶是否已登入（檢查是否存在 token）
    if (token && isAvailableCheckInfo.value) {
        window.location.href = 'https://ghi-dev.everfortuneai.com.tw/admin/role_permission_list';
    } else {
        router.push('/login');
    }
};

const handlerLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isLogin');
    logout();
    resetListStatus();
    router.push("/login");
    message.success('您已成功登出');
    window.location.reload()
};


const functionTips = () => {
    message.warning('功能尚未開放');
}

const isDropdownOpen = ref(false);
const toggleDropdown = (event: any) => {
    event.stopPropagation();
    isDropdownOpen.value = !isDropdownOpen.value;
};
const handleClickOutside = (event: any) => {
    if (isDropdownOpen.value && !event.target.closest('.dropdown-menu')) {
        isDropdownOpen.value = false;
    }
};

const logoSmallRaw = markRaw(logoSmall as any);
const logoIconSmallRaw = markRaw(logoIconSmall as any);

const currentLogo = ref(logoSmallRaw);

const checkSize = () => {
    if (window.innerWidth < 640) {
        currentLogo.value = logoIconSmallRaw;
    } else {
        currentLogo.value = logoSmallRaw;
    }
};

let justOpenedModal = false; //用於追蹤帳號管理modal是否被打開
const showPersonalSettingsModal = () => {

    if (!isAvailableCheckInfo.value) {
        message.warning("您尚無權限可提供查閱")
        return;
    }

    isDropdownOpen.value = false;
    isPersonalSettingsModalOpen.value = true;
    justOpenedModal = true;
};

const closeModalOnOutsideClick = (event: any) => {
    const modalElement = document.getElementById('pSettings');
    if (justOpenedModal) {
        justOpenedModal = false;
        return;
    }
    if (modalElement && !modalElement.contains(event.target) && isPersonalSettingsModalOpen.value) {
        isPersonalSettingsModalOpen.value = false;
    }
};



onMounted(() => {
    window.addEventListener('resize', checkSize);
    checkSize(); // 初始檢查
    document.addEventListener('click', handleClickOutside);

    window.addEventListener('click', closeModalOnOutsideClick);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkSize);
    document.removeEventListener('click', handleClickOutside);

    window.removeEventListener('click', closeModalOnOutsideClick);
});


</script>

<style lang="scss" scoped>
.overlay {
    display: none;
    position: absolute;
    top: 38px;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, .4);
    z-index: 9;
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

.dropdown-menu {
    position: absolute;
    right: 0px;
    top: 40px;
    background: white;
    border: 1px solid #eee;
    border-radius: 5px;
    width: 100%;
    max-width: 180px;
    color: var(--text);
    text-align: center;
    padding: 0;
    z-index: 99;

    @media (max-width: 640px) {
        width: 95%;
        right: 0;
        left: 0;
        max-width: none;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
}

.dropdown-menu ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.dropdown-menu li {
    padding: 16px 16px;
    cursor: pointer;
    transition: .2s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    width: 100%;
}

.dropdown-menu li:hover {
    background-color: var(--primary);
    color: var(--text-white);
}
</style>
