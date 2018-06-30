import { message} from 'antd';
import animateScrollTo from 'animated-scroll-to';
import axios from 'axios'
import browserCookie from 'browser-cookies'
import $ from "jquery";


import ioClient from 'socket.io-client'
const socket = ioClient('ws://localhost:9093')// 前端是3000 后端是9093
// const socket = ioClient('ws://120.79.195.212:9093')


// 获取聊天列表
// 读取信息
// 标识已读

const initState = {
    chatList:[],
    receiveAvatar:null,// 接收方的头像 也就是对方聊天的头像
    receiveNickName:null,// 对方聊天的昵称
    timestamp:null,// 最早聊天记录的时间戳
    loading:false,// 是否正在加载
    toBottom:false,// 是否跳到最底部
}


// reducer -> chat
export function chat(state = initState,action) {
    switch (action.type){

        case 'CLEAR_CHAT_LIST':
            return {...initState}
        case 'CLEAR_CHAT_UNREAD_SUCCESS':
            return {...state}
        case 'GET_CHAT_LIST_SUCCESS':
            return {...state,chatList:action.data.chatList,receiveAvatar:action.data.receiveAvatar,receiveNickName:action.data.receiveNickName,timestamp:action.data.timestamp}
        case 'NO_CHAT_LIST':
            return {...state,receiveAvatar:action.data.receiveAvatar,receiveNickName:action.data.receiveNickName}
        case 'GET_MORE_CHAT_LIST_SUCCESS':
            return {...state,chatList:[...action.data.chatList,...state.chatList],timestamp:action.data.timestamp,loading:false}
        case 'NO_MORE_CHAT_LIST':
            return {...state,loading:false}
        case 'RECEIVE_CHAT_TEXT':
            return {...state,chatList:[...state.chatList,action.data]}
        default:
            return state
    }
}
// chat page
export function clearChatUnRead(send) {
    return ( dispatch ) => {
        axios.post('/clearChatUnRead', {send}).then(res => {// 将聊天标识为已读 isRead:true
            if(res.status === 200 && res.data.code === 1 && res.data.msg === '修改聊天为已读成功'){
                dispatch({type:'CLEAR_CHAT_UNREAD_SUCCESS'})
            }
        })
    }
}
export function doSendChatText({send,receive,chatText,sendTime}) {
    return ( dispatch ) => {
        socket.emit('sendChatText',{send,receive,chatText,sendTime})// 这是有用的消息 相当于用户聊天发送的信息
        // axios.post('/save',{send,receive,chatText,sendTime}).then( res => {
        //     console.log(res)
        // })
        socket.emit('sendChatText')// 发送一条没有任何数据的信息 可以强制后台快速监听到用户聊天发送信息的数据

    }
}
export function doReceiveChatText(send,receive) {
    return ( dispatch ) => {
        socket.on('receiveChatText',function (data) {
            // console.log(data)
            let toBottom = document.body.scrollHeight - document.documentElement.clientHeight - $(window).scrollTop() < 150 ? true : false
            // console.log(document.body.scrollHeight-document.documentElement.clientHeight-$(window).scrollTop())
            if( (data.send === send && data.receive === receive) || (data.send === receive && data.receive === send) ){
                dispatch({type:'RECEIVE_CHAT_TEXT',data})
                // window.scrollTo(0,document.body.scrollHeight)
                const _id = browserCookie.get('_id').split('"')[1]// _id 为当前用户登录的cookies:_id
                if(_id === data.send){// 发送方的动画效果
                    animateScrollTo(document.body.scrollHeight, {speed:1000});
                    console.log('我是发送方')
                }
                if(_id === data.receive){// 接收方的动画效果
                    console.log('我是接收方')
                    if(toBottom){
                        animateScrollTo(document.body.scrollHeight, {speed:1000});
                    }else{

                    }
                }
            }
        })
    }
}
export function getChatList(send,receive) {// 获取消息列表
    return ( dispatch ) => {
        axios.post('/getChatList',{send,receive}).then( res=> {
            if(res.status === 200 && res.data.code === 0 && res.data.msg === '获取聊天列表失败'){

            }else if(res.status === 200 && res.data.code === 0 && res.data.msg === '该用户没有聊天列表'){
                const {receiveAvatar,receiveNickName} = res.data
                dispatch({type:'NO_CHAT_LIST', data:{receiveAvatar,receiveNickName}})
            }else if(res.status === 200 && res.data.code === 1 && res.data.msg === '获取聊天列表成功'){
                // console.log(res.data)
                const {chatList,receiveAvatar,receiveNickName,timestamp} = res.data
                dispatch({type:'GET_CHAT_LIST_SUCCESS', data:{chatList,receiveAvatar,receiveNickName,timestamp}})
                // animateScrollTo(document.body.scrollHeight, {speed:1000})// 有动画
                window.scrollTo(0,document.body.scrollHeight)// 没动画
            }
        })
    }
}
export function doGetMoreChatList(send,receive,timestamp,height) {
    // console.log(timestamp)
    return ( dispatch ) => {
        axios.post('/getMoreChatList',{send,receive,timestamp}).then( res=> {
            if(res.status === 200 && res.data.code === 0 && res.data.msg === '数据库出错'){

            }else if(res.status === 200 && res.data.code === 0 && res.data.msg === '没有更多的聊天记录'){
                dispatch({type:'NO_MORE_CHAT_LIST'})

            }else if(res.status === 200 && res.data.code === 1 && res.data.msg === '获取更多聊天列表成功'){
                // console.log(res.data)
                const {chatList,timestamp} = res.data
                // console.log(chatList.length)
                // console.log(timestamp)
                dispatch({type:'GET_MORE_CHAT_LIST_SUCCESS', data:{chatList,timestamp}})
                window.scrollTo(0,document.body.scrollHeight-height)
                // animateScrollTo((document.body.scrollHeight-height), {speed:1000})

            }
        })
    }
}
export function goBack() {
    return {
        type:'CLEAR_CHAT_LIST'// 清除聊天内容
    }
}
export function clearChatList() {
    return {
        type:'CLEAR_CHAT_LIST'// 清除聊天内容
    }
}