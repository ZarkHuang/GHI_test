import { defineStore,acceptHMRUpdate } from "pinia";
  
export const useRouteStore = defineStore({
    id: 'route',
    state:()=> ({
        routeList:[{
            id: 1,
            mainTitle: "",
            themeList: [
                { id: 1, url: "/profile", name: "初診", icon: "fa-home",isExpand:false },
                { id: 2, url: "/permission", name: "護理紀錄", icon: "fa-home",isExpand:false },
            ],
        
        }] ,
        isSelected:{routeId:0,themeId:0}
    }),
    getters:{ 
        getList:(state)=>state.routeList,
        getSelected:(state)=>state.isSelected
    },
    actions:{ 
        setStatus(routeId:number,themeId:number){
            this.isSelected=  {
                routeId,
                themeId
            }
        },
        updateListStatus(routeId:number,themeId:number){
            this.routeList.forEach((main)=>{
                main.themeList.forEach((theme)=>{
                    theme.isExpand =false
                })
            })
            const routeIdx = routeId-1
            const themeIdx = themeId -1 
            this.routeList[routeIdx].themeList[themeIdx].isExpand = true
        },
        resetListStatus(){
            this.routeList.forEach((main)=>{
                main.themeList.forEach((theme)=>{
                    theme.isExpand =false
                })
            })
        }
    }
     
})

if(import.meta.hot){
    import.meta.hot.accept(acceptHMRUpdate(useRouteStore,import.meta.hot))
}