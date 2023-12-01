import { defineStore,acceptHMRUpdate } from "pinia";

export const useUserStore = defineStore({
    id: 'user',
    state:()=> ({
        isLogin:false,
        userName:"",
        name:"",
        token:"",
    }),
    getters:{ 
        checkIsLogin:(state) => {
            if (state.isLogin===true || (state.isLogin===false && localStorage.getItem('isLogin')==="true")){
                return true
            } else 
            {
                return false
            }
        } ,
        getUserName:(state)=>state.userName 
    },
    actions: {
        login(userName: string, token: string , name: string) {
          this.isLogin = true;
          this.userName = userName;
          this.name = name;
          this.token = token;
          localStorage.setItem('token', token);
          localStorage.setItem('name', name);
          localStorage.setItem('isLogin', 'true');
        },
        logout() {
          this.isLogin = false;
          this.userName = "";
          this.name = '';
          this.token = "";
          localStorage.removeItem('token');
          localStorage.removeItem('name');
          localStorage.removeItem('isLogin'); 
        },
      },
})

if(import.meta.hot){
    import.meta.hot.accept(acceptHMRUpdate(useUserStore,import.meta.hot))
}