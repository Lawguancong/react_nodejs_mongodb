import axios from 'axios'

import ioClient from 'socket.io-client'
const socket = ioClient('ws://localhost:9093')// 前端是3000 后端是9093
// const socket = ioClient('ws://120.79.195.212:9093')

// reducer -> message
const initState = {
    messageList:[],
    messageUnRead:0,
    initialLoadingDoReceiveChatText:false,// 是否初次加载 : 发送
    initialLoadingGetLatestMessageUnReadNum:false,// 是否初次加载 : 接收
    chatTargetArr:[],// 和目标聊天的 id
    listeningLatestMessageList:false,// 是否正在监听最新消息  只监听一次


}
export function message(state = initState,action) {
    switch (action.type){
        case 'DO_CHANGE_CHAT_TARGET':
            return {...state,chatTarget:action.chatTarget}
        case 'GET_MESSAGE_LIST_SUCCESS':
            return {...state,messageList:action.messageList,messageUnRead:action.messageUnRead}
        case 'GET_LATEST_MESSAGE_UNREAD_NUM':
            return {...state,messageUnRead:state.messageUnRead+1}
        case 'LISTENING_LATEST_MESSAGE_LIST':
            return {...state,listeningLatestMessageList:true}
        default:
            return state
    }
}

// message page
export function getMessageUnReadNum() {
    // console.log(receive)
    return ( dispatch ) => {
        axios.post('/getMessageList',{}).then( res=> {
            if(res.status === 200 && res.data.code === 0 && res.data.msg === '数据库出错'){

            }else if(res.status === 200 && res.data.code === 0 && res.data.msg === '获取消息列表失败'){

            }else if(res.status === 200 && res.data.code === 1 && res.data.msg === '获取消息列表成功'){
                let messageUnRead = 0
                for(let i=0;i<res.data.messageList.length;i++){
                    messageUnRead += res.data.messageList[i].message.unReadNum
                }
                dispatch({type:'GET_MESSAGE_LIST_SUCCESS',messageList:res.data.messageList,messageUnRead})
            }
        })
    }
}
export function getLatestMessageUnReadNum(receive) {// 获取最新的消息的未读数
    // console.log('getLatestMessageUnReadNum')
    return ( dispatch ) => {
        socket.on('receiveChatText',function (data) {
            // console.log('receiveChatText')
            // console.log(data)
            // console.log(data)
            if( data.receive === receive ){
                dispatch({type:'GET_LATEST_MESSAGE_UNREAD_NUM',data})
            }
        })
    }
}
export function getLatestMessageList(receive) {
    // console.log(4567890)

    return ( dispatch ) => {
        socket.on('receiveChatText',function (data) {
            if( data.receive === receive ) {
                axios.post('/getMessageList',{}).then( res=> {
                    if(res.status === 200 && res.data.code === 0 && res.data.msg === '数据库出错'){

                    }else if(res.status === 200 && res.data.code === 0 && res.data.msg === '获取消息列表失败'){

                    }else if(res.status === 200 && res.data.code === 1 && res.data.msg === '获取消息列表成功'){
                        // console.log(res.data.messageList)
                        let messageUnRead = 0
                        for(let i=0;i<res.data.messageList.length;i++){
                            messageUnRead += res.data.messageList[i].message.unReadNum
                        }
                        dispatch({type:'GET_MESSAGE_LIST_SUCCESS',messageList:res.data.messageList,messageUnRead})
                    }
                })
            }
        })
    }
}
export function listeningLatestMessageList() {
    // console.log('listeningLatestMessageList')
    return{
        type:'LISTENING_LATEST_MESSAGE_LIST'
    }
}
export function doChangeChatTarget(chatTarget) {
    return {
        chatTarget,
        type:'DO_CHANGE_CHAT_TARGET'
    }
}