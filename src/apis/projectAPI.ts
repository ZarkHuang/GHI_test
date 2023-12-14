import request from "@/apis/axios";
import {usePermissionStore } from "@/store/permiossion";
// 獲取所有項目
const token = localStorage.getItem("token")
const headers =  {
    'Authorization' : `Bearer ${token}`
}
const {permissionList} = usePermissionStore();

// 根據用戶名稱獲取項目列表
export const getFuzzyProjectsByUser = async (obj :object) => {
  if (!permissionList.includes("7121061576337137659")) {
    console.error('No permission to fetch fuzzy projects');
    return { error: 'No permission', data: null }; 
  }
    return request({
        url: "/project/fuzzy",
        method: 'post',
        data:obj,
        headers
    })
};

// 根據用戶名稱獲取項目列表
export const getFilterProjectsByUser = async (obj :object) => {
    return request({
        url: "/project/filter",
        method: 'post',
        data:obj,
        headers
    })
};

// 創建新項目
export const postProject = async (obj: Object) => {
    if (!permissionList.includes("7121062016688726011")) {
        console.error('No permission to fetch Post projects');
        return { error: 'No permission', data: null }; 
      }
    return request({
        url: '/project/create',
        method: 'post',
        data: obj,
        headers
    });
};

// 根據 ID 獲取特定項目
export const getProjectById = async (project_id: string) => {
    return request({
        url: `/project/${project_id}`,
        method: 'get',
        headers
    });
};

// 更新標題項目
export const updateProjectByID = async (project_id:number, updatedData:any) => {
    if (!permissionList.includes("7121062191503122427")) {
        console.error('No permission to fetch update projects');
        return { status:403 , error: 'No permission', data: null }; 
      }
    return request({
      url: `/project/${project_id}`,
      method: 'put',
      data: updatedData,
      headers
    });
  };

export const updateSttResult  = async (id: number, sttResult:string) => {
    return request({
        url: `/project/${id}`,
        method: 'put',
        data: {
          stt_result: sttResult
        },
        headers
      });
    };

// 刪除特定項目
export const deleteProjectById = async (id: number) => {
    if (!permissionList.includes("7121062306393497595")) {
        console.error('No permission to fetch Delete projects');
        return { error: 'No permission', data: null }; 
      }
    return request({
        url: `/project/${id}`,
        method: 'delete',
        headers
    });
};

// 回呼stt
export const executeStt = async (project_id: string, scene_type: string, file: File) => {
    console.log(`Sending STT request with project_id: ${project_id}, sceneType: ${scene_type}, file: ${file.name}`);
    const formData = new FormData();
    formData.append('project_id', project_id.toString());
    formData.append('scene_type', scene_type);
    formData.append('file', file);
    console.log(scene_type)
    return request({
        url: '/ai/stt',
        method: 'post',
        data: formData,
        headers: {
            ...headers,
            'Content-Type': 'multipart/form-data'
        }
    });
};


// 回呼llm
export const executeLlm = async (project_id:string, scene_type:string) => {
    return request({
        url: '/ai/llm',
        method: 'post',
        data: {
            project_id: project_id,
            scene_type: scene_type 
        },
        headers
    });
};


// 删除 Azure Blob 中的音频文件
export const deleteAudioFile = async (fileName: string) => {
    return request({
        url: `/azure/${fileName}`,
        method: 'delete',
        headers
    });
};


// 刪除Websocket請求
export const deleteWebSocket = async () => {
    return request({
        url: "/ws/delete",
        method: 'post',
        headers
    });
};

// 建立Websocket請求
export const createWebSocket = async() =>{
    return request({
        url: "/ws/create",
        method: 'post',
        headers
    })
}

