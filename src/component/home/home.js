import React from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import './home.css'
import { Carousel, AutoComplete,Divider,Icon,Spin,BackTop,Badge,Radio,message,Input,Button,Modal} from 'antd';
import  {  Link, } from 'react-router-dom'
import {doRegister,doLogin,authDataSuccess} from '../../redux/redux.user'
import {setSearchBoxTextValue,getFreshPublishList,getMoreFreshPublishList,getHotPublishList,getMoreHotPublishList,active_Fresh_Hot,setScrollTopValue,setHotScrollTopValue,setFreshScrollTopValue,fresh_noMore,hot_noMore} from '../../redux/redux.home'
import {getMessageUnReadNum,getLatestMessageUnReadNum,listeningLatestMessageList,getLatestMessageList} from '../../redux/redux.message'

import browserCookie from 'browser-cookies'
import $ from 'jquery'
import home_picture_1 from './img/home-1.jpg'
import home_picture_2 from './img/home-2.PNG'
import home_picture_3 from './img/home-3.JPG'
import home_picture_4 from './img/home-4.JPG'


@connect(
    state => state,
    {authDataSuccess,doRegister,doLogin,getMessageUnReadNum,listeningLatestMessageList,getLatestMessageList,setSearchBoxTextValue,getFreshPublishList,getMoreFreshPublishList,getHotPublishList,getMoreHotPublishList,active_Fresh_Hot,setScrollTopValue,setHotScrollTopValue,setFreshScrollTopValue,fresh_noMore,hot_noMore}
)
class Index extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            result: [],
            sendAjaxGetMoreFreshPublish:false,//是否发送ajax获取更多 fresh数据
            sendAjaxGetMoreHotPublish:false,//是否发送ajax获取更多 hot数据

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
        this.onSelect = this.onSelect.bind(this)
        this.doLogin = this.doLogin.bind(this)
        this.doRegister = this.doRegister.bind(this)
    }
    componentWillDidMount(){
        // console.log('componentWillDidMount')

    }
    componentDidMount(){
        // console.log('componentDidMount')
        // console.log(this.props.home.active_Fresh_Hot)
        if(!this.props.user.userData) {
            this.authData()
        }else{
            const _id = browserCookie.get('_id').split('"')[1]
            // this.props.getMessageUnReadNum()
            if(this.props.message.listeningLatestMessageList === false){
                this.props.listeningLatestMessageList();
                this.props.getMessageUnReadNum()
                this.props.getLatestMessageList(_id)// 消息列表未读数 正常
            }
        }


        const _self = this

        if(this.props.home.active_Fresh_Hot === 'fresh'){
            // $('div.fresh-hot span').removeClass()
            $('div.fresh-hot span.fresh').addClass('active')
            $('div.fresh').css({'display':'block'})
            $('div.hot').css({'display':'none'})
        }else{
            // $('div.fresh-hot span').removeClass()
            $('div.fresh-hot span.hot').addClass('active')
            $('div.fresh').css({'display':'none'})
            $('div.hot').css({'display':'block'})
        }


        $('div.fresh-hot span.fresh').on('click',function () {
            $('div.fresh-hot span').removeClass()
            $(this).addClass('active')
            if(_self.props.home.active_Fresh_Hot === 'hot'){
                if($(window).scrollTop() < 167){
                    _self.props.setHotScrollTopValue($(window).scrollTop())
                    $('div.fresh').css({'display':'block'})
                    $('div.hot').css({'display':'none'})
                }else{
                    _self.props.setHotScrollTopValue($(window).scrollTop())
                    if(_self.props.home.fresh_ScrollTop < 220 - 52.5){
                        $('div.fresh').css({'display':'block'})
                        $('div.hot').css({'display':'none'})
                        window.scrollTo(0, 220 - 52.5)// 没动画
                    }else{
                        $('div.fresh').css({'display':'block'})
                        $('div.hot').css({'display':'none'})
                        window.scrollTo(0,_self.props.home.fresh_ScrollTop)// 没动画
                    }
                }
            }
            _self.props.active_Fresh_Hot('fresh')
        })
        $('div.fresh-hot span.hot').on('click',function () {
            $('div.fresh-hot span').removeClass()
            $(this).addClass('active')
            if(_self.props.home.active_Fresh_Hot === 'fresh'){
                if($(window).scrollTop() < 167){
                    _self.props.setFreshScrollTopValue($(window).scrollTop())
                    $('div.fresh').css({'display':'none'})
                    $('div.hot').css({'display':'block'})
                }else{
                    _self.props.setFreshScrollTopValue($(window).scrollTop())
                    if(_self.props.home.hot_ScrollTop < 220 - 52.5){
                        $('div.fresh').css({'display':'none'})
                        $('div.hot').css({'display':'block'})
                        window.scrollTo(0, 220 - 52.5)// 没动画
                    }else{
                        $('div.fresh').css({'display':'none'})
                        $('div.hot').css({'display':'block'})
                        window.scrollTo(0,_self.props.home.hot_ScrollTop)// 没动画
                    }
                }
            }
            _self.props.active_Fresh_Hot('hot')

        })
        this.getBannerData()
        // console.log(this.props.home.freshPublishList.length)
        if(this.props.home.freshPublishList.length === 0){
            this.getFreshPublish()
        }
        if(this.props.home.hotPublishList.length === 0){
            this.getHotPublish()
        }

        // document.body.scrollHeight - document.documentElement.clientHeight - $(window).scrollTop()

        $(window).on('scroll',function(){
            _self.setState({
                scrollTop:$(window).scrollTop()
            })
            // console.log(document.body.scrollHeight - document.documentElement.clientHeight - $(window).scrollTop() < 400)
            // console.log(document.body.scrollHeight)// 文档的高度
            // console.log(document.documentElement.clientHeight)// 屏幕的高度
            // console.log($(window).scrollTop())// 客户端可视到顶端的高度
            // console.log($('div.fresh-hot').offset().top)

            if($(window).scrollTop() > 220 - 52.5){
                // console.log(1)
                $('div.container').css({paddingTop:'44px'})
                $('div.fresh-hot').css({'position':'fixed','top':'52px','width':'100%','zIndex':'1000'})
            }else{
                $('div.container').css({paddingTop:'0'})

                $('div.fresh-hot').css({'position':'relative','top':'0','width':'100%','zIndex':'1000'})

            }
        })
        if(this.props.home.scrollTop !== null){
            window.scrollTo(0,_self.props.home.scrollTop)// 没动画
            // setTimeout(function () {
            //     window.scrollTo(0,_self.props.home.scrollTop)// 没动画
            // })
        }


        $(window).on('scroll',function(){
            // console.log(document.body.scrollHeight)// 文档的高度
            // console.log(document.documentElement.clientHeight)// 屏幕的高度
            // console.log($(window).scrollTop())// 客户端可视到顶端的高度

            // 是否为首页
            if(_self.props.home.isHomePage){

                if(document.body.scrollHeight > document.documentElement.clientHeight){//
                    // console.log(document.body.scrollHeight - document.documentElement.clientHeight - $(window).scrollTop() < 400)
                    // 屏幕是否滚动到底部
                    if(document.body.scrollHeight - document.documentElement.clientHeight - $(window).scrollTop() < 300){
                        // 新鲜的 ? 最热的 ?
                        // console.log(_self.props.home.active_Fresh_Hot)
                        if(_self.props.home.active_Fresh_Hot === 'fresh'){
                            // 获取更多 fresh
                            if(_self.props.home.ajax_getMoreFreshPublish === false){
                                _self.props.home.ajax_getMoreFreshPublish = true
                                axios.post('/getMoreFreshPublish',{freshPublishList_Timestamp:_self.props.home.freshPublishList_Timestamp}).then( res => {
                                    if(res.status === 200 && res.data.code === 1 && res.data.msg === '获取更多新鲜的成功!'){
                                        _self.props.getMoreFreshPublishList(res.data.freshPublishList)
                                    }else{
                                        // $('div.fresh div.no-more').css({display:'block'})
                                        _self.props.fresh_noMore()
                                    }
                                })
                            }
                        }else{
                            // 获取更多 hot
                            if(_self.props.home.ajax_getMoreHotPublish === false){
                                _self.props.home.ajax_getMoreHotPublish = true
                                const timeStamp_3Days = new Date().getTime() - 1000 * 60 * 60 * 24 * 3// 3天前的时间戳
                                axios.post('/getMoreHotPublish',{timeStamp_3Days,hotPublishList_Length:_self.props.home.hotPublishList.length,hotPublishList_Timestamp:_self.props.home.hotPublishList_Timestamp}).then( res => {
                                    if(res.status === 200 && res.data.code === 1 && res.data.msg === '获取更多最热的成功!'){
                                        let moreHotPublishList = []
                                        for(let i = 0; i < res.data.hotPublishList.length; i++){
                                            let flag = false
                                            for(let j = 0; j < _self.props.home.hotPublishList.length; j++){
                                                if(res.data.hotPublishList[i].publishTime ===  _self.props.home.hotPublishList[j].publishTime){
                                                    flag = true
                                                }
                                            }
                                            if(flag === false){
                                                moreHotPublishList.push(res.data.hotPublishList[i])
                                            }
                                            flag = false
                                        }
                                        if(moreHotPublishList.length !== 0 ){
                                            _self.props.getMoreHotPublishList(moreHotPublishList)
                                        }else{
                                            // $('div.hot div.no-more').css({display:'block'})
                                            _self.props.hot_noMore()

                                        }
                                    }else{
                                        // $('div.hot div.no-more').css({display:'block'})
                                        _self.props.hot_noMore()

                                    }

                                })
                            }
                        }
                    }else{

                    }

                }
            }

        })


    }
    componentDidUpdate(){
        // console.log('componentDidUpdate')

    }
    handleSearch = (value) => {
        let result;
        if(value.trim().length !== 0){
            result = [`搜索用户“${value}”`,`搜索物品“${value}”`]
        }else{
            result = []
        }
        this.props.setSearchBoxTextValue(value)
        this.setState({ result });

    }
    // 获取横条
    getBannerData(){
        // console.log('getBannerData')

    }
    // 获取 新鲜的
    getFreshPublish(){
        // console.log('getFreshPublish')
        // console.log(this.props.home.freshPublishList)
        if(this.props.home.ajax_getFreshPublish === false){
            this.props.home.ajax_getFreshPublish = true
            axios.post('/getFreshPublish').then( res => {
                if(res.status === 200 && res.data.code === 1 && res.data.msg === '获取新鲜的成功!'){
                    // console.log(1)
                    // console.log(res.data.freshPublishList)
                    // this.setState({freshPublishList:res.data.freshPublishList})
                    this.props.getFreshPublishList(res.data.freshPublishList)

                }else{
                    // console.log(2)
                }

            })
        }


    }
    // 获取 更多 新鲜的
    getMoreFreshPublish(){

    }
    // 获取 最热的
    getHotPublish(){
        // console.log('getHotPublish')

        if(this.props.home.ajax_getHotPublish === false){
            this.props.home.ajax_getHotPublish = true
            const timeStamp_3Days = new Date().getTime() - 1000 * 60 * 60 * 24 * 3// 3天前的时间戳
            // console.log(nowTime)
            // console.log(oneWeekTimestamp)
            axios.post('/getHotPublish',{timeStamp_3Days}).then( res => {
                if(res.status === 200 && res.data.code === 1 && res.data.msg === '获取最热的成功!'){
                    // console.log(1)
                    // console.log(res.data.freshPublishList)
                    // this.setState({freshPublishList:res.data.freshPublishList})
                    this.props.getHotPublishList(res.data.hotPublishList)

                }else{
                    // console.log(2)

                }

            })
        }


    }
    // 获取 更多 最热的
    getMoreHotPublish(){

    }
    onSelect = (value, option) => {
        if(value === this.state.result[0]){
            this.props.history.push(`/searchUser/${this.props.home.searchBoxText}`)
        }else{
            this.props.history.push(`/searchPublish/${this.props.home.searchBoxText}`)
        }
        this.props.setSearchBoxTextValue('')
        this.setState({ result:[] });
    }
    redirectToUser(_id){
        if(browserCookie.get('_id') === null){
            this.props.history.push(`/user/${_id}`)
        }else{
            if(_id === browserCookie.get('_id').split('"')[1]){
                this.props.history.push(`/me`)

            }else{
                this.props.history.push(`/user/${_id}`)
            }
        }

    }


    authData(){
        // console.log(this.props)
        // console.log(this.props.user.userData)
        if(this.props.user.userData === undefined){
            // console.log('undefined')
            axios.post('/authData').then( res => {
                if(res.status === 200 && res.data.code === 0 && res.data.msg === '没有用户登录信息'){

                }else if(res.status === 200 && res.data.code === 0 && res.data.msg === '后端数据库出错'){

                }else if(res.status === 200 && res.data.code === 1 && res.data.msg === '有用户登录信息'){
                    this.props.authDataSuccess(res.data.data)
                    const _id = browserCookie.get('_id').split('"')[1]
                    this.props.getMessageUnReadNum()
                    if(this.props.message.listeningLatestMessageList === false){
                        this.props.listeningLatestMessageList();
                        this.props.getLatestMessageList(_id)// 消息列表未读数 正常
                    }
                }
            })
        }else{
            // console.log('no')

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
                    // this.authData()
                    this.props.authDataSuccess(res.data.data)
                    const _id = browserCookie.get('_id').split('"')[1]
                    this.props.getMessageUnReadNum()
                    if(this.props.message.listeningLatestMessageList === false){
                        this.props.listeningLatestMessageList();
                        this.props.getLatestMessageList(_id)// 消息列表未读数 正常
                    }
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
                    // this.authData()
                    this.props.authDataSuccess(res.data.data)
                    const _id = browserCookie.get('_id').split('"')[1]
                    this.props.getMessageUnReadNum()
                    if(this.props.message.listeningLatestMessageList === false){
                        this.props.listeningLatestMessageList();
                        this.props.getLatestMessageList(_id)// 消息列表未读数 正常
                    }
                }
                _self.setState({
                    isClickDoRegister:false
                })
            })

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
    goToHomePage(){
        this.props.history.push('/')
    }
    goToBrowserPage(){
        this.props.history.push('/browser')
    }
    goToPublishPage(){
        // console.log(this.props)
        // console.log(this.props.user.userData)
        if(!this.props.user.userData){
            this.setState({ loginRegisterModalVisible:true ,whichClick:'/publish'});
        }else{
            this.props.history.push('/publish')
        }
    }
    goToMessagePage(){
        // console.log(this.props.user.userData)
        if(!this.props.user.userData){
            this.setState({ loginRegisterModalVisible:true ,whichClick:'/message'});
        }else{
            this.props.history.push('/message')
        }
    }
    goToMePage(){
        // console.log(this.props.user.userData)
        if(!this.props.user.userData){
            this.setState({ loginRegisterModalVisible:true ,whichClick:'/me'});
        }else{
            this.props.history.push('/me')
        }
    }
    render(){
        const Option = AutoComplete.Option;
        const searchResult = this.state.result.map((value) => {
            return <Option key={value}>{value}</Option>;
        });
        const RadioGroup = Radio.Group;
        const RadioButton = Radio.Button;
        return(
            <div style={{padding:'50px 0 70px 0'}}>
                <BackTop />
                <div className="search-box" style={{position:'fixed',top:'0',zIndex:'1000',width:'100%',backgroundColor:'#f9fbff',boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'}}>
                    <AutoComplete
                        value={this.props.home.searchBoxText}
                        style={{ width: '100%' }}
                        onSearch={this.handleSearch}
                        placeholder="搜索..."
                        onSelect={this.onSelect}
                        allowClear={true}
                        // maxLength={20}
                    >
                        {searchResult}
                    </AutoComplete>
                </div>
                <div className="banner">
                    <Carousel autoplay>
                        {/*<div><Link to="/browser"><h3>1</h3></Link></div>*/}
                        {/*<div><h3>空</h3></div>*/}
                        {/*<div><h3>空</h3></div>*/}
                        {/*<div><h3>如</h3></div>*/}
                        {/*<div><h3>也</h3></div>*/}
                        <div className="banner-picture">
                            <img src={home_picture_1} style={{position:'relative',top:'-35px'}} alt=""/>
                        </div>
                        <div className="banner-picture">
                            <img src={home_picture_2} style={{position:'relative',top:'-70px'}} alt=""/>
                        </div>
                        <div className="banner-picture">
                            <img src={home_picture_3} style={{position:'relative',top:'-15px'}} alt=""/>
                        </div>
                        <div className="banner-picture">
                            <img src={home_picture_4} style={{position:'relative',top:'-155px'}} alt=""/>
                        </div>

                    </Carousel>
                </div>
                <div className="container">
                    <div className="fresh-hot">
                        <div>
                            <span className="fresh">新 鲜 的</span>
                        </div>
                        <div>
                            <span className="hot">最 热 的</span>
                        </div>
                    </div>
                    <div className="fresh">
                        {this.props.home.freshPublishList === undefined
                            ? (null)
                            : (
                                <div>
                                    {this.props.home.freshPublishList.map( value => {
                                        return (
                                            <div key={value._id} className="freshPublishList-detail" >
                                                <div className="top" >
                                                    <img onClick={() => this.redirectToUser(`${value.publisher}`)} src={value.avatarName} alt="" style={{width:'40px',height:'40px',borderRadius:'100%',display:'inline-block',lineHeight:'40px'}} />
                                                    <span style={{marginLeft:'13px',fontWeight:'bold',lineHeight:'40px'}}>{value.nickName}</span>
                                                    <span style={{float:'right',color:'red',fontWeight:'bold',lineHeight:'40px',marginRight:'10px'}}>￥{value.price}</span>
                                                </div>
                                                <div className="middle">

                                                </div>
                                                <div className="bottom"  onClick={() => this.props.history.push(`/publishDetails/${value._id}`)}>
                                                    <p style={{margin:'5px 0',paddingLeft:'5px'}}><span style={{fontWeight:'bold'}}>{value.title}</span></p>
                                                    <div className="mainImg_3">
                                                        <div><img src={value.mainImg_3[0]} alt=""/></div>
                                                        <div><img src={value.mainImg_3[1]} alt=""/></div>
                                                        <div><img src={value.mainImg_3[2]} alt=""/></div>
                                                    </div>
                                                    <p style={{overflow: 'hidden', textOverflow:'ellipsis', whiteSpace: 'nowrap',marginTop:'15px',paddingTop:'5px'}}>{value.description}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <div className="loading" style={{textAlign:'center',width:'100%'}}>
                                        {/*<Spin  indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} />*/}
                                    </div>
                                    {this.props.home.fresh_noMore === true ? (
                                        <div className="no-more" style={{textAlign:'center',width:'100%'}}>
                                            <h4 style={{color:'gray'}}>没有更多了</h4>
                                        </div>
                                    ) : (null)}

                                </div>
                            )
                        }
                    </div>
                    <div className="hot">
                        {this.props.home.hotPublishList === undefined
                            ? (null)
                            : (
                                <div>
                                    {this.props.home.hotPublishList.map( value => {
                                        return (
                                            <div key={value._id} className="hotPublishList-detail" >
                                                <div className="top" >
                                                    <img onClick={() => this.redirectToUser(`${value.publisher}`)} src={value.avatarName} alt="" style={{width:'40px',height:'40px',borderRadius:'100%',display:'inline-block',lineHeight:'40px'}} />
                                                    <span style={{marginLeft:'13px',fontWeight:'bold',lineHeight:'40px'}}>{value.nickName}</span>
                                                    <span style={{float:'right',color:'red',fontWeight:'bold',lineHeight:'40px',marginRight:'10px'}}>￥{value.price}</span>
                                                </div>
                                                <div className="middle">

                                                </div>
                                                <div className="bottom"  onClick={() => this.props.history.push(`/publishDetails/${value._id}`)}>
                                                    <p style={{margin:'5px 0',paddingLeft:'5px'}}><span style={{fontWeight:'bold'}}>{value.title}</span></p>
                                                    <div className="mainImg_3">
                                                        <div><img src={value.mainImg_3[0]} alt=""/></div>
                                                        <div><img src={value.mainImg_3[1]} alt=""/></div>
                                                        <div><img src={value.mainImg_3[2]} alt=""/></div>
                                                    </div>
                                                    <p style={{overflow: 'hidden', textOverflow:'ellipsis', whiteSpace: 'nowrap',marginTop:'15px',paddingTop:'5px'}}>{value.description}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {this.props.home.hot_noMore === true ? (
                                        <div className="no-more" style={{textAlign:'center',width:'100%'}}>
                                            <h4 style={{color:'gray'}}>没有更多了</h4>
                                        </div>
                                    ) : (null)}
                                </div>

                            )
                        }
                    </div>
                </div>


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

                <div className="footerLink">
                    <a id='a-home' onClick={ () => this.goToHomePage()} className="active">
                        {/*<Badge dot>*/}
                            {/*<img id='home' src={require(`./img/home-full.png`)} alt=""/>*/}
                            <Icon type="home" />
                        {/*</Badge>*/}
                        <br/>
                        <span className="title">主页</span>
                    </a>
                    <a id='a-browser' onClick={ () => this.goToBrowserPage()}   className="">
                        {/*<Badge dot>*/}
                            {/*<img id='browser' src={require(`./img/browser.png`)} alt=""/>*/}
                            <Icon type="eye-o" />
                        {/*</Badge>*/}
                        <br/>
                        <span className="title">发现</span>
                    </a>
                    <a id='a-publish' onClick={ () => this.goToPublishPage()}  className="active">
                        {/*<img id='publish' src={require(`./img/publish-full.png`)} alt=""/>*/}
                        <Icon type="plus-circle" />
                        <br/>
                        <span className="title">发布</span>
                    </a>
                    <a id='a-message' onClick={ () => this.goToMessagePage()}  className="">
                        <Badge showZero={false} count={this.props.message.messageUnRead} overflowCount={99}>
                            {/*<img id='message' src={require(`./img/message.png`)} alt=""/>*/}
                            <Icon type="message" />
                            {/*<span className="head-example" >123</span>*/}
                        </Badge>
                        <br/>
                        <span className="title">消息</span>
                    </a>
                    <a id='a-me' onClick={ () => this.goToMePage()}  className="">
                        {/*<img id='me' src={require(`./img/me.png`)} alt=""/>*/}
                        <Icon type="user" />
                        <br/>
                        <span className="title">我的</span>
                    </a>
                </div>


            </div>
        )
    }
    componentWillUnmount(){
        // console.log($(window).scrollTop())
        this.props.setScrollTopValue( $(window).scrollTop() )// 距离最顶部
        this.props.home.isHomePage = false// 不是首页
    }
}
export default Index