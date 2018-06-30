import React from 'react'
import {connect} from 'react-redux'
import {Icon,Badge,Radio,message,Input,Button,Modal} from 'antd'
// import "http://api.map.baidu.com/api?v=2.0&ak=M05qedibl4EZMvP99dENF6AjVIdNzpcB"f



import axios from 'axios'
import './browser.css'
import {doRegister,doLogin,authDataSuccess} from '../../redux/redux.user'
import {getHaveALookData} from '../../redux/redux.browser'
import {getMessageUnReadNum,listeningLatestMessageList,getLatestMessageList} from '../../redux/redux.message'

import browserCookie from 'browser-cookies'

@connect(
    state => state,
    {getHaveALookData,authDataSuccess,doRegister,doLogin,getMessageUnReadNum,listeningLatestMessageList,getLatestMessageList}
)
class Browser extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            reload_haveALook:false,// 是否换一换??

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
        this.reload_haveALook = this.reload_haveALook.bind(this)
        this.doLogin = this.doLogin.bind(this)
        this.doRegister = this.doRegister.bind(this)
    }
    componentDidMount(){
        // console.log('componentDidMount')
        // this.getLocation()
        // this.guessYouLike()
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
        if(!this.props.browser.haveALookData){
            this.haveALook()
        }


    }
    componentDidUpdate(){
        // console.log('componentDidUpdate')

    }
    // 获取地理位置
    getLocation(){


    }
    guessYouLike(){
        // axios.post('/guessYouLike').then( res => {
        //     console.log(res)
        // })
    }
    haveALook(){
        axios.post('/haveALook').then( res => {
            if(res.status === 200 && res.data.code === 1 && res.data.msg ==='获取随便看看成功!'){
                // console.log(res.data)
                this.props.getHaveALookData(res.data.haveALookData)
            }

        })
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
    reload_haveALook(){
        if(this.state.reload_haveALook === false){
            this.setState({
                reload_haveALook:true
            })
            axios.post('/haveALook').then( res => {
                if(res.status === 200 && res.data.code === 1 && res.data.msg ==='获取随便看看成功!'){
                    // console.log(res.data)
                    this.props.getHaveALookData(res.data.haveALookData)
                }
                this.setState({
                    reload_haveALook:false
                })
            })

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
        const RadioGroup = Radio.Group;
        const RadioButton = Radio.Button;
        return(
            <div style={{padding:'50px 0 70px 0'}}>
                <div className="browser-header" style={{}}>
                    <span>发现</span>
                </div>
                {/*<p>猜你喜欢</p>*/}
                <p style={{fontWeight:'bold',margin:'10px '}}>随便看看
                    {this.state.reload_haveALook === false ? (<span onClick={this.reload_haveALook} style={{float:'right',color:'grey'}}>换一换</span>) : (<span onClick={this.reload_haveALook} style={{float:'right',color:'grey',marginRight:'13px'}}><Icon type="sync" spin={this.state.reload_haveALook}/></span>)}


                </p>


                {this.props.browser.haveALookData === undefined ? (null) : (
                    <div key={this.props.browser.haveALookData._id} className="haveALook-detail" >
                        <div className="top" >
                            <img onClick={() => this.redirectToUser(`${this.props.browser.haveALookData.publisher}`)} src={this.props.browser.haveALookData.avatarName} alt="" style={{width:'40px',height:'40px',borderRadius:'100%',display:'inline-block',lineHeight:'40px'}} />
                            <span style={{marginLeft:'13px',fontWeight:'bold',lineHeight:'40px'}}>{this.props.browser.haveALookData.nickName}</span>
                            <span style={{float:'right',color:'red',fontWeight:'bold',lineHeight:'40px',marginRight:'10px'}}>￥{this.props.browser.haveALookData.price}</span>
                        </div>
                        <div className="middle">

                        </div>
                        <div className="bottom"  onClick={() => this.props.history.push(`/publishDetails/${this.props.browser.haveALookData._id}`)}>
                            <p style={{margin:'5px 0',paddingLeft:'5px'}}><span style={{fontWeight:'bold'}}>{this.props.browser.haveALookData.title}</span></p>
                            <div className="mainImg_3">
                                <div><img src={this.props.browser.haveALookData.mainImg_3[0]} alt=""/></div>
                                <div><img src={this.props.browser.haveALookData.mainImg_3[1]} alt=""/></div>
                                <div><img src={this.props.browser.haveALookData.mainImg_3[2]} alt=""/></div>
                            </div>
                            <p style={{overflow: 'hidden', textOverflow:'ellipsis', whiteSpace: 'nowrap',marginTop:'15px',paddingTop:'5px'}}>{this.props.browser.haveALookData.description}</p>
                        </div>
                    </div>
                )}



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
                    <a id='a-home' onClick={ () => this.goToHomePage()} className="">
                        {/*<Badge dot>*/}
                            {/*<img id='home' src={require(`./img/home-full.png`)} alt=""/>*/}
                            <Icon type="home" />
                        {/*</Badge>*/}
                        <br/>
                        <span className="title">主页</span>
                    </a>
                    <a id='a-browser' onClick={ () => this.goToBrowserPage()}   className="active">
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
}
export default Browser