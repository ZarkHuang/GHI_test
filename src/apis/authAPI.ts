import request from "@/apis/axios"

export const loginUser = async(user:string,pwd:string)=>{
    const data ={
        account:user,
        pwd:pwd
    }
   return request({
    url :'/login',
    method: 'post', 
    data:data   
   })
}
 
export const createRandomCode =  async () =>{
    return request({
        url :'/login/rand',
        method: 'get',
       })
}


export const loginGoogleUser =  async (email:string,name:string, token:string) =>{
    const data ={
        email: email,
        name: name,
    }
    return request({
        url: '/login/google/auth',
        method: 'post',
        data:data,
        headers: {
            'Authorization' : token
        }
    })   
}