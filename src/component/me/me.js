import React from 'react'
import {connect} from 'react-redux'
import { Button, Radio, Icon ,Modal,Upload,message,Row,Col,Avatar,Card,Badge} from 'antd';
import {doUploadAvatar} from '../../redux/redux.user'
import axios from 'axios'
import browserCookie from 'browser-cookies'
import {authDataSuccess} from '../../redux/redux.user'
import {getMessageUnReadNum,listeningLatestMessageList,getLatestMessageList} from '../../redux/redux.message'

import UserAvatar from 'react-user-avatar'

import ImageCompressor from 'image-compressor.js';

import './me.css'

@connect(
    state => state,
    {doUploadAvatar,authDataSuccess,getMessageUnReadNum,listeningLatestMessageList,getLatestMessageList}
)
class Me extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            avatarType:false,// 头像格式是否正确
        }
        this.handleChange = this.handleChange.bind(this)
        this.beforeUpload = this.beforeUpload.bind(this)
    }
    componentDidMount(){

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

    }
    componentDidUpdate(){
        // console.log(this.props.user.avatarName)
        // document.getElementById('test').setAttribute('src',require(`./avatar/publicAvatar/${this.props.user.avatarName}`))
        // //
        // console.log(document.getElementById('test'))
    }
    beforeUpload(file) {
        // console.log(file.type)
        const isIMAGE = file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/bmp';// 允许上传图片的格式
        // const isIMAGE = true// 允许任何类型上传
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isIMAGE) {
            message.error('图片格式错误!');
        }else if (!isLt2M) {
            message.error('图片不能超过2MB!');
        }
        this.setState({
            avatarType:isIMAGE && isLt2M
        })
        return isIMAGE && isLt2M;
    }

    handleChange = (info) => {
        // console.log(info)
        if(this.state.avatarType){
            const size = info.file.size// 单位:KB
            const _self = this
            const reader = new FileReader();
            reader.readAsDataURL(info.file.originFileObj);
            reader.onload=function () {
                let img = new Image()
                img.src = this.result;
                img.onload = function(){
                    let that = this;
                    // console.log(that.width)
                    // console.log(that.height)
                    let w,h,scale,quality;
                    if(size > 1024){ // 大于1024KB ?
                        // 默认按比例压缩
                        w = that.width/2, h = that.height/2, scale = (w / h), quality = 0.7;
                    }else {
                        w = that.width, h = that.height, scale = (w / h), quality = 0.7;
                    }
                    h = (w / scale);
                    //生成canvas
                    let canvas = document.createElement('canvas');
                    let ctx = canvas.getContext('2d');
                    // 创建属性节点
                    let anw = document.createAttribute("width");
                    anw.nodeValue = w;
                    let anh = document.createAttribute("height");
                    anh.nodeValue = h;
                    canvas.setAttributeNode(anw);
                    canvas.setAttributeNode(anh);
                    ctx.drawImage(that, 0, 0, w, h);
                    let base64 = canvas.toDataURL('image/jpeg', quality);
                    _self.props.doUploadAvatar(base64)
                    _self.setState({
                        avatarType:false
                    })
                }
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
                    this.props.history.push('/')

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
        const { Meta } = Card;
        return(
            <div>
                <div>
                    <Card
                        className="setting"
                        bordered={false}
                        bodyStyle={{backgroundColor:'#ffffff'}}
                        style={{ width: '100%',margin:'auto',padding:'0'}}
                        actions={[<Icon type="setting" onClick={() => this.props.history.push('/setting')}/> ]}
                    />
                    <Card
                        bordered={false}
                        bodyStyle={{backgroundColor:'#ffffff'}}
                        style={{ width: '100%',margin:'auto' }}
                        actions={[<div onClick={() => this.props.history.push(`/myCollect`)}><p style={{margin:'0',color:'black'}}><b>{this.props.user.collect}</b></p><p style={{margin:'0'}}>收藏</p></div>, <div onClick={() => this.props.history.push(`/myFocus`)}><p style={{margin:'0',color:'black'}}><b>{this.props.user.focus}</b></p><p style={{margin:'0'}}>关注</p></div>, <div onClick={() => this.props.history.push(`/myFans`)}><p style={{margin:'0',color:'black'}}><b>{this.props.user.fans}</b></p><p style={{margin:'0'}}>粉丝</p></div>]}
                    >
                        <Meta
                            avatar={
                                <Upload
                                    name="avatar"
                                    listType="picture-card"
                                    className="upload-avatar"
                                    showUploadList={false}
                                    // multiple={true}
                                    // action="/uploadAvatar"
                                    customRequest={() => {return null}}
                                    beforeUpload={this.beforeUpload}
                                    onChange={this.handleChange}
                                >
                                    <Avatar id="test" style={{ width:'80px',height:'80px',borderRadius:'100%' }} src={this.props.user.avatarName} />
                                </Upload>
                            }
                            title={this.props.user.gender === undefined ?  (null) : (
                                this.props.user.gender === '男' ? (<div><span>{this.props.user.nickName}</span> <img style={{width:'24px',verticalAlign:'top'}} src={require(`./img/male.png`)} alt=""/></div>) : (<div><span>{this.props.user.nickName}</span> <img style={{width:'24px',verticalAlign:'top'}} src={require(`./img/female.png`)} alt=""/></div>)
                            )}
                            style={{backgroundColor:'#ffffff'}}
                            description={this.props.user.signature}
                        />
                    </Card>

                </div>
                <div className="my-publish" onClick={() => this.props.history.push('/myPublish')} >
                    <Icon type="form" style={{fontSize:'16px',color:'#bdcaff'}} /><span style={{marginLeft:'8px'}}>我发布的</span>
                    <div className="right" style={{lineHeight:'40px',height:'100%',float:'right',marginRight:'5px'}}><Icon type="right" style={{fontSize:'16px'}}/></div>
                </div>
                <div className="footerLink">
                    <a id='a-home' onClick={ () => this.goToHomePage()} className="">
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
                    <a id='a-me' onClick={ () => this.goToMePage()}  className="active">
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
export default Me