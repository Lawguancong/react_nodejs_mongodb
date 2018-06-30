import React from 'react'
import axios from 'axios'
import { Input ,Button,Upload, Icon, Modal , Menu, Dropdown , Tooltip ,message} from 'antd';
import {connect} from 'react-redux'
import {setPublishPrice} from '../../redux/redux.publish'
import {getMyPublish,clearData,setEditPublishPrice,beforeUpload,handlePreview,handleUnPreview,handleChange,setEditPublishDescription,setEditPublishTitle,editMyPublishUploading} from '../../redux/redux.editPublish'
import $ from 'jquery'
// import './editMyPublish.css'


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
                    value={this.props.editPublish.price}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    placeholder="输入价格"
                    maxLength="6"
                    suffix={<Icon type="pay-circle-o" spin={false} style={{fontSize:'20px',color:'#ff4238'}} />}
                />
            </Tooltip>
        );
    }
}








@connect(
    state => state,
    {setEditPublishPrice}
)
class NumericInputDemo extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this)
    }
    onChange = (value) => {
        this.props.setEditPublishPrice(value)
        // parseInt(value)
    }
    render() {
        return <NumericInput style={{ width: 120 }} value={this.props.editPublish.price} onChange={this.onChange} />;
    }
}






@connect(
    state => state,
    {getMyPublish,clearData,beforeUpload,handlePreview,handleUnPreview,handleChange,setEditPublishDescription,setEditPublishTitle,editMyPublishUploading}
)
class EditMyPublish extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            goBackVisible:false
        }
        this.goBack = this.goBack.bind(this)
        this.setGoBackVisible = this.setGoBackVisible.bind(this)
        this.orderList = this.orderList.bind(this)

    }
    componentDidMount(){
        this.getEditMyPublish()
    }
    componentDidUpdate(){
        // $('.ant-upload-list').prepend($('.ant-upload-select-picture-card'))

    }
    handlePreview = (file) => {
        // this.setState({previewImage: file.url || file.thumbUrl, previewVisible: true,});
        const previewImage = file.url || file.thumbUrl
        this.props.handlePreview(previewImage)
    }
    handleChange = ({ fileList }) => {
        if(fileList.length > this.props.editPublish.fileList.length){// 说明要上传
            if(this.props.editPublish.pictureType === true){
                fileList[fileList.length-1].status = 'done'
                this.props.handleChange(fileList)
            }
        }else if(fileList.length < this.props.editPublish.fileList.length){// 说明删除了图片
            this.props.handleChange(fileList)
        }
    }
    handleUpload = () => {
        const {title,description,price,classification,fileList} = this.props.editPublish
        const publishTime = new Date().getTime()


        if(title.trim().length === 0){
            message.error('标题不能为空!')
        }else if(description.trim().length === 0){
            message.error('请描述一下宝贝!')
        }else if(classification === '分类'){
            message.error('请选择分类!')
        }else if(price === ''){
            message.error('请输入价格!')
        }else{
            console.log(fileList)
            // return
            this.orderList(fileList,fileList.length,0,title,description,price,classification,publishTime)

        }
    }
    getEditMyPublish(){
        const {_id} = this.props.match.params
        axios.post('/getEditMyPublish',{_id}).then( res => {
            if(res.status === 200 && res.data.code === 0 && res.data.msg === '后端数据库出错'){
                message.error('后端数据库出错,')
            }else if(res.status === 200 && res.data.code === 1 && res.data.msg === '获取我要编辑的宝贝成功'){
                this.props.getMyPublish(res.data.doc)
            }
        })
    }
    goBack() {
        this.setGoBackVisible(false)
        this.props.history.goBack()
    }
    orderList(fileList,length,k,title,description,price,classification,publishTime){
        if(k<length){
            const _self = this
            const size = fileList[k].size / 1024// 单位:KB
            const reader = new FileReader();
            reader.readAsDataURL(fileList[k].originFileObj);
            reader.onload=function () {
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
            this.props.editMyPublishUploading()
            // axios.post('/doPublish',{title,description,price,classification,publishTime,imgList,compressImgList}).then( res => {
            //     if(res.status === 200 && res.data.code === 0 && res.data.msg === '后端数据库出错'){
            //         this.props.doPublish(false)
            //         message.error('上传失败，请重新发布!')
            //     }else if(res.status === 200 && res.data.code === 1 && res.data.msg === '发布成功'){
            //         imgList = []
            //         compressImgList = []
            //         this.props.doPublish(true)
            //         message.success('发布成功!')
            //         this.props.history.push('/myPublish')
            //     }
            // })
        }
    }
    setGoBackVisible(goBackVisible){
        this.setState({goBackVisible})
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
                <Menu.Item key="其它闲置">其它闲置</Menu.Item>
                <Menu.Divider />
            </Menu>
        );
        return(
          <div className="my-publish-details">
              <div className="header" style={{height:'50px',backgroundColor:'#1782e8',width:'100%',lineHeight:'50px',textAlign:'center',position:'relative'}}>
                  <div className="go-back" onClick={() => this.setGoBackVisible(true)} style={{left:'5%',position:'absolute',height:'50px'}}>
                      <Icon type="left" style={{fontSize:'20px',lineHeight:'50px',color:'white'}}/><span style={{fontSize:'20px',color:'white'}}>返回</span>
                  </div>
                  <span style={{fontSize:'20px',color:'white'}}>编辑</span>
              </div>
              <Modal
                  title="提示："
                  wrapClassName="vertical-center-modal"
                  visible={this.state.goBackVisible}
                  onOk={() => this.goBack()}
                  onCancel={() => this.setGoBackVisible(false)}
                  cancelText="取消"
                  okText="确定"
                  closable={false}
              >
                  <p>是否不保存返回？</p>
              </Modal>
              {this.props.editPublish.price === '' ? (null) : (
                  <div>
                      <div className="title">
                          <Input value={this.props.editPublish.title} onChange={(e)=>{this.props.setEditPublishTitle(e.target.value)}} placeholder="标题：品牌品类都是买家喜欢搜索的" maxLength={20}/>
                      </div>
                      <div className="description">
                          <TextArea value={this.props.editPublish.description} onChange={(e)=>{this.props.setEditPublishDescription(e.target.value)}} placeholder="描述一下宝贝的细节或故事" autosize={{ minRows: 6, maxRows: 8 }} maxLength={250} />
                      </div>
                      <div className="clearfix">
                          <Upload
                              customRequest={()=>{return false}}
                              listType="picture-card"
                              // defaultFileList={this.props.editPublish.fileList}
                              fileList={this.props.editPublish.fileList}
                              onPreview={this.handlePreview}
                              onChange={this.handleChange}
                              beforeUpload={this.props.beforeUpload}
                          >
                              {this.props.editPublish.fileList.length >= 9 ? null : (<div><Icon type="plus" /><div className="ant-upload-text">上传</div></div>)}
                          </Upload>
                          <Modal visible={this.props.editPublish.previewVisible} footer={null} closable={false} onCancel={this.props.handleUnPreview}>
                              <img alt="example" style={{ width: '100%' }} src={this.props.editPublish.previewImage} />
                          </Modal>
                      </div>
                      <div className="classification">
                          <Dropdown overlay={classificationMenu} trigger={['click']} placement="topLeft">
                              <Button>{this.props.editPublish.classification}</Button>
                          </Dropdown>
                      </div>
                      <div className="price">
                          <NumericInputDemo />
                      </div>
                      <div className="handle-publish" style={{width:'100%',bottom:'20px'}}>
                          <Button
                              disabled={this.props.editPublish.fileList.length === 0 && this.props.editPublish.uploading === false}
                              onClick={this.handleUpload}
                              loading={this.props.editPublish.uploading}
                              type="primary"
                              style={{width:'100%'}}
                          >
                              {this.props.editPublish.uploading ? '上传中' : '发布' }
                          </Button>
                      </div>
                  </div>
              )}


      </div>
        )
    }
    componentWillUnmount(){
        this.props.clearData()
    }
}
export default EditMyPublish

