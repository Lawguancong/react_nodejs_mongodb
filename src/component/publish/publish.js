import React from 'react'
import {connect} from 'react-redux'
import './publish.css'
import { Input ,Button,Upload, Icon, Modal ,message, Menu, Dropdown , Tooltip ,Badge} from 'antd';
import {authDataSuccess} from '../../redux/redux.user'
import {setPublishTitle,setPublishDescription,beforeUpload,handleChange,handlePreview,handleUnPreview,selectClassification,doPublish,setPublishPrice,publishUploading} from '../../redux/redux.publish'
import {getMessageUnReadNum,listeningLatestMessageList,getLatestMessageList} from '../../redux/redux.message'

import axios from 'axios'
import $ from 'jquery'
import browserCookie from 'browser-cookies'

const { TextArea } = Input;
let imgList = []// 未压缩的原图列表
let compressImgList = []// 图片压缩后的的列表





function formatNumber(value) {
    value += '';
    const list = value.split('.');
    const prefix = list[0].charAt(0) === '-' ? '-' : '';
    let num = prefix ? list[0].slice(1) : list[0];
    let result = '';
    while (num.length > 3) {
        result = `,${num.slice(-3)}${result}`;
        num = num.slice(0, num.length - 3);
    }
    if (num) {
        result = num + result;
    }
    return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
}
@connect(
    state => state,
)
class NumericInput extends React.Component {
    onChange = (e) => {
        const { value } = e.target;
        const reg = /^-?(0|[1-9][0-9]*)?$/;
        if ((!isNaN(value) && reg.test(value)) || value === '') {
            this.props.onChange(value);
        }
    }
    // '.' at the end or only '-' in the input box.
    onBlur = () => {
        const {  onBlur, onChange } = this.props;
        // const value = this.props.publish.price
        // if (value.charAt(value.length - 1) === '.' || value === '-') {
        //     onChange({ value: value.slice(0, -1) });
        // }
        if (onBlur) {
            onBlur();
        }
    }
    render() {
        const { value } = this.props;
        const title = value ? (
            <span className="numeric-input-title">
        {value !== '-' ? formatNumber(value) : '-'}
      </span>
        ) : '输入价格';
        return (
            <Tooltip
                trigger={['focus']}
                title={title}
                placement="topLeft"
                overlayClassName="numeric-input"
            >
                <Input
                    value={this.props.publish.price}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    placeholder="输入价格"
                    maxLength="5"
                    suffix={<Icon type="pay-circle-o" spin={false} style={{fontSize:'20px',color:'#ff4238'}} />}
                />
            </Tooltip>
        );
    }
}
@connect(
    state => state,
    {setPublishPrice}
)
class NumericInputDemo extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this)
    }
    onChange = (value) => {
        this.props.setPublishPrice(value)
        // parseInt(value)
    }
    render() {
        return <NumericInput style={{ width: 120 }} value={this.props.publish.price} onChange={this.onChange} />;
    }
}

@connect(
    state => state,
    {authDataSuccess,getMessageUnReadNum,listeningLatestMessageList,getLatestMessageList,setPublishTitle,setPublishDescription,beforeUpload,handleChange,handlePreview,handleUnPreview,selectClassification,doPublish,publishUploading}
)
class Publish extends React.Component{
    constructor(props) {
        super(props)
        this.selectClassification = this.selectClassification.bind(this)
        this.orderList = this.orderList.bind(this)

    }
    componentDidMount(){
        // console.log('componentDidMount')
        // $('.ant-upload-list').prepend($('.ant-upload-select-picture-card'))
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
    componentWillUpdate(){
        // console.log('componentWillUpdate')

    }
    componentDidUpdate(){
        // console.log('componentDidUpdate')
    }
    handlePreview = (file) => {
        // this.setState({previewImage: file.url || file.thumbUrl, previewVisible: true,});
        const previewImage = file.url || file.thumbUrl
        this.props.handlePreview(previewImage)
    }
    handleChange = ({ fileList }) => {
        if(fileList.length > this.props.publish.fileList.length){// 说明要上传
            if(this.props.publish.pictureType === true){
                fileList[fileList.length-1].status = 'done'
                this.props.handleChange(fileList)
            }
        }else if(fileList.length < this.props.publish.fileList.length){// 说明删除了图片
            this.props.handleChange(fileList)
        }
    }
    handleUpload = () => {
        const {title,description,price,classification,fileList} = this.props.publish
        const publishTime = new Date().getTime()
        // const imgList = []// 未压缩的原图列表
        // const compressImgList = []// 图片压缩后的的列表

        if(title.trim().length === 0){
            message.error('标题不能为空!')
        }else if(description.trim().length === 0){
            message.error('请描述一下宝贝!')
        }else if(classification === '分类'){
            message.error('请选择分类!')
        }else if(price === ''){
            message.error('请输入价格!')
        }else{
            // this.props.publish.uploading = true
            // const hide = message.loading('上传中', 0);
            // setTimeout(hide, 2500);
            // for(let i = 0; i < fileList.length; i++){
            //     const _self = this
            //     const size = fileList[i].size / 1024// 单位:KB
            //     const reader = new FileReader();
            //     reader.readAsDataURL(fileList[i].originFileObj);
            //     reader.onload=function () {
            //         const img = new Image()
            //         img.src = this.result;
            //         imgList.push(img.src)

            // if(size < 300){// 小于300KB
                    //     img.onload = function(){
                    //         compressImgList.push(img.src)
                    //         if(compressImgList.length === _self.props.publish.fileList.length){
                    //             // _self.props.publishUploading()
                    //             // axios.post('/doPublish',{title,description,price,classification,publishTime,imgList,compressImgList}).then( res => {
                    //             //     if(res.status === 200 && res.data.code === 0 && res.data.msg === '后端数据库出错'){
                    //             //         _self.props.doPublish(false)
                    //             //         message.error('上传失败，请重新发布!')
                    //             //     }else if(res.status === 200 && res.data.code === 1 && res.data.msg === '发布成功'){
                    //             //         _self.props.doPublish(true)
                    //             //         message.success('发布成功!')
                    //             //         _self.props.history.push('/myPublish')
                    //             //     }
                    //             // })
                    //         }
                    //     }
                    // }else{
                    //     img.onload = function(){
                    //         const that = this;
                    //         let w,h,scale,quality;
                    //         if(size > 1024){ // 大于1024KB
                    //             // 默认按比例压缩
                    //             w = that.width/2, h = that.height/2, scale = (w / h), quality = 0.7;
                    //         }else {
                    //             w = that.width, h = that.height, scale = (w / h), quality = 0.7;
                    //         }
                    //         h = (w / scale);
                    //         //生成canvas
                    //         const canvas = document.createElement('canvas');
                    //         const ctx = canvas.getContext('2d');
                    //         // 创建属性节点
                    //         const anw = document.createAttribute("width");
                    //         anw.nodeValue = w;
                    //         const anh = document.createAttribute("height");
                    //         anh.nodeValue = h;
                    //         canvas.setAttributeNode(anw);
                    //         canvas.setAttributeNode(anh);
                    //         ctx.drawImage(that, 0, 0, w, h);
                    //         const base64 = canvas.toDataURL('image/jpeg', quality);
                    //         compressImgList.push(base64)
                    //         if(compressImgList.length === _self.props.publish.fileList.length){
                    //             // _self.props.publishUploading()
                    //             // axios.post('/doPublish',{title,description,price,classification,publishTime,imgList,compressImgList}).then( res => {
                    //             //     if(res.status === 200 && res.data.code === 0 && res.data.msg === '后端数据库出错'){
                    //             //         _self.props.doPublish(false)
                    //             //         message.error('上传失败，请重新发布!')
                    //             //     }else if(res.status === 200 && res.data.code === 1 && res.data.msg === '发布成功'){
                    //             //         _self.props.doPublish(true)
                    //             //         message.success('发布成功!')
                    //             //         _self.props.history.push('/myPublish')
                    //             //     }
                    //             // })
                    //         }
                    //     }
                    //
                    // }
                // }
            // }
            this.orderList(fileList,fileList.length,0,title,description,price,classification,publishTime)
        }
    }
    selectClassification({ key }) {
        this.props.selectClassification(key)
    };
    // 图片列表上传正确排序
    orderList(fileList,length,k,title,description,price,classification,publishTime){
        if(k<length){
            const _self = this
            const size = fileList[k].size / 1024// 单位:KB
            const reader = new FileReader();
            reader.readAsDataURL(fileList[k].originFileObj);
            reader.onload=function(){
                const img = new Image()
                img.src = this.result;
                if(size < 300){// 小于300KB
                    img.onload = function(){
                        compressImgList.push(img.src)
                        k++
                        _self.orderList(fileList, length,k,title,description,price,classification,publishTime)
                    }
                }else{
                    img.onload = function(){
                        const that = this;
                        let w,h,scale,quality;
                        if(size > 1024){ // 大于1024KB
                            // 默认按比例压缩
                            w = that.width/2, h = that.height/2, scale = (w / h), quality = 0.7;
                        }else {
                            w = that.width, h = that.height, scale = (w / h), quality = 0.7;
                        }
                        h = (w / scale);
                        //生成canvas
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        // 创建属性节点
                        const anw = document.createAttribute("width");
                        anw.nodeValue = w;
                        const anh = document.createAttribute("height");
                        anh.nodeValue = h;
                        canvas.setAttributeNode(anw);
                        canvas.setAttributeNode(anh);
                        ctx.drawImage(that, 0, 0, w, h);
                        const base64 = canvas.toDataURL('image/jpeg', quality);
                        compressImgList.push(base64)
                        k++
                        _self.orderList(fileList, length,k,title,description,price,classification,publishTime)
                    }
                }
            }
        }else{
            imgList = fileList
            this.props.publishUploading()
            axios.post('/doPublish',{title,description,price,classification,publishTime,imgList,compressImgList}).then( res => {
                if(res.status === 200 && res.data.code === 0 && res.data.msg === '后端数据库出错'){
                    this.props.doPublish(false)
                    message.error('上传失败，请重新发布!')
                }else if(res.status === 200 && res.data.code === 1 && res.data.msg === '发布成功'){
                    imgList = []
                    compressImgList = []
                    this.props.doPublish(true)
                    message.success('发布成功!')
                    this.props.history.push('/myPublish')
                }
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
        const classificationMenu = (
            <Menu  onClick={this.selectClassification}>
                <Menu.Item key="3C数码">3C数码</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="手机">手机</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="电脑">电脑</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="游戏设备">游戏设备</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="护肤美妆">护肤美妆</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="服饰配件">服饰配件</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="珠宝首饰">珠宝首饰</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="女士服装">女士服装</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="男士服装">男士服装</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="女士鞋靴">女士鞋靴</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="男士鞋靴">男士鞋靴</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="箱包">箱包</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="音乐器具">音乐器具</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="书刊杂志">书刊杂志</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="其它">其它</Menu.Item>
                <Menu.Divider />
            </Menu>
        );

        return(
            <div className="publish-page">
                <div className="header" style={{backgroundColor:'#167ad9'}}>
                    <span>发布</span>
                </div>
                <div className="title">
                    <Input value={this.props.publish.title} onChange={(e)=>{this.props.setPublishTitle(e.target.value)}} placeholder="标题：品牌品类都是买家喜欢搜索的" maxLength={30}/>
                </div>
                <div className="description">
                    <TextArea value={this.props.publish.description} onChange={(e)=>{this.props.setPublishDescription(e.target.value)}} placeholder="描述一下宝贝的细节或故事" autosize={{ minRows: 6, maxRows: 8 }} maxLength={250} />
                </div>

                <div className="clearfix">
                    <Upload
                        customRequest={()=>{return false}}
                        listType="picture-card"
                        // defaultFileList={this.props.publish.fileList}
                        fileList={this.props.publish.fileList}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange}
                        beforeUpload={this.props.beforeUpload}
                    >
                        {this.props.publish.fileList.length >= 9 ? null : (<div><Icon type="plus" /><div className="ant-upload-text">上传</div></div>)}
                    </Upload>
                    <Modal visible={this.props.publish.previewVisible} footer={null} closable={false} onCancel={this.props.handleUnPreview}>
                        <img alt="example" style={{ width: '100%' }} src={this.props.publish.previewImage} />
                    </Modal>
                </div>
                <div className="classification">
                    <Dropdown overlay={classificationMenu} trigger={['click']} placement="topLeft">
                        <Button>{this.props.publish.classification}{this.props.publish.classification === '分类' ? (<Icon type="up"/>) : (null)}</Button>
                    </Dropdown>
                </div>
                <div className="price">
                    <NumericInputDemo />
                </div>
                <div className="handle-publish">
                    <Button
                        disabled={this.props.publish.fileList.length === 0 && this.props.publish.uploading === false}
                        onClick={this.handleUpload}
                        loading={this.props.publish.uploading}
                        type="primary"
                        style={{width:'100%'}}
                    >
                        {this.props.publish.uploading ? '上传中' : '发布' }
                    </Button>
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
    componentWillUnmount () {
        // console.log('componentWillUnmount')
    }
}
export default Publish