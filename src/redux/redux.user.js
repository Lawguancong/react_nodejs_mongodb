import axios from 'axios'
import { message} from 'antd';


const initState = {
    // userData:false,// 默认用户没有登录
    // msg:'',// 用于redux信息提示（调试）
    // userData:false,
    // _id:'',
    // nickName:'',
    // phone:'',
    // pwd:'',
    // gender:'',
}
//reducer -> user
export function user(state = initState,action) {
    switch(action.type){
        case 'AUTH_DATA_SUCCESS':
            return {...state,...action.data,userData:true,msg:'有用户登录信息'}
        case 'DO_LOGIN_SUCCESS':
            return {...state,...action.data}
        case 'DO_LOGOUT_SUCCESS':
            return {...state,msg:'退出登录成功'}
        case 'DO_REGISTER_SUCCESS':
            return {...state,...action.data}
        case 'UPLOAD_AVATAR_FAIL':
            return {...state,msg:'上传头像失败'}
        case 'UPLOAD_AVATAR_SUCCESS':
            return {...state,avatarName:action.avatarName,msg:'上传头像成功'}
        case 'UPDATE_NICKNAME_FAIL':
            return {...state,msg:'保存昵称失败'}
        case 'UPDATE_NICKNAME_SUCCESS':
            return {...state,nickName:action.nickName,msg:'保存昵称成功'}
        case 'UPDATE_SIGNATURE_FAIL':
            return {...state,msg:'保存个性签名失败'}
        case 'UPDATE_SIGNATURE_SUCCESS':
            return {...state,signature:action.signature,msg:'保存个性签名成功'}


        default:
            return state
    }
}
export function authDataSuccess(data) {
    return {
        data,
        type: 'AUTH_DATA_SUCCESS'
    }
}
export function doLogin(data) {
    return {
        data,
        type: 'DO_LOGIN_SUCCESS'
    }
}
export function doLogout() {
    return {
        type: 'DO_LOGOUT_SUCCESS'
    }
}
export function doRegister(data) {
    return {
        data,
        type: 'DO_REGISTER_SUCCESS'
    }
}

export function doUploadAvatar(avatarName) {
    return ( dispatch )=>{
        axios.post('/uploadAvatar',{avatarName}).then( res=> {
            if(res.status === 200 && res.data.code === 0 && res.data.msg === '上传头像失败') {
                message.error('上传头像失败，请重新上传!')
                dispatch({type: 'UPLOAD_AVATAR_FAIL'})
            }else if(res.status === 200 && res.data.code === 1 && res.data.msg === '上传头像成功'){
                message.success('头像上传成功!')
                dispatch({avatarName, type: 'UPLOAD_AVATAR_SUCCESS'})
            }
        })
    }
}
export function doUpdateNickName(nickName,msg) {
    // console.log(nickName)
    // console.log(msg)
    if(msg === '保存昵称失败'){
        return{type: 'UPDATE_NICKNAME_FAIL'}
    }else if(msg === '保存昵称成功'){
        return{nickName, type: 'UPDATE_NICKNAME_SUCCESS'}
    }
}
export function doUpdateSignature(signature, msg) {
    if(msg === '保存个性签名失败'){
        return{type: 'UPDATE_SIGNATURE_FAIL'}
    }else if(msg === '保存个性签名成功'){
        return{signature, type: 'UPDATE_SIGNATURE_SUCCESS'}
    }
}