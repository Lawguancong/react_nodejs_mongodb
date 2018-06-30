import React from 'react'
import {connect} from 'react-redux'
import { Badge ,Icon,Button,Modal,Input , Radio,message, } from 'antd';
import './footerLink.css'
import axios from 'axios'
import {doRegister,doLogin,authDataSuccess} from '../../redux/redux.user'
import {getMessageUnReadNum,getLatestMessageUnReadNum,listeningLatestMessageList,getLatestMessageList} from '../../redux/redux.message'

import browserCookie from 'browser-cookies'
import {Switch, Route} from 'react-router-dom'

import Home from '../home/home'
import Browser from '../../component/browser/browser'
import Publish from '../../component/publish/publish'
import Message from '../../component/message/message'
import Me from '../../component/me/me'

@connect(
    state => state,
    {doLogin,doRegister,authDataSuccess,getMessageUnReadNum,getLatestMessageUnReadNum,listeningLatestMessageList,getLatestMessageList}
)
class FooterLink extends React.Component{
    constructor(props){
        // console.log('constructor')
        super(props)
        this.state = {
            whichClick:'',// footerLink 从哪里点击注册登录的 public? message? me?
            loginRegisterModalVisible: false,// 默认不显示Modal框
            showRegister:false,// 默认显示login框
            loginRegisterModalTitle:'请登录',
            loginPhone:'',
            loginPassword:'',
            registerNickName:'',
            registerPhone:'',
            registerCaptcha_6:'',// 用户输入的6位验证码
            registerCaptcha_6Title:'获取验证码',
            registerPassword:'',
            registerGender:'',// 用户注册的性别
            isSendCaptcha_6:false,// 是否发送6位验证码 默认没有false
            isClickDoLogin:false,// 是否点击 登录 按钮 默认没有false
            isClickDoRegister:false,// 是否点击 注册 按钮 默认没有false

        }
        this.doLogin = this.doLogin.bind(this)
        this.doRegister = this.doRegister.bind(this)

    }
    componentWillMount(){
        // console.log('componentWillMount')
    }
    componentDidMount(){
        // console.log('footerLink-didmountmount')
        // console.log(this.props.user.userData)
        if(!this.props.user.userData){
            // console.log(this.props.location.pathname)
            this.checkURL()// 验证路径url 是否为：'/' '/browser' '/publish' '/message' '/me' 否则不显示footer底部导航栏
            // this.authData()
        }else{
            const _self = this
            this.footerLink()// 管理footer <a href> 标签导航栏跳转 图标颜色 '/' '/browser' '/publish' '/message' '/me'
            if(document.getElementById("a-home") === null ){
                return// 解决bug ：   刷新   ----立马单击> 问题
            }
            document.getElementById("a-home").onclick = function () {
                // console.log('有用户登录信息')
                // _self.setLoginRegisterModalVisible(false)
                _self.props.history.push('/')
                document.getElementById("home").setAttribute("src", require(`./img/home-full.png`));
                document.getElementById("browser").setAttribute("src", require(`./img/browser.png`));
                document.getElementById("publish").setAttribute("src", require(`./img/publish-full.png`));
                document.getElementById("message").setAttribute("src", require(`./img/message.png`));
                document.getElementById("me").setAttribute("src", require(`./img/me.png`));
                return false

            }
            document.getElementById("a-browser").onclick = function () {
                // console.log('有用户登录信息')
                // _self.setLoginRegisterModalVisible(false)
                _self.props.history.push('/browser')
                document.getElementById("home").setAttribute("src", require(`./img/home.png`));
                document.getElementById("browser").setAttribute("src", require(`./img/browser-full.png`));
                document.getElementById("publish").setAttribute("src", require(`./img/publish-full.png`));
                document.getElementById("message").setAttribute("src", require(`./img/message.png`));
                document.getElementById("me").setAttribute("src", require(`./img/me.png`));
                return false

            }
            document.getElementById("a-publish").onclick = function () {
                // console.log('有用户登录信息')
                // _self.setLoginRegisterModalVisible(false)
                _self.props.history.push('/publish')
                document.getElementById("home").setAttribute("src", require(`./img/home.png`));
                document.getElementById("browser").setAttribute("src", require(`./img/browser.png`));
                document.getElementById("publish").setAttribute("src", require(`./img/publish-full.png`));
                document.getElementById("message").setAttribute("src", require(`./img/message.png`));
                document.getElementById("me").setAttribute("src", require(`./img/me.png`));
                return false
            }
            document.getElementById("a-message").onclick = function () {
                // console.log('有用户登录信息')
                // _self.setLoginRegisterModalVisible(false)
                _self.props.history.push('/message')
                document.getElementById("home").setAttribute("src", require(`./img/home.png`));
                document.getElementById("browser").setAttribute("src", require(`./img/browser.png`));
                document.getElementById("publish").setAttribute("src", require(`./img/publish-full.png`));
                document.getElementById("message").setAttribute("src", require(`./img/message-full.png`));
                document.getElementById("me").setAttribute("src", require(`./img/me.png`));
                return false
            }
            document.getElementById("a-me").onclick = function () {
                // console.log('有用户登录信息')
                // _self.setLoginRegisterModalVisible(false)
                _self.props.history.push('/me')
                document.getElementById("home").setAttribute("src", require(`./img/home.png`));
                document.getElementById("browser").setAttribute("src", require(`./img/browser.png`));
                document.getElementById("publish").setAttribute("src", require(`./img/publish-full.png`));
                document.getElementById("message").setAttribute("src", require(`./img/message.png`));
                document.getElementById("me").setAttribute("src", require(`./img/me-full.png`));
                return false
            }
            const _id = browserCookie.get('_id').split('"')[1]
            this.props.getMessageUnReadNum()

            // this.props.getLatestMessageUnReadNum(_id)// footer未读数 不正常
            // console.log(this.props.message.listeningLatestMessageList)
            if(this.props.message.listeningLatestMessageList === false){
                this.props.listeningLatestMessageList();
                this.props.getLatestMessageList(_id)// 消息列表未读数 正常

            }
        }

    }
    componentWillReceiveProps (nextProps) {
        // console.log(nextProps)
        // console.log('componentWillReceiveProps')
        // this.authData()
    }
    shouldComponentUpdate (nextProps,nextState) {
        // console.log('shouldComponentUpdate')
        // console.log(nextProps,nextState)
        // return this.props.location.action === "PUSH"
        return true//
    }
    componentWillUpdate (nextProps,nextState) {
        // console.log(nextProps,nextState)
        // console.log('componentWillUpdate')
    }
    componentDidUpdate(){
        // console.log('componentDidUpdate')
        // console.log(this.state.whichClick)
        // console.log(this.state)
        // this.authData()
    }
    authData(){
        // 获取用户信息
        const _self = this
        // console.log(this.props.user)
        axios.post('/authData').then( res => {
            // console.log(res.data)
            if(res.status === 200 && res.data.code === 0 && res.data.msg === '没有用户登录信息'){
                if(_self.props.location.pathname === '/publish' || _self.props.location.pathname === '/message' || _self.props.location.pathname === '/me'){
                    this.setState({ loginRegisterModalVisible:true });
                    _self.props.history.push('/')
                    document.getElementById("home").setAttribute("src", require(`./img/home-full.png`));
                    document.getElementById("browser").setAttribute("src", require(`./img/browser.png`));
                    document.getElementById("publish").setAttribute("src", require(`./img/publish-full.png`));
                    document.getElementById("message").setAttribute("src", require(`./img/message.png`));
                    document.getElementById("me").setAttribute("src", require(`./img/me.png`));
                }
                document.getElementById("a-home").onclick = function () {
                    // console.log('没有用户登录信息')
                    _self.props.history.push('/')
                    // _self.setState({
                    //     whichClick:'',
                    // })
                    document.getElementById("home").setAttribute("src", require(`./img/home-full.png`));
                    document.getElementById("browser").setAttribute("src", require(`./img/browser.png`));
                    document.getElementById("publish").setAttribute("src", require(`./img/publish-full.png`));
                    document.getElementById("message").setAttribute("src", require(`./img/message.png`));
                    document.getElementById("me").setAttribute("src", require(`./img/me.png`));
                    return false

                }
                document.getElementById("a-browser").onclick = function () {
                    // console.log('没有用户登录信息')
                    _self.props.history.push('/browser')
                    // _self.setState({
                    //     whichClick:'',
                    // })
                    document.getElementById("home").setAttribute("src", require(`./img/home.png`));
                    document.getElementById("browser").setAttribute("src", require(`./img/browser-full.png`));
                    document.getElementById("publish").setAttribute("src", require(`./img/publish-full.png`));
                    document.getElementById("message").setAttribute("src", require(`./img/message.png`));
                    document.getElementById("me").setAttribute("src", require(`./img/me.png`));
                    return false

                }
                document.getElementById("a-publish").onclick = function () {
                    // console.log('没有用户登录信息')
                    _self.setState({
                        whichClick:'/publish',
                        loginRegisterModalVisible:true
                    })
                    // _self.setLoginRegisterModalVisible(true)
                    return false
                }
                document.getElementById("a-message").onclick = function () {
                    // console.log('没有用户登录信息')
                    _self.setState({
                        whichClick:'/message',
                        loginRegisterModalVisible:true
                    })
                    // _self.setLoginRegisterModalVisible(true)

                    return false
                }
                document.getElementById("a-me").onclick = function () {
                    // console.log('没有用户登录信息')
                    _self.setState({
                        whichClick:'/me',
                        loginRegisterModalVisible:true
                    })
                    // _self.setLoginRegisterModalVisible(true)

                    return false
                }
            }else if(res.status === 200 && res.data.code === 0 && res.data.msg === '后端数据库出错'){
                if(_self.props.location.pathname === '/publish' || _self.props.location.pathname === '/message' || _self.props.location.pathname === '/me'){
                    this.setState({ loginRegisterModalVisible:true });
                    _self.props.history.push('/')
                    document.getElementById("home").setAttribute("src", require(`./img/home-full.png`));
                    document.getElementById("browser").setAttribute("src", require(`./img/browser.png`));
                    document.getElementById("publish").setAttribute("src", require(`./img/publish-full.png`));
                    document.getElementById("message").setAttribute("src", require(`./img/message.png`));
                    document.getElementById("me").setAttribute("src", require(`./img/me.png`));
                }
                document.getElementById("a-home").onclick = function () {
                    // console.log('没有用户登录信息')
                    _self.props.history.push('/')
                    // _self.setState({
                    //     whichClick:'',
                    // })
                    document.getElementById("home").setAttribute("src", require(`./img/home-full.png`));
                    document.getElementById("browser").setAttribute("src", require(`./img/browser.png`));
                    document.getElementById("publish").setAttribute("src", require(`./img/publish-full.png`));
                    document.getElementById("message").setAttribute("src", require(`./img/message.png`));
                    document.getElementById("me").setAttribute("src", require(`./img/me.png`));
                    return false

                }
                document.getElementById("a-browser").onclick = function () {
                    // console.log('没有用户登录信息')
                    _self.props.history.push('/browser')
                    // _self.setState({
                    //     whichClick:'',
                    // })
                    document.getElementById("home").setAttribute("src", require(`./img/home.png`));
                    document.getElementById("browser").setAttribute("src", require(`./img/browser-full.png`));
                    document.getElementById("publish").setAttribute("src", require(`./img/publish-full.png`));
                    document.getElementById("message").setAttribute("src", require(`./img/message.png`));
                    document.getElementById("me").setAttribute("src", require(`./img/me.png`));
                    return false

                }
                document.getElementById("a-publish").onclick = function () {
                    // console.log('没有用户登录信息')
                    _self.setState({
                        whichClick:'/publish',
                        loginRegisterModalVisible:true
                    })
                    // _self.setLoginRegisterModalVisible(true)

                    return false
                }
                document.getElementById("a-message").onclick = function () {
                    // console.log('没有用户登录信息')
                    _self.setState({
                        whichClick:'/message',
                        loginRegisterModalVisible:true
                    })
                    // _self.setLoginRegisterModalVisible(true)

                    return false
                }
                document.getElementById("a-me").onclick = function () {
                    // console.log('没有用户登录信息')
                    _self.setState({
                        whichClick:'/me',
                        loginRegisterModalVisible:true
                    })
                    // _self.setLoginRegisterModalVisible(true)

                    return false
                }

            }else if(res.status === 200 && res.data.code === 1 && res.data.msg === '有用户登录信息'){
                // console.log(res.data)
                // const {code,...userData} = res.data
                // console.log(userData)
                // console.log(this.props.location.pathname)
                if(document.getElementById("a-home") === null ){
                    return// 解决bug ：   刷新   ----立马单击> 问题
                }
                document.getElementById("a-home").onclick = function () {
                    // console.log('有用户登录信息')
                    // _self.setLoginRegisterModalVisible(false)
                    _self.props.history.push('/')
                    document.getElementById("home").setAttribute("src", require(`./img/home-full.png`));
                    document.getElementById("browser").setAttribute("src", require(`./img/browser.png`));
                    document.getElementById("publish").setAttribute("src", require(`./img/publish-full.png`));
                    document.getElementById("message").setAttribute("src", require(`./img/message.png`));
                    document.getElementById("me").setAttribute("src", require(`./img/me.png`));
                    return false

                }
                document.getElementById("a-browser").onclick = function () {
                    // console.log('有用户登录信息')
                    // _self.setLoginRegisterModalVisible(false)
                    _self.props.history.push('/browser')
                    document.getElementById("home").setAttribute("src", require(`./img/home.png`));
                    document.getElementById("browser").setAttribute("src", require(`./img/browser-full.png`));
                    document.getElementById("publish").setAttribute("src", require(`./img/publish-full.png`));
                    document.getElementById("message").setAttribute("src", require(`./img/message.png`));
                    document.getElementById("me").setAttribute("src", require(`./img/me.png`));
                    return false

                }
                document.getElementById("a-publish").onclick = function () {
                    // console.log('有用户登录信息')
                    // _self.setLoginRegisterModalVisible(false)
                    _self.props.history.push('/publish')
                    document.getElementById("home").setAttribute("src", require(`./img/home.png`));
                    document.getElementById("browser").setAttribute("src", require(`./img/browser.png`));
                    document.getElementById("publish").setAttribute("src", require(`./img/publish-full.png`));
                    document.getElementById("message").setAttribute("src", require(`./img/message.png`));
                    document.getElementById("me").setAttribute("src", require(`./img/me.png`));
                    return false
                }
                document.getElementById("a-message").onclick = function () {
                    // console.log('有用户登录信息')
                    // _self.setLoginRegisterModalVisible(false)
                    _self.props.history.push('/message')
                    document.getElementById("home").setAttribute("src", require(`./img/home.png`));
                    document.getElementById("browser").setAttribute("src", require(`./img/browser.png`));
                    document.getElementById("publish").setAttribute("src", require(`./img/publish-full.png`));
                    document.getElementById("message").setAttribute("src", require(`./img/message-full.png`));
                    document.getElementById("me").setAttribute("src", require(`./img/me.png`));
                    return false
                }
                document.getElementById("a-me").onclick = function () {
                    // console.log('有用户登录信息')
                    // _self.setLoginRegisterModalVisible(false)
                    _self.props.history.push('/me')
                    document.getElementById("home").setAttribute("src", require(`./img/home.png`));
                    document.getElementById("browser").setAttribute("src", require(`./img/browser.png`));
                    document.getElementById("publish").setAttribute("src", require(`./img/publish-full.png`));
                    document.getElementById("message").setAttribute("src", require(`./img/message.png`));
                    document.getElementById("me").setAttribute("src", require(`./img/me-full.png`));
                    return false
                }
                this.props.authDataSuccess(res.data.data)
                const _id = browserCookie.get('_id').split('"')[1]
                this.props.getMessageUnReadNum()

                // this.props.getLatestMessageUnReadNum(_id)// footer未读数 不正常
                // console.log(this.props.message.listeningLatestMessageList)
                if(this.props.message.listeningLatestMessageList === false){
                    this.props.listeningLatestMessageList();
                    this.props.getLatestMessageList(_id)// 消息列表未读数 正常

                }
                // console.log(1)
            }
        })
    }
    checkURL(){
        if(this.props.location.pathname === '/' || this.props.location.pathname === '/browser' || this.props.location.pathname === '/publish' || this.props.location.pathname === '/message' || this.props.location.pathname === '/me'){
            this.footerLink()// 管理footer <a href> 标签导航栏跳转 图标颜色 '/' '/browser' '/publish' '/message' '/me'
            this.authData()// 验证用户信息状态管理-是否有登录信息
        }
    }
    doLogin(){
        // console.log(this.state)
        const phoneReg=/^[1][34578][0-9]{9}$/;
        if(this.state.loginPhone === ''){
            message.error('请输入手机号');
        }else if(this.state.loginPassword === ''){
            message.error('请输入密码');
        }else if(this.state.loginPhone.length < 11){
            message.error('请输入正确的手机号');
        }else if(!phoneReg.test(this.state.loginPhone)) {
            message.error('请输入正确的手机号');
        }else{
            // message.success('doLogin OK');
            const _self = this
            this.setState({
                isClickDoLogin:true
            })
            axios.post('/doLogin',{phone:this.state.loginPhone, password:this.state.loginPassword}).then( res => {
                if(res.status=== 200 && res.data.code === 0 && res.data.msg === '后端数据库出错') {
                    message.error('后端数据库出错，请稍后再试！');
                }else if(res.status=== 200 && res.data.code === 0 && res.data.msg === '手机号或者密码错误'){
                    message.error('手机号或者密码错误！');
                }else if(res.status=== 200 && res.data.code === 1 && res.data.msg === '手机号登录成功'){
                    message.success('登录成功!');
                    this.props.doLogin({...res.data.data,msg:'登录成功!',userData:true})
                    _self.setLoginRegisterModalVisible(false)
                    this.props.history.push(this.state.whichClick)
                    this.footerLink()
                    this.authData()
                }
                _self.setState({
                    isClickDoLogin:false
                })
            })
        }
    }
    doRegister(){
        // console.log('doRegister')
        const nickNameReg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]")// 过滤昵称非法字符，防止数据库注入安全
        const passwordReg = new RegExp(" ")// 过滤密码非法字符，防止数据库注入安全
        const phoneReg=/^[1][34578][0-9]{9}$/;
        if(this.state.registerNickName === ''){
            message.error('请输入昵称');
        }else if(this.state.registerPhone === ''){
            message.error('请输入手机号');
        }else if(this.state.registerCaptcha_6 === ''){
            message.error('请输入验证码');
        }else if(this.state.registerPassword === ''){
            message.error('请输入密码');
        }else if(this.state.registerGender === ''){
            message.error('请选择性别');
        }else if(nickNameReg.test(this.state.registerNickName)) {
            message.error('昵称含有非法字符');
        }else if(this.state.registerPhone.length < 11){
            message.error('请输入正确的手机号');
        }else if(!phoneReg.test(this.state.registerPhone)) {
            message.error('请输入正确的手机号');
        }else if(passwordReg.test(this.state.registerPassword)) {
            message.error('密码含有非法字符');
        }else if(this.state.registerCaptcha_6 !== this.getBrowserCookie('captcha_6')){
            message.error('验证码错误');
        }else {
            const _self = this
            this.setState({
                isClickDoRegister:true
            })
            axios.post('/doRegister',{
                nickName:this.state.registerNickName,
                phone:this.state.registerPhone,
                password:this.state.registerPassword,
                gender:this.state.registerGender}).then( res => {
                if(res.status=== 200 && res.data.code === 0 && res.data.msg === '该手机号码已经被注册') {
                    message.error('该手机号码已经被注册！');
                }else if(res.status=== 200 && res.data.code === 0 && res.data.msg === '后端数据库出错') {
                    message.error('注册失败，后端数据库出错，稍后再试！');
                }else if(res.status=== 200 && res.data.code === 1 && res.data.msg === '手机号注册成功'){
                    // ==> redux

                    message.success('注册成功!');
                    browserCookie.erase('captcha_6')
                    _self.props.doRegister({...res.data.data,msg:'注册成功!',userData:true})
                    _self.setLoginRegisterModalVisible(false)
                    // if(this.state.whichClick === '/me'){
                    //     window.location.href="/me";// 重刷新 '/me'
                    //
                    // }else{
                    //     this.props.history.push(this.state.whichClick)
                    //
                    // }
                    _self.props.history.push(this.state.whichClick)
                    this.footerLink()
                    this.authData()
                }
                _self.setState({
                    isClickDoRegister:false
                })
            })

        }
    }
    footerLink(){
        if(this.props.location.pathname === '/') {
            document.getElementById("home").setAttribute("src", require(`./img/home-full.png`));
            document.getElementById("browser").setAttribute("src", require(`./img/browser.png`));
            document.getElementById("publish").setAttribute("src", require(`./img/publish-full.png`));
            document.getElementById("message").setAttribute("src", require(`./img/message.png`));
            document.getElementById("me").setAttribute("src", require(`./img/me.png`));
        }else if(this.props.location.pathname === '/browser'){
            document.getElementById("home").setAttribute("src", require(`./img/home.png`));
            document.getElementById("browser").setAttribute("src", require(`./img/browser-full.png`));
            document.getElementById("publish").setAttribute("src", require(`./img/publish-full.png`));
            document.getElementById("message").setAttribute("src", require(`./img/message.png`));
            document.getElementById("me").setAttribute("src", require(`./img/me.png`));
        }else if(this.props.location.pathname === '/publish'){
            document.getElementById("home").setAttribute("src", require(`./img/home.png`));
            document.getElementById("browser").setAttribute("src", require(`./img/browser.png`));
            document.getElementById("publish").setAttribute("src", require(`./img/publish-full.png`));
            document.getElementById("message").setAttribute("src", require(`./img/message.png`));
            document.getElementById("me").setAttribute("src", require(`./img/me.png`));
        }else if(this.props.location.pathname === '/message'){
            document.getElementById("home").setAttribute("src", require(`./img/home.png`));
            document.getElementById("browser").setAttribute("src", require(`./img/browser.png`));
            document.getElementById("publish").setAttribute("src", require(`./img/publish-full.png`));
            document.getElementById("message").setAttribute("src", require(`./img/message-full.png`));
            document.getElementById("me").setAttribute("src", require(`./img/me.png`));
        }else if(this.props.location.pathname === '/me'){
            document.getElementById("home").setAttribute("src", require(`./img/home.png`));
            document.getElementById("browser").setAttribute("src", require(`./img/browser.png`));
            document.getElementById("publish").setAttribute("src", require(`./img/publish-full.png`));
            document.getElementById("message").setAttribute("src", require(`./img/message.png`));
            document.getElementById("me").setAttribute("src", require(`./img/me-full.png`));
        }
    }
    handleChange = (e,key) => {
        // console.log(e)
        // console.log( e.target.value)
        // console.log(key)
        this.setState({
            [key]:e.target.value
        });
    }
    getCaptcha_6 = (e) => {
        // console.log(e.target.getElementsByTagName('span')[0].innerHTML)
        let registerCaptcha_6Title = e.target.getElementsByTagName('span')[0].innerHTML
        // return
        const phoneReg=/^[1][34578][0-9]{9}$/;
        if(this.state.registerPhone === ''){
            message.error('请输入手机号');
        }else if(this.state.registerPhone.length < 11){
            message.error('请输入正确的手机号');
        }else if(!phoneReg.test(this.state.registerPhone)) {
            message.error('请输入正确的手机号');
        }else{
            const _self = this
            axios.post('/checkPhoneRegister',{phone:this.state.registerPhone}).then( res => {
                if(res.status === 200 && res.data.code === 0 && res.data.msg === '后端数据库出错'){
                    message.error('后端数据库出错,请稍后再试！');
                }else if (res.status === 200 && res.data.code === 0 && res.data.msg === '该手机号码已经被注册') {
                    //手机号已经注册
                    message.error('该手机号码已经被注册');
                }else{
                    //手机号没有注册
                    axios.post('/getCaptcha_6',{phone:this.state.registerPhone}).then( res => {
                        if(res.status === 200 && res.data.code === 1 && res.data.msg === '验证码发送成功'){
                            console.log(res.data.Captcha)
                            message.success('验证码发送成功');
                            _self.setState({
                                isSendCaptcha_6:true,
                                registerCaptcha_6Title:'发送成功(60)'
                            });
                            let second = 59; // 59秒
                            let timer = setInterval(function () {
                                _self.setState({
                                    registerCaptcha_6Title:'发送成功('+second+')'
                                });
                                second--;
                                if(second < 0){
                                    clearInterval(timer);
                                    _self.setState({
                                        registerCaptcha_6Title:'重新获取',
                                        isSendCaptcha_6:false
                                    })
                                }
                            },1000)
                        }else{
                            message.error('请稍后再试！');
                        }
                    })
                }
            })
        }
    }
    getBrowserCookie(key) {
        let cookieArr = document.cookie.split('; ');
        for(let i = 0; i < cookieArr.length; i++) {
            let arr = cookieArr[i].split('=');
            if(arr[0] === key) {
                return arr[1];
            }
        }
        return false;
    }
    setLoginRegisterModalVisible(modalVisible) {
        this.setState({ loginRegisterModalVisible:modalVisible });
        // this.props.user.loginRegisterModalVisible = modalVisible
    }
    showRegister(){
        // 显示registerModal
        // console.log('showRegister')
        this.setState({
            showRegister:true,
            loginRegisterModalTitle:"请注册"
        })
    }
    showLogin(){
        // 显示loginModal
        this.setState({
            showRegister:false,
            loginRegisterModalTitle:"请登录"
        })
    }
    render(){
        const RadioGroup = Radio.Group;
        const RadioButton = Radio.Button;
        // console.log('render')
        // console.log(this.props.location)
        // console.log(this.props)
        return(
            <div>
                <Switch>
                    <Route path="/browser" component={Browser}/>
                    <Route path="/publish" component={Publish}/>
                    <Route path="/message" component={Message}/>
                    <Route path="/me" component={Me}/>
                    <Route path="/" component={Home}/>
                </Switch>
                <Modal
                    title={this.state.loginRegisterModalTitle}
                    // wrapClassName="vertical-center-modal"
                    style={{ top: 0 }}
                    closable={false}
                    footer={null}
                    visible={this.state.loginRegisterModalVisible}
                    onOk={() => this.setLoginRegisterModalVisible(false)}
                    onCancel={() => this.setLoginRegisterModalVisible(false)}
                >
                    {this.state.showRegister === false ? (
                        <div className="login">
                            <Input placeholder="手机号" value={this.state.loginPhone} maxLength={11} onChange={e => this.handleChange(e,'loginPhone')}/>
                            <br/><br/>
                            <Input placeholder="密码" value={this.state.loginPassword} type='password' maxLength={20} onChange={e => this.handleChange(e,'loginPassword')}/>
                            <br/><br/>
                            <Button onClick={this.doLogin} disabled={this.state.isClickDoLogin} type="primary" size='large' style={{width:'100%'}}>登录</Button>
                            <br/><br/>
                            <a onClick={() => {this.props.history.push('/forget');return false}}>忘记密码?</a>
                            <br/><br/>
                            <div className="hr"/>
                            <span style={{lineHeight:'40px'}}>没有账号？</span>
                            <Button className='register' type="normal" size='large' style={{float:'right'}} onClick={()=>this.showRegister()}>注册</Button>
                            <br/><br/>
                        </div>
                    ) : (
                        <div className="register">
                            <Input placeholder="昵称" value={this.state.registerNickName} maxLength={15} onChange={e => this.handleChange(e,'registerNickName')}/>
                            <br/><br/>
                            <Input placeholder="手机号" value={this.state.registerPhone} maxLength={11} onChange={e => this.handleChange(e,'registerPhone')}/>
                            <br/><br/>
                            <Input placeholder="输入6位验证码" value={this.state.registerCaptcha_6} style={{marginRight:'2%',width:'68%'}}  maxLength={6} onChange={e => this.handleChange(e,'registerCaptcha_6')}/>
                            <Button onClick={e => this.getCaptcha_6(e)} disabled={this.state.isSendCaptcha_6} type="normal"  style={{padding:'0',width:'30%',color:'#1890ff'}}>{this.state.registerCaptcha_6Title}</Button>
                            <br/><br/>
                            <Input placeholder="密码" value={this.state.registerPassword} type='password' maxLength={20}  onChange={e => this.handleChange(e,'registerPassword')}/>
                            <br/><br/>
                            <RadioGroup value={this.state.registerGender} onChange={e => this.handleChange(e,'registerGender')}>
                                <RadioButton value="男">男</RadioButton>
                                <RadioButton value="女">女</RadioButton>
                            </RadioGroup>
                            <br/><br/>
                            <Button onClick={this.doRegister} disabled={this.state.isClickDoRegister} type="primary" size='large' style={{width:'100%'}}>注册</Button>
                            <br/><br/>
                            <div className="hr"/>
                            <span style={{lineHeight:'40px'}}>已经有账号了？</span>
                            <Button className='login' type="normal" size='large' style={{float:'right'}} onClick={()=>this.showLogin()}>登录</Button>
                        </div>
                    )}
                </Modal>

                <div className="footer">
                    <a id='a-home' onClick={ () => {this.props.history.push('/'); return false;}} className="">
                        <Badge dot>
                            <img id='home' src={require(`./img/home-full.png`)} alt=""/>
                        </Badge>
                        <br/>
                        <span className="title">主页</span>
                    </a>
                    <a id='a-browser' onClick={ () => {this.props.history.push('/browser'); return false;}}   className="browser">
                        <Badge dot>
                            <img id='browser' src={require(`./img/browser.png`)} alt=""/>
                        </Badge>
                        <br/>
                        <span className="title">发现</span>
                    </a>
                    <a id='a-publish' onClick={ () => {this.props.history.push('/publish'); return false;}}  className="">
                        <img id='publish' src={require(`./img/publish-full.png`)} alt=""/>
                        <br/>
                        <span className="title">发布</span>
                    </a>
                    <a id='a-message' onClick={ () => {this.props.history.push('/message'); return false;}}  className="">
                        <Badge showZero={false} count={this.props.message.messageUnRead}>
                            <img id='message' src={require(`./img/message.png`)} alt=""/>
                            {/*<span className="head-example" >123</span>*/}
                        </Badge>
                        <br/>
                        <span className="title">消息</span>
                    </a>
                    <a id='a-me' onClick={ () => {this.props.history.push('/me'); return false;}}  className="">
                        <img id='me' src={require(`./img/me.png`)} alt=""/>
                        <br/>
                        <span className="title">我的</span>
                    </a>
                </div>
            </div>
        )
    }
    componentWillUnmount () {
        console.log('componentWillUnmount')
        // this.authData().stop
    }
}
export default FooterLink