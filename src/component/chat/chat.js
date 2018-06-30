import React from 'react'
import { Input ,Icon, Button, Spin ,Divider ,message} from 'antd';
import './chat.css'
import {connect} from 'react-redux'
import {authDataSuccess} from '../../redux/redux.user'
import {getChatList,doSendChatText,doReceiveChatText,doGetMoreChatList,goBack,clearChatUnRead,clearChatList} from '../../redux/redux.chat'
import {doChangeChatTarget,getMessageUnReadNum} from '../../redux/redux.message'
import {} from '../../redux/redux.message'
import axios from 'axios'
import animateScrollTo from 'animated-scroll-to';
import $ from "jquery";



Date.prototype.format = function(format) {
    var o = {
        "M+" : this.getMonth() + 1,// month
        "d+" : this.getDate(),// day
        "h+" : this.getHours(),// hour
        "m+" : this.getMinutes(),// minute
        "s+" : this.getSeconds(),// second
        "q+" : Math.floor((this.getMonth() + 3) / 3),// quarter
        "S" : this.getMilliseconds()
        // millisecond
    };
    if (/(y+)/.test(format) || /(Y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for ( var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};// 时间戳转换
@connect(
    state=>state,
    {authDataSuccess,getChatList,doSendChatText,doReceiveChatText,doGetMoreChatList,goBack,doChangeChatTarget,clearChatUnRead,clearChatList,getMessageUnReadNum}
)

class Chat extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            authChat:false,// 聊天用户是否存在
            chatText:'',// 发送消息的内容
            chatList:[],
            clientHeight:null,
            bodyHeight:null,
            scrollTop:null,

        }
        this.sendChatText = this.sendChatText.bind(this)
        this.clearChatUnRead = this.clearChatUnRead.bind(this)
    }
    componentDidMount(){

        // console.log('componentDidMount')
        this.authData()
        this.authChat(this.props.match.params._id)// 验证发送方聊天用户是否存在

    }
    componentWillUpdate(){
        // console.log('componentWillUpdate')
    }
    componentDidUpdate(){

        // console.log('componentDidUpdate')
        // console.log(document.documentElement.clientHeight)// 手机设备的屏幕高度
        // console.log(document.body.scrollHeight)// 整个文档高度
        // console.log(document.documentElement.scrollTop)// 距离顶端的高度 谷歌兼容 360 不兼容
        // console.log($(window).scrollTop())
        this.clearChatUnRead()

    }
    authData(){
        // console.log(this.props.match.params._id)
        // 获取用户信息
        axios.post('/authData').then( res => {
            if(res.status === 200 && res.data.code === 1 && res.data.msg === '有用户登录信息'){
                this.props.authDataSuccess(res.data.data)// 如果有用户登录信息，则更新redux的用户数据
                this.props.getChatList(this.props.user._id,this.props.match.params._id)
                // console.log(this.props.match.params._id)
                // console.log(this.props.message.chatTargetArr)
                // console.log(this.props.message.chatTargetArr.length)
                if(this.props.message.chatTargetArr.length === 0 ){
                    this.props.message.chatTargetArr.push(this.props.match.params._id)
                    this.props.doReceiveChatText(this.props.user._id,this.props.match.params._id)//接收聊天
                }else{
                    let flag = true
                    this.props.message.chatTargetArr.map( v => {
                        // console.log(v)
                        if(v === this.props.match.params._id){
                            flag = false
                        }
                    })
                    if(flag){
                        this.props.message.chatTargetArr.push(this.props.match.params._id)
                        this.props.doReceiveChatText(this.props.user._id,this.props.match.params._id)//接收聊天
                    }
                }
                // console.log(this.props.message.chatTargetArr)
            }else{
                window.location.href="/";// 重刷新 '/'
            }
        })
    }
    authChat(send){
        // 验证发送方聊天用户是否存在
        axios.post('/authChat',{send}).then( res => {
            // console.log(res)
            if(res.status === 200 && res.data.code === 1 && res.data.msg === '对方聊天用户存在'){
                this.setState({
                    authChat:true
                })
                this.clearChatUnRead()
                // 输入框bug
                this.clearMyInput_BUG()

            }else{
                window.location.href="/message";// 重定向 '/'

            }
        })
    }
    clearMyInput_BUG(){
        // console.log('clearMyInput_BUG')
        let timer
        $("#myInput").on('click',function () {
            // console.log('onClick')
            var _self = this
            timer = setTimeout(function () {
                // animateScrollTo(document.body.scrollHeight, {speed:1000});
                document.body.scrollTop = document.body.scrollHeight;


                // _self.scrollIntoView()
                // let p = $(window).scrollTop(),t = $(window).scrollTop();
                // $(window).scroll(function(e){
                //     p = $(this).scrollTop();
                //     if(t>p){
                //         // window.alert('上滚')
                //         $("#myInput").blur()
                //     }else{
                //         // window.alert('下滚')
                //         // $("#myInput").blur()
                //     }
                //     t = p;;   //更新上一次scrollTop的值
                // });
            },100)
        })
        $("#myInput").on('blur',function () {
            console.log('blur')
            clearTimeout(timer)
        })
    }
    clearChatUnRead(){
        let i = 0
        this.props.message.messageList.map( v => {
            if(v.message.send === this.props.match.params._id || v.message.receive === this.props.match.params._id){
                this.props.message.messageUnRead -= this.props.message.messageList[i].message.unReadNum
                this.props.message.messageList[i].message.unReadNum = 0
            }else{
                i++
            }
        })
    }
    // 清楚redux -> unRead
    sendChatText(){
        if(this.state.chatText.trim().length !== 0 ){
            // this.setState({chatText:''})
            const send = this.props.user._id
            const receive = this.props.match.params._id
            const chatText = this.state.chatText
            const sendTime = new Date().getTime()
            // console.log(sendTime)
            // console.log(new Date(sendTime).format("yyyy-MM-dd hh:mm:ss"))
            // return
            this.props.doSendChatText({send,receive,chatText,sendTime})//发送聊天
            this.setState({chatText:''})
            animateScrollTo(document.body.scrollHeight, {speed:1000});
        }else{
            message.error('不能发送空白消息')
        }
    }
    goBack(){
        // console.log('backToMessage')
        this.props.history.goBack()
        this.props.goBack()

    }
    getMoreChatList(){
        if(this.props.chat.loading === false){
            // console.log('getMoreChatList')
            this.props.chat.loading = true
            const send = this.props.user._id
            const receive = this.props.match.params._id
            this.setState({})
            const _self  = this
            const height = document.body.scrollHeight -  $(window).scrollTop()
            _self.props.doGetMoreChatList(send,receive,_self.props.chat.timestamp,height)// 获取更多的历史聊天记录

        }
    }
    showChatDate(sendTime){
        // console.log(new Date())
        const chatYear = parseInt(new Date(sendTime).format("yyyy-MM-dd hh:mm").split(" ")[0].split("-")[0])
        const chatMonth = parseInt(new Date(sendTime).format("yyyy-MM-dd hh:mm").split(" ")[0].split("-")[1])
        const chatDay = parseInt(new Date(sendTime).format("yyyy-MM-dd hh:mm").split(" ")[0].split("-")[2])
        // console.log(chatYear)
        // console.log( new Date().getFullYear() )
        // console.log( new Date().getMonth() + 1 )
        // console.log( new Date().getDate() )
        // console.log(month)
        // console.log(day)
        if( chatYear < new Date().getFullYear() ){
            return new Date(sendTime).format("yyyy-MM-dd hh:mm")
        }
        if( chatMonth < new Date().getMonth() + 1 ){
            return new Date(sendTime).format("MM-dd hh:mm")
        }
        // if( chatDay+2 === new Date().getDate()){
        //     return "前天 " + new Date(sendTime).format("hh:mm")
        //
        // }
        if( chatDay+1 === new Date().getDate()){
            return "昨天 " + new Date(sendTime).format("hh:mm")
        }
        if( chatDay < new Date().getDate()){
            return new Date(sendTime).format("MM-dd hh:mm")
        }
        if( chatDay === new Date().getDate()){
            return new Date(sendTime).format("hh:mm")
        }
    }
    render(){
        // console.log(this.props)
        const send = this.props.user._id
        const receive = this.props.match.params._id
        const emoji = '😀'
        return(
            <div id="chat-page">
                <div className="stick-header">
                    <div className="receiveNickName">
                        <span style={{color:'white'}}  onClick={() => this.getMoreChatList()}>{this.props.chat.receiveNickName}</span>
                    </div>
                    <div className="go-back">
                        <Icon onClick={() => this.goBack() } type="left"/>
                        {/*<span onClick={() => this.goBack()}>返回</span>*/}
                    </div>
                </div>

                <div className="chat-list">
                    {this.state.authChat === true
                        ? (
                            <Divider className="loading-more" onClick={() => this.getMoreChatList()}>
                                <span className="loading-title">加载更多<Icon type="up" /><Spin className='loading-spinning' spinning={this.props.chat.loading}/></span>
                                {/*spinning={this.props.chat.loading}*/}
                            </Divider>
                        )
                        : (null)}

                    {this.props.chat.chatList.map( v => {
                        {/*console.log(v.sendTime)*/}
                        return v.send === send
                            ? (
                                <div key={v._id} className="chat-me">
                                    {/*<p style={{textAlign:'center'}}>{new Date(v.sendTime).format("yyyy-MM-dd hh:mm:ss")}</p>*/}
                                    {v.showDate === true ? (<p style={{textAlign:'center'}}>{this.showChatDate(v.sendTime)}</p>) : (null)}

                                    <div className="chat" style={{marginRight:'10px'}}>
                                        <div className="arrow-right"/>
                                        <span>{v.chatText}</span>
                                    </div>
                                    <img className="avatar" src={this.props.user.avatarName} alt="" style={{width:'40px',height:'40px',borderRadius:'8px'}} />
                                </div>
                            )
                            : (
                                v.send === receive
                                    ? (
                                    <div key={v._id}>
                                        {v.showDate === true ? (<p style={{textAlign:'center'}}>{this.showChatDate(v.sendTime)}</p>) : (null)}
                                        <img className="avatar" onClick={() => this.props.history.push(`/user/${v.send}`)} src={this.props.chat.receiveAvatar} alt=""  style={{width:'40px',height:'40px',borderRadius:'8px'}} />
                                        <div className="chat" style={{marginLeft:'10px'}}>
                                            <div className="arrow-left"/>
                                            <span>{v.chatText}</span>
                                        </div>
                                    </div>

                                ) : (null)
                            )
                    })}
                </div>
                {this.state.authChat === true
                    ? (
                        <div className="stick-footer">
                            <Input
                                id="myInput"
                                value={this.state.chatText}
                                placeholder="请输入"
                                size="large"
                                onChange={(e) => this.setState({chatText:e.target.value})}
                                // addonBefore={<Icon type="smile-o" onClick={() => console.log("表情")}/>}
                                addonAfter={<span onClick={this.sendChatText}>&nbsp;发&nbsp;送&nbsp;</span>}
                                onFocus={() => {
                                    {/*animateScrollTo(document.body.scrollHeight, {speed:1000})*/}
                                    {/*setTimeout(function(){*/}
                                        {/*document.body.scrollTop = document.body.scrollHeight;*/}
                                    {/*},300);*/}
                                    {/*console.log(this)*/}
                                }}
                                onClick={() => {
                                    {/*animateScrollTo(document.body.scrollHeight, {speed:1000})*/}
                                    {/*setTimeout(function(){*/}
                                        {/*document.body.scrollTop = $('#root').height();*/}
                                        {/*/!*console.log($(document.body).outerHeight(true))*!/*/}
                                        {/*/!*console.log($('#root').height())*!/*/}
                                        {/*/!*console.log(document.body.scrollHeight)*!/*/}
                                    {/*},100);*/}
                                }}
                                onPressEnter={this.sendChatText}
                                maxLength={200}
                            />
                        </div>
                    )
                    : (null)}
            </div>
        )
    }
    componentWillUnmount () {
        // console.log('componentWillUnmount')
        this.props.clearChatUnRead(this.props.match.params._id);// 修改数据库 将聊天标识为已读 isRead:true
        this.props.clearChatList()
        this.props.getMessageUnReadNum()

    }

}
export default Chat