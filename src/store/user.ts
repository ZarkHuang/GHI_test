import { defineStore,acceptHMRUpdate } from "pinia";

export const useUserStore = defineStore({
    id: 'user',
    state:()=> ({
        isLogin: localStorage.getItem('isLogin') === "true",
        userName: localStorage.getItem('username') || "",
        token: localStorage.getItem('token') || "",
    }),
    getters: {
        checkIsLogin: (state) => {
            return state.isLogin || localStorage.getItem('isLogin') === "true";
        },
        getUserName: (state) => state.userName,
    },
    actions: {
        login(userName: string, token: string) {
            this.isLogin = true;
            this.token = token;
            this.userName = userName;
            localStorage.setItem('token', token);
            localStorage.setItem('isLogin', 'true');
        },
        logout() {
            this.isLogin = false;
            this.token = "";
            this.userName = "",
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('isLogin');
        },
    },
});

if(import.meta.hot){
    import.meta.hot.accept(acceptHMRUpdate(useUserStore,import.meta.hot))
}