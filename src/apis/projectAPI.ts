import request from "@/apis/axios";
// 獲取所有項目
const token = localStorage.getItem("token")
const headers =  {
    'Authorization' : `Bearer ${token}`
}


// 根據用戶名稱獲取項目列表
export const getFuzzyProjectsByUser = async (obj :object) => {
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
    return request({
        url: '/project/createProject',
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
export const updateProjectByID = async (projectId:number, updatedData:any) => {
    return request({
      url: `/project/${projectId}`,
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
    return request({
        url: `/project/${id}`,
        method: 'delete',
        headers
    });
};

// 回呼stt
export const executeStt = async (projectId: string, sceneType: string, file: File) => {
    console.log(`Sending STT request with projectId: ${projectId}, sceneType: ${sceneType}, file: ${file.name}`);
    const formData = new FormData();
    formData.append('projectId', projectId.toString());
    formData.append('sceneType', sceneType);
    formData.append('file', file);

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
export const executeLlm = async (projectId:string, sceneType:string) => {
    return request({
        url: '/ai/llm',
        method: 'post',
        data: {
            projectId: projectId,
            sceneType: sceneType 
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
