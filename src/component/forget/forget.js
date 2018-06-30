import React from 'react'
import {Icon,Input,Button,message} from 'antd'
import axios from 'axios'
import browserCookie from 'browser-cookies'



class Forget extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            phoneNumber:'',
            captcha_6:'',
            newPassword:'',
            captcha_6Title:'获取验证码',
            isSendCaptcha_6:false,// 是否发送6位验证码
            isResetPassword:false,// 是否重置密码
        }
        this.getBrowserCookie = this.getBrowserCookie.bind(this)
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
    handleChange = (e,key) => {
        // console.log(e)
        // console.log( e.target.value)
        // console.log(key)
        this.setState({
            [key]:e.target.value
        });
    }
    getCaptcha_6 = (e) => {
        const phoneReg=/^[1][34578][0-9]{9}$/;
        if(this.state.phoneNumber === ''){
            message.error('请输入手机号');
        }else if(this.state.phoneNumber.length < 11){
            message.error('请输入正确的手机号');
        }else if(!phoneReg.test(this.state.phoneNumber)) {
            message.error('请输入正确的手机号');
        }else{
            const _self = this
            // console.log('ok')
            axios.post('/checkUserExist',{phone:this.state.phoneNumber}).then( res => {
                if(res.status === 200 && res.data.code === 0 && res.data.msg === '后端数据库出错'){
                    message.error('后端数据库出错,请稍后再试！');
                }else if (res.status === 200 && res.data.code === 0 && res.data.msg === '该用户手机号码不存在') {
                    //手机号已经注册
                    message.error('用户不存在，请注册!');
                }else{
                    //手机号没有注册

                    axios.post('/getCaptcha_6',{phone:this.state.phoneNumber}).then( res => {
                        if(res.status === 200 && res.data.code === 1 && res.data.msg === '验证码发送成功'){
                            console.log(res.data.Captcha)
                            message.success('验证码发送成功');
                            _self.setState({
                                isSendCaptcha_6:true,
                                captcha_6Title:'发送成功(60)'
                            });
                            let second = 59; // 59秒
                            let timer = setInterval(function () {
                                _self.setState({
                                    captcha_6Title:'发送成功('+second+')'
                                });
                                second--;
                                if(second < 0){
                                    clearInterval(timer);
                                    _self.setState({
                                        captcha_6Title:'重新获取',
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
    resetPassword(){
        const passwordReg = new RegExp(" ")// 过滤密码非法字符，防止数据库注入安全
        const phoneReg=/^[1][34578][0-9]{9}$/;
        if(this.state.phoneNumber === ''){
            message.error('请输入手机号');
        }else if(this.state.captcha_6 === ''){
            message.error('请输入验证码');
        }else if(this.state.newPassword === ''){
            message.error('请输入密码');
        }else if(this.state.phoneNumber.length < 11){
            message.error('请输入正确的手机号');
        }else if(!phoneReg.test(this.state.phoneNumber)) {
            message.error('请输入正确的手机号');
        }else if(passwordReg.test(this.state.newPassword)) {
            message.error('密码含有非法字符');
        }else if(this.state.captcha_6 !== this.getBrowserCookie('captcha_6')){
            message.error('验证码错误');
        }else {
            const _self = this
            this.setState({
                isResetPassword:true
            })
            axios.post('/resetPassword',{phone:this.state.phoneNumber,password:this.state.newPassword}).then( res => {
                if(res.status=== 200 && res.data.code === 0 && res.data.msg === '后端数据库出错') {
                    message.error('后端数据库出错，稍后再试！');
                }else if(res.status=== 200 && res.data.code === 1 && res.data.msg === '密码重置成功'){
                    message.success('密码重置成功!');
                    browserCookie.erase('captcha_6')
                    // if(this.state.whichClick === '/me'){
                    //     window.location.href="/me";// 重刷新 '/me'
                    //
                    // }else{
                    //     this.props.history.push(this.state.whichClick)
                    //
                    // }
                    setTimeout(function () {
                        _self.props.history.goBack()
                    },1000)
                }
                _self.setState({
                    isResetPassword:false
                })
            })
        }
    }
    render(){
        return(
            <div style={{paddingTop:'50px'}}>
                <div className="stick-header">
                    <div className="receiveNickName">
                        <span style={{color:'white'}}>忘记密码</span>
                    </div>
                    <div className="go-back" onClick={() => this.props.history.goBack()}>
                        <Icon type="left"/>
                    </div>
                </div>
                <div style={{width:'80%',margin:'20px auto'}}>
                    <Input placeholder="手机号" value={this.state.phoneNumber}  maxLength={11} onChange={e => this.handleChange(e,'phoneNumber')}/>
                    <br/><br/>
                    <Input placeholder="输入6位验证码" value={this.state.captcha_6} style={{marginRight:'2%',width:'68%'}}  maxLength={6} onChange={e => this.handleChange(e,'captcha_6')}/>
                    <Button onClick={e => this.getCaptcha_6(e)} disabled={this.state.isSendCaptcha_6} type="normal"  style={{padding:'0',width:'30%',color:'#1890ff'}}>{this.state.captcha_6Title}</Button>
                    <br/><br/>
                    <Input placeholder="新密码" value={this.state.newPassword} type='password' maxLength={20} onChange={e => this.handleChange(e,'newPassword')}/>
                    <br/><br/>
                    <Button onClick={() => this.resetPassword()} disabled={this.state.isResetPassword} type="primary" size='large' style={{width:'100%'}}>重置密码</Button>
                    <br/><br/>
                </div>

            </div>
        )
    }
}
export default Forget