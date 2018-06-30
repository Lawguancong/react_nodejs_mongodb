import { Input ,Button,Upload, Icon, Modal ,message} from 'antd';
import axios from 'axios'


const initState = {
    title:'',// 发布的标题
    description:'',// 描述
    price:'',// 价格
    classification:'分类',// 分类
    pictureType:false,// 上传图片格式是否正确
    previewVisible: false,// 是否预览
    previewImage: '',// 预览图片
    fileList: [],// 上传图片队列
    uploading: false,// 是否上传中
}
//reducer -> publish
export function publish(state = initState,action) {
    switch (action.type){
        case 'PUBLISH_BEFORE_UPLOAD':
            return {...state,pictureType:action.pictureType}
        case 'DO_PUBLISH_SUCCESS':
            return {...initState}
        case 'DO_PUBLISH_FAIL':
            return {...state,uploading:false}
        case 'PUBLISH_UPLOADING':
            return {...state,uploading:true}
        case 'PUBLISH_HANDLE_CHANGE':
            return {...state,fileList:action.fileList,pictureType:false}
        case 'PUBLISH_HANDLE_PREVIEW':
            return {...state,previewImage:action.previewImage,previewVisible:true}
        case 'PUBLISH_HANDLE_UN_PREVIEW':
            return {...state,previewVisible:false}
        case 'SELECT_PUBLISH_CLASSIFICATION':
            return {...state,classification:action.classification}
        case 'SET_PUBLISH_TITLE':
            return {...state,title:action.title}
        case 'SET_PUBLISH_DESCRIPTION':
            return {...state,description:action.description}
        case 'SET_PUBLISH_PRICE':
            return {...state,price:action.price}
        default:
            return state
    }
}
export function beforeUpload(file) {
    // console.log(file.type)
    const isIMAGE = file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/bmp';// 允许上传图片的格式
    // const isIMAGE = true// 允许任何类型上传
    const isLt2M = file.size / 1024 / 1024 < 4;
    if (!isIMAGE) {
        message.error('图片格式错误!');
    }else if (!isLt2M) {
        message.error('图片不能超过4MB!');
    }
    return{
        pictureType:isIMAGE && isLt2M,
        type:'PUBLISH_BEFORE_UPLOAD'
    }
}
export function doPublish(flag) {
    if(flag){
        return {
            type:'DO_PUBLISH_SUCCESS'
        }
    }else{
        return {
            type:'DO_PUBLISH_FAIL'
        }
    }

}
export function publishUploading() {
    return {
        type:'PUBLISH_UPLOADING'
    }
}
export function handleChange(fileList) {
    return{
        fileList,
        type:'PUBLISH_HANDLE_CHANGE'
    }
}
export function handlePreview(previewImage) {
    return{
        previewImage,
        type:'PUBLISH_HANDLE_PREVIEW'
    }

}
export function handleUnPreview() {
    return{
        type:'PUBLISH_HANDLE_UN_PREVIEW'
    }
}
export function selectClassification(classification) {
    return{
        classification,
        type:'SELECT_PUBLISH_CLASSIFICATION'
    }
}
export function setPublishTitle(title) {
    return {
        title,
        type:'SET_PUBLISH_TITLE'
    }
}
export function setPublishDescription(description) {
    return {
        description,
        type:'SET_PUBLISH_DESCRIPTION'
    }
}
export function setPublishPrice(price) {

    return{
        price,
        type:'SET_PUBLISH_PRICE'
    }
}