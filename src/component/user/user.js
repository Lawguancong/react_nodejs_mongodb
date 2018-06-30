import React from 'react'
import {Icon,Card,Avatar,Button,message,Popconfirm,Input,Badge ,Modal , Radio, } from 'antd'
import './user.css'
import {connect} from 'react-redux'
import axios from 'axios'
import browserCookie from 'browser-cookies'
import {doRegister,doLogin,authDataSuccess} from '../../redux/redux.user'


const { Meta } = Card;

@connect(
    state => state,
    {doRegister,doLogin,authDataSuccess}
)
class User extends React.Component{
    constructor(props){
        super(props)
        this.state = {
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
        this.goToChat = this.goToChat.bind(this)
    }
    componentDidMount(){
        // console.log(this.state)
        axios.post('/getUserData',{_id:this.props.match.params._id}).then( res => {
            if(res.status === 200 && res.data.code ===1 && res.data.msg ==='获取对方用户信息成功'){
                // console.log(res.data.userData)
                this.setState({
                    ...res.data.userData,
                    isFocus:res.data.isFocus
                })
            }
        })
    }
    componentDidUpdate(){
        // console.log(this.state)
        // console.log(this.state._id)
        if(browserCookie.get('_id') !== null ){
            if(browserCookie.get('_id').split('"')[1] === this.props.match.params._id){
                this.props.history.push('/me')
            }
        }
    }
    goBack(){
        this.props.history.goBack()
    }
    doFocus(){
        // console.log(this.props.match.params._id)
        const focusTime = new Date().getTime()
        axios.post('/doFocus',{focusObjectId:this.props.match.params._id,focusTime}).then( res => {
            if(res.status === 200 && res.data.code === 0 && res.data.msg === '请您先登录!'){
                // message.error('请您先登录!')
                this.setLoginRegisterModalVisible(true)
                // this.props.history.push('/me')
            }else if(res.status === 200 && res.data.code === 1 && res.data.msg === '关注成功'){
                message.success('关注成功！')
                this.setState({
                    isFocus:true,
                    fans:this.state.fans + 1
                })
            }
        })
    }
    cancelFocus(){
        axios.post('/cancelFocus',{focusObjectId:this.props.match.params._id}).then( res => {
            if(res.status === 200 && res.data.code === 1 && res.data.msg === '取消关注成功'){
                this.setState({
                    isFocus:false,
                    fans:this.state.fans - 1
                })
            }
        })
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
                    // this.props.history.push(this.state.whichClick)
                    // window.location.reload();
                    // this.authData()
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
                    // _self.props.history.push(this.state.whichClick)
                    // this.footerLink()
                    // this.authData()
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
    goToChat(_id){
        // console.log(_id)
        // console.log(this.getBrowserCookie('_id'))
        if(this.getBrowserCookie('_id')){
            this.props.history.push(`/chat/${this.props.match.params._id}`)
        }else{
            this.setLoginRegisterModalVisible(true)
        }
    }
    render(){
        const RadioGroup = Radio.Group;
        const RadioButton = Radio.Button;
        return(
            <div>
                <div className="stick-header">
                    <div className="go-back">
                        <Icon onClick={() => this.goBack() } type="left"/>
                    </div>
                </div>
                <Modal
                    title={this.state.loginRegisterModalTitle}
                    // wrapClassName="vertical-center-modal"
                    style={{ top: 40 }}
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
                            <Input placeholder="密码" value={this.state.registerPassword} type='password' maxLength={20} onChange={e => this.handleChange(e,'registerPassword')}/>
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

                {this.state === null ? (null) : (
                    <div className="user-details">
                        {this.state.isFocus === false
                            ? (
                                <Button onClick={() => this.doFocus()} className='focus' style={{position:'absolute',top:'155px',left:'24px',zIndex:'1000',height:'25px'}}>关注Ta</Button>
                            )
                            : (
                            <Popconfirm placement="bottomLeft" title="&nbsp;&nbsp;您 确 定 不 再 关 注 Ta ?&nbsp;&nbsp;" onConfirm={() => this.cancelFocus()} okText="确定" cancelText="取消">
                                <Button className='focus' style={{position:'absolute',top:'155px',left:'24px',zIndex:'1000',height:'25px'}}>已关注</Button>
                            </Popconfirm>
                            )}
                        <Button onClick={() => this.goToChat(`${this.props.match.params._id}`)} style={{position:'absolute',top:'155px',right:'24px',zIndex:'1000',height:'25px'}}>私信<Icon type="message"/></Button>
                        <Card
                            bordered={false}
                            bodyStyle={{backgroundColor:'#ffffff'}}
                            style={{ width: '100%',margin:'auto'}}
                            actions={[<div onClick={() => this.props.history.push(`/userCollect/${this.state._id}`)}><p style={{margin:'0',color:'black'}}><b>{this.state.collect}</b></p><p style={{margin:'0'}}>收藏</p></div>, <div onClick={() => this.props.history.push(`/userFocus/${this.state._id}`)}><p style={{margin:'0',color:'black'}}><b>{this.state.focus}</b></p><p style={{margin:'0'}}>关注</p></div>, <div onClick={() => this.props.history.push(`/userFans/${this.state._id}`)}><p style={{margin:'0',color:'black'}}><b>{this.state.fans}</b></p><p style={{margin:'0'}}>粉丝</p></div>]}
                        >
                            <Meta
                                avatar={
                                    <Avatar id="test" style={{ width:'80px',height:'80px',borderRadius:'100%' }} src={this.state.avatarName} />
                                }
                                title={this.state.gender === undefined ?  (null) : (
                                    this.state.gender === '男' ? (<div><span>{this.state.nickName}</span> <img style={{width:'24px',verticalAlign:'top'}} src={require(`./img/male.png`)} alt=""/></div>) : (<div><span>{this.state.nickName}</span> <img style={{width:'24px',verticalAlign:'top'}} src={require(`./img/female.png`)} alt=""/></div>)
                                )}
                                style={{backgroundColor:'#ffffff',position:'relative',paddingBottom:'30px'}}
                                description={this.state.signature}
                            >

                            </Meta>


                        </Card>
                        <div className="my-publish" onClick={() => this.props.history.push(`/userPublish/${this.state._id}`)} >
                            <Icon type="form" style={{fontSize:'16px',color:'#bdcaff'}} /><span style={{marginLeft:'8px'}}>Ta发布的宝贝</span>
                            <div className="right" style={{lineHeight:'40px',height:'100%',float:'right',marginRight:'5px'}}><Icon type="right" style={{fontSize:'16px'}}/></div>
                        </div>
                    </div>
                )}

            </div>
        )
    }
}
export default User