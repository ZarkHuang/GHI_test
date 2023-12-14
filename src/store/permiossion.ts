import { defineStore  } from "pinia";
  
export const usePermissionStore = defineStore({
    id: 'permission',
    state:()=> ({
        permissionList: [

            "7121061576337137659",  //專案查詢
            "7121062016688726011",  //專案新增
            "7121062191503122427",  //專案修改
            "7121062306393497595",  //專案刪除
            "7121062508219211771",  //個人資訊查詢
            "7121062648980054011",  //個人資訊修改
            "7121063090619293691",  //個人設定查詢
            "7121063160651587579",  //個人設定修改
        ] ,
    }),
    getters:{ 
        hasPermission: (state) => {
            return (permissionCode: string) => state.permissionList.includes(permissionCode);
          },
    },
    actions:{   
    }
})