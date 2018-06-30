import {message} from 'antd'


const initState = {
    title:'',// 发布的标题
    description:'',// 描述
    price:'',// 价格
    classification:'',// 分类
    pictureType:false,// 上传图片格式是否正确
    previewVisible: false,// 是否预览
    previewImage: '',// 预览图片
    fileList: [],// 上传图片队列
    uploading: false,// 是否上传中
}

//reducer -> editPublish
export function editPublish(state = initState,action) {
    switch (action.type) {
        case 'EDIT_MY_PUBLISH_UPLOADING':
            return {...state,uploading:true}
        case 'EDIT_BEFORE_UPLOAD':
            return {...state,pictureType:action.pictureType}
        case 'EDIT_CLEAR_DATA':
            return {...initState}
        case 'EDIT_GET_MY_PUBLISH':
            return {...state,...action.doc}
        case 'EDIT_HANDLE_CHANGE':
            return {...state,fileList:action.fileList,pictureType:false}
        case 'EDIT_HANDLE_PREVIEW':
            return {...state,previewImage:action.previewImage,previewVisible:true}
        case 'EDIT_HANDLE_UN_PREVIEW':
            return {...state,previewVisible:false}
        case 'SET_EDIT_PUBLISH_TITLE':
            return {...state,title:action.title}
        case 'SET_EDIT_PUBLISH_DESCRIPTION':
            return {...state,description:action.description}
        case 'SET_EDIT_PUBLISH_PRICE':
            return {...state,price:action.price}
        default:
            return state
    }
}
export function beforeUpload(file) {
    // console.log(file.type)
    const isIMAGE = file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/bmp';// 允许上传图片的格式
    // const isIMAGE = true// 允许任何类型上传
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isIMAGE) {
        message.error('图片格式错误!');
    }else if (!isLt2M) {
        message.error('图片不能超过2MB!');
    }
    return{
        pictureType:isIMAGE && isLt2M,
        type:'EDIT_BEFORE_UPLOAD'
    }
}
export function clearData() {
    return {
        type:'EDIT_CLEAR_DATA'
    }
}
export function editMyPublishUploading() {
    return {
        type:'EDIT_MY_PUBLISH_UPLOADING'
    }
}
export function getMyPublish(doc) {
    return {
        doc,
        type:"EDIT_GET_MY_PUBLISH"
    }
}
export function handleChange(fileList) {
    return{
        fileList,
        type:'EDIT_HANDLE_CHANGE'
    }
}
export function handlePreview(previewImage) {
    return{
        previewImage,
        type:'EDIT_HANDLE_PREVIEW'
    }

}
export function handleUnPreview() {
    return{
        type:'EDIT_HANDLE_UN_PREVIEW'
    }
}
export function setEditPublishTitle(title) {
    return {
        title,
        type:'SET_EDIT_PUBLISH_TITLE'
    }
}
export function setEditPublishDescription(description) {
    return {
        description,
        type:'SET_EDIT_PUBLISH_DESCRIPTION'
    }
}
export function setEditPublishPrice(price) {

    return{
        price,
        type:'SET_EDIT_PUBLISH_PRICE'
    }
}