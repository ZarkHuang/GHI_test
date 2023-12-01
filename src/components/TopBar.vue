<template>
    <div class="  w-full flex justify-between px-4 items-center border-b-2"
        style="background-color:var(--primary); height:100% ; max-height: 40px;">

        <button class="pl-2 text-3xl font-bold" @click="back2Home">
            <currentLogo alt="Logo" />
        </button>

        <div class="flex gap-4 items-center">
            <div class="text-white relative text-sm sm:text-base">Hi {{ userName || 'Guest' }} </div>
            <div class="rounded-full text-white cursor-pointer">
                <UserInfo alt="User Info" @click="toggleDropdown" />
                <div v-if="isDropdownOpen" class="dropdown-menu shadow-md">
                    <ul>
                        <li class="flex items-center justify-center gap-2 " @click="functionTips">
                            <n-icon class="flex items-center">
                            <accounts />
                            </n-icon>
                            帳號管理
                        </li>
                        <li class="flex items-center justify-center gap-2 " @click="functionTips">
                            <n-icon>
                            <settings />
                            </n-icon>個人化設定
                        </li>
                        <li class="flex items-center justify-center gap-2 " @click="functionTips">
                            <n-icon>
                            <key />
                            </n-icon>
                            站台管理
                        </li>
                        <li class="flex items-center justify-center gap-2 " @click="handlerLogout">
                            <n-icon >
                            <Logout/>
                            </n-icon>登出
                        </li>
                    </ul>
                </div>
            </div>
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

// Icon
import UserInfo from '@/assets/icons/userInfo.svg'
import logoSmall from '@/assets/icons/logo_small.svg'
import logoIconSmall from '@/assets/icons/logo_icon_small.svg'
import BellRing from '@/assets/icons/bellRing.svg'
import key from '@/assets/icons/key.svg'
import Logout from '@/assets/icons/logout.svg'
import settings from '@/assets/icons/settings.svg'
import accounts from '@/assets/icons/accounts.svg'


const routerStore = useRouteStore()
const router = useRouter()
const { resetListStatus } = useRouteStore()
const { logout } = useUserStore()

const back2Home = () => {
    routerStore.setStatus(0, 0)
    router.push("/scene")
}

const message = useMessage();
const userStore = useUserStore();
const userName = computed(() => userStore.name || localStorage.getItem("name") || 'Guest');


const handlerLogout = () => {
  localStorage.removeItem('token');
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
const logoIconSmallRaw = markRaw(logoIconSmall  as any);

const currentLogo = ref(logoSmallRaw);

const checkSize = () => {
    if (window.innerWidth < 640) { // 假設 640px 是您的手機版斷點
        currentLogo.value = logoIconSmallRaw;
    } else {
        currentLogo.value = logoSmallRaw;
    }
};

onMounted(() => {
    window.addEventListener('resize', checkSize);
    checkSize(); // 初始檢查
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkSize);
    document.removeEventListener('click', handleClickOutside);
});

</script>

<style lang="scss" scoped>
.dropdown-menu {
    position: absolute;
    right: 4px;
    top: 40px;
    background: white;
    border: 1px solid #eee;
    border-radius: 5px;
    width: 100%;
    max-width: 180px; /* 或根據需要調整 */
    color: var(--text);
    text-align: center;
    padding: 1rem;
    z-index: 999;

    @media (max-width: 640px) { /* 小於 640px 時 */
        width: 95%; /* 寬度占滿 */
        right: 0; /* 從右邊界開始 */
        left: 0; /* 從左邊界開始 */
        max-width: none; /* 移除最大寬度限制 */
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
    padding: 10px;
    cursor: pointer;
}

.dropdown-menu li:hover {
    background-color: #f5f5f5;
}
</style>
