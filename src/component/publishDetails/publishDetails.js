import React from 'react'
import {connect} from 'react-redux'
import {Icon,message,Input,Badge ,Button,Modal , Radio, } from 'antd'
import axios from 'axios'
import $ from 'jquery'
import './publishDetails.css'
import {getCommentList,clearCommentList} from '../../redux/redux.publishDetails'
import browserCookie from 'browser-cookies'
import {doRegister,doLogin,authDataSuccess} from '../../redux/redux.user'


const { TextArea } = Input;


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
    state => state,
    {getCommentList,clearCommentList,doRegister,doLogin,authDataSuccess}
)
class PublishDetails extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            placeholder:"写评论...",
            commentObject:'notPeople',
            commentObjectId:'',


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
    componentDidMount(){
        // console.log(this.props.match.params._id)
        this.getPublishDetails()
        this.addClickNum()
        // console.log(this.state)
        // console.log(this.state._id)
        // this.getCommentList()
        // console.log(this.state)
        // console.log(this.state.collect)
    }
    componentDidUpdate(){
        // console.log(this.state.description)
        // console.log(this.state.compressImgList[0])
        // console.log(this.state)
        // console.log(this.state._id)
        // console.log(this.state)

    }

    addClickNum(){
        const publishDetailsId = this.props.match.params._id
        axios.post('/addClickNum',{publishDetailsId}).then( res => {
            if(res.status === 200 && res.data.code === 1 && res.data.msg === '自增浏览量成功'){

            }
        })
    }
    cancelCollect(){
        const publishDetailsId = this.props.match.params._id
        // const collectTime = new Date().getTime()
        axios.post('/cancelCollect',{publishDetailsId}).then( res => {
            if(res.status === 200 && res.data.code === 1 && res.data.msg === '取消收藏成功'){
                message.success('取消收藏!')
                this.setState({
                    collect:false
                })
            }else{
                message.error('取消收藏失败!')
            }
        })
    }
    doCollect(){
        const publishDetailsId = this.props.match.params._id
        const collectTime = new Date().getTime()
        axios.post('/doCollect',{publishDetailsId,collectTime}).then( res => {
            // console.log(res)
            if(res.status === 200 && res.data.code === 1 && res.data.msg === '收藏成功'){
                message.success('收藏成功!')
                this.setState({
                    collect:true
                })
            }else{
                message.error('收藏失败!')
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
                    // this.authData()
                }
                _self.setState({
                    isClickDoLogin:false
                })
                _self.getPublishDetails()

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
                _self.getPublishDetails()

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
    getPublishDetails(){
        axios.post('/getPublishDetails',{publishDetailsId:this.props.match.params}).then( res => {
            if(res.status === 200 && res.data.code === 0 && res.data.msg === '后端数据库出错'){
                message.error('后端数据库出错!')
                this.props.history.push('/me')
            }else if(res.status === 200 && res.data.code === 1 && res.data.msg === '获取我发布的宝贝详情成功'){
                this.setState({
                    ...res.data.doc
                })
                let description = res.data.doc.description
                let arr = []
                let newString = ''
                for(let i = 0; i < description.length; i++){
                    arr.push(description.charAt(i))
                }
                arr.map( v => {
                    if(v === ' '){
                        newString += '&nbsp;'
                    }else if (v === '\n'){
                        newString += '<br/>'
                    }else{
                        newString += v
                    }
                })
                $('#description').html(newString);
            }
        })

    }
    getCommentList(){
        const publishDetailsId = this.props.match.params._id
        axios.post('/getCommentList',{publishDetailsId}).then( res => {
            if(res.status === 200 && res.data.code === 1 && res.data.msg === '获取评论列表成功'){
                // console.log(res.data.commentList)
                this.props.getCommentList(res.data.commentList)
            }
        })
    }
    sendComment(){
        const commentText = $("#comment-text").val()
        const commenterId = browserCookie.get('_id').split('"')[1]// _id 为当前用户登录的cookies:_id
        if(commentText.trim().length !== 0 ){

            if(commenterId === this.state.commentObjectId){
                message.error('不能评论自己!')
            }else{
                const publishDetailsId = this.props.match.params._id
                const commentObject = this.state.commentObject
                const commentObjectId = this.state.commentObjectId
                const commentTime = new Date().getTime()
                axios.post('/sendComment',{publishDetailsId,commentText,commentObject,commentObjectId,commentTime}).then( res => {
                    if(res.status === 200 && res.data.code === 1 && res.data.msg === '发表评论成功'){
                        message.success('发表评论成功!')
                        $("#comment-text").val('')
                    }else{
                        message.error('发表评论失败!')
                    }
                })
                // message.success('评论成功!')// 对象可以是 人或者物品
                // console.log(this.state)
            }

        }else{
            message.error('评论不能为空白消息!')
        }
    }
    commentPeople(nickName,commentObjectId){// 评论对象是 人
        $("#comment-text").val('')
        $("#comment-text")[0].focus()
        this.setState({
            placeholder:'评论@'+nickName+':',
            commentObject:'isPeople',// isPeople notPeople
            commentObjectId,
        })
    }
    showPublishDate(sendTime){
        // console.log(new Date())
        const publishYear = parseInt(new Date(sendTime).format("yyyy-MM-dd hh:mm").split(" ")[0].split("-")[0])
        const publishMonth = parseInt(new Date(sendTime).format("yyyy-MM-dd hh:mm").split(" ")[0].split("-")[1])
        const publishDay = parseInt(new Date(sendTime).format("yyyy-MM-dd hh:mm").split(" ")[0].split("-")[2])
        // console.log(new Date(sendTime).format("yyyy-MM-dd hh:mm").split(" ")[1])
        // console.log(new Date(sendTime).format("yyyy-MM-dd hh:mm").split(" ")[1].split(":")[0])
        // console.log(new Date(sendTime).format("yyyy-MM-dd hh:mm").split(" ")[1].split(":")[1])
        const publishHour = parseInt(new Date(sendTime).format("yyyy-MM-dd hh:mm").split(" ")[1].split(":")[0])
        const publishMinute = parseInt(new Date(sendTime).format("yyyy-MM-dd hh:mm").split(" ")[1].split(":")[1])
        // console.log(new Date().getHours())
        // console.log(new Date() .getMinutes())

        if( publishYear < new Date().getFullYear() ){
            // return new Date(sendTime).format("yyyy-MM-dd hh:mm") + ' 发布'
            return new Date(sendTime).format("yyyy-MM-dd") + ' 发布'
        }
        if( publishMonth < new Date().getMonth() + 1 ){
            return new Date(sendTime).format("MM-dd hh:mm") + ' 发布'
        }
        // if( chatDay+2 === new Date().getDate()){
        //     return "前天 " + new Date(sendTime).format("hh:mm")
        //
        // }
        if( publishDay+1 === new Date().getDate()){
            return "昨天 " + new Date(sendTime).format("hh:mm") + ' 发布'
        }
        if( publishDay < new Date().getDate()){
            return new Date(sendTime).format("MM-dd hh:mm") + ' 发布'
        }
        // 当天发布
        if( publishDay === new Date().getDate()){
            // return new Date(sendTime).format("hh:mm")
            if(publishHour < new Date().getHours()){
                return new Date().getHours() - publishHour  + '小时前 发布'
            }
            if(publishHour === new Date().getHours()){
                if(publishMinute === new Date() .getMinutes()){
                    return '刚刚发布'
                }else{
                    return new Date() .getMinutes() - publishMinute  + '分钟前 发布'
                }
            }
        }
    }
    render(){
        const RadioGroup = Radio.Group;
        const RadioButton = Radio.Button;
        return(
            <div>
                <div className="header">
                    <Icon onClick={() => this.props.history.goBack()} type="left"/>
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


                {this.state.commentList === [] ? (null) : (
                    <div className="publish-details" style={{paddingTop:'50px',paddingBottom:'40px'}}>
                        <div className="top">
                            <div className="avatarName">
                                {this.state.avatarName === undefined ? ( null) : (<img src={this.state.avatarName} alt=""/>)}
                            </div>
                            <div className="nickName">
                                <span>{this.state.nickName}</span>
                            </div>
                            <div className="publishTime">
                                {this.state.publishTime === undefined ? ( null) : (<span>{this.showPublishDate(this.state.publishTime)}</span>)}
                            </div>
                        </div>
                        <div className="price" style={{margin:'8px  0 8px 5%'}}>
                            {this.state.price === undefined ? ( null) : (<span style={{color:'#ff4238',fontSize:'16px',fontWeight:'bold'}}>￥{this.state.price}</span>)}
                        </div>
                        <div className="title" style={{width:'90%',margin:'0 auto',padding:'0'}}>
                            <span style={{fontWeight:'bold',fontSize:'15px'}}>{this.state.title}</span>
                        </div>
                        <div id="description" style={{width:'90%',margin:'5px auto 0'}}/>
                        <div className="compressImgList">
                            {this.state.compressImgList === undefined ? (null) : (this.state.compressImgList.map( v => {
                                return (
                                    <img src={v} alt="" style={{width:'100%',marginTop:'10px'}} />
                                )
                            }))}
                        </div>
                        <div className="clickNum">
                            {this.state.clickNum === undefined ? (null) : (<span>浏览 {this.state.clickNum+1}</span>)}
                        </div>

                        {/*<span>评论{this.state.commentNum}</span>*/}
                        {/*<div className="comment-list">*/}
                            {/*{this.props.publishDetails.commentList.map( v => {*/}
                                {/*return(*/}
                                    {/*<div className="comment" onClick={() => this.commentPeople(`${v.commenterNickName}`,`${v.commenterId}`)}>*/}
                                        {/*<div className="avatar" >*/}
                                            {/*<img src={v.commenterAvatar} alt="" />*/}
                                        {/*</div>*/}
                                        {/*<span style={{padding:'10px 0',fontWeight:'bold',display:'inline-block'}}>{v.commenterNickName}</span>*/}
                                        {/*<p>{v.commentObject === 'notPeople' ? (v.commentText) : (<span>回复@{v.commentObjectNickName}：{v.commentText}</span>)}</p>*/}
                                        {/*<p>{new Date(v.commentTime).format("yyyy-MM-dd hh:mm")}</p>*/}
                                    {/*</div>*/}
                                {/*)*/}
                            {/*})}*/}
                        {/*</div>*/}
                        <div className="comment-collect">
                            {/*<Input*/}
                                {/*id="comment-text"*/}
                                {/*className="comment"*/}
                                {/*placeholder={this.state.placeholder}*/}
                                {/*suffix={<span onClick={() => this.sendComment()}>发送</span>}*/}
                            {/*/>*/}
                            {/*<span onClick={() => {this.setState({ placeholder:"写评论...",commentObject:'notPeople',commentObjectId:''});$("#comment-text").val('');$("#comment-text")[0].focus()}}><Icon type="message"/></span>*/}
                            {(this.state._id === undefined )
                                ? (null)
                                : (
                                    browserCookie.get('_id') === null
                                        ? (
                                            <span onClick={() => this.setLoginRegisterModalVisible(true)}>我想要</span>
                                    )
                                        : (
                                        this.state._id === browserCookie.get('_id').split('"')[1] ? (null) : (<span onClick={() => this.props.history.push(`/chat/${this.state._id}`)}>我想要</span>)

                                    )
                                )}
                            {this.state.collect === undefined
                                ? (null)
                                : (
                                    browserCookie.get('_id') === null
                                        ? (
                                        <span onClick={() => this.setLoginRegisterModalVisible(true)}><Icon type="star-o" /></span>

                                    )
                                        : (
                                        this.state.collect === false
                                            ? (
                                            <span onClick={() => this.doCollect()}><Icon type="star-o" /></span>
                                        )
                                            : (
                                            <span onClick={() => this.cancelCollect()}><Icon type="star" style={{color:'rgb(255,195,69)'}} /></span>
                                        )
                                    )


                                )}


                        </div>
                    </div>
                )}

            </div>
        )
    }
    componentWillUnmount(){
        this.props.clearCommentList()
    }
}
export default PublishDetails