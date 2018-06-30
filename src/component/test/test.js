import React from 'react'
import { List, InputItem, Radio, WingBlank, WhiteSpace, Button} from 'antd-mobile'
import ReactCoreImageUpload  from 'react-core-image-upload';
class Test extends React.Component {
    constructor(props){
        super(props)
        this.handleRes = this.handleRes.bind(this)
        this.imageChanged = this.imageChanged.bind(this)
        this.imageUploading = this.imageUploading.bind(this)
        this.errorHandle = this.errorHandle.bind(this)
    }
    handleRes(res) {
        this.setState({
            // handle response
        })
        console.log(res)
    }
    imageChanged(a,b){
        console.log(a+'--------'+b)

    }
    imageUploading(a,b){
        console.log(a+'--------'+b)

    }
    errorHandle(a,b){
        console.log(a+'--------'+b)

    }
    render(){
        return(
            <div>
                <ReactCoreImageUpload
                    text="Upload Your Image"
                    class={['pure-button', 'pure-button-primary', 'js-btn-crop']}
                    inputOfFile="files"
                    url="/uploadAvatar"
                    imageUploaded={this.handleRes}
                    imageChanged={this.imageChanged}
                    imageUploading={this.imageUploading}
                    errorHandle={this.errorHandle}>
                </ReactCoreImageUpload>
            </div>
        )
    }
}
export default Test


// import React from 'react'
// import { List, InputItem, Radio, WingBlank, WhiteSpace, Button} from 'antd-mobile'
// import ReactCoreImageUpload  from 'react-core-image-upload';

// import { Upload, Icon, message } from 'antd';
// import './test.css'
// function getBase64(img, callback) {
//     const reader = new FileReader();
//     reader.addEventListener('load', () => callback(reader.result));
//     reader.readAsDataURL(img);
// }
//
// function beforeUpload(file) {
//     // console.log(file)
//     // console.log(file.type)
//     const isIMAGE = file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg';// 允许上传图片的格式
//     // const isIMAGE = true// 允许任何类型上传
//     if (!isIMAGE) {
//         message.error('图片格式错误');
//     }
//     const isLt2M = file.size / 1024 / 1024 < 2;
//     if (!isLt2M) {
//         message.error('图片不能超过2MB!');
//     }
//     return isIMAGE && isLt2M;
// }
//
// class Test extends React.Component {
//     state = {
//         loading: false,
//     };
//     handleChange = (info) => {
//         if (info.file.status === 'uploading') {
//             this.setState({ loading: true });
//             return;
//         }
//         if (info.file.status === 'done') {
//             // Get this url from response in real world.
//             getBase64(info.file.originFileObj, imageUrl => {
//                 this.setState({
//                     imageUrl,
//                     loading: false,
//                 })
//                 console.log(imageUrl)
//                 // document.getElementById("imggg").setAttribute("src", imageUrl);
//             });
//         }
//     }
//     componentDidUpdata(){
//         // console.log(this.state)
//     }
//     render() {
//         const uploadButton = (
//             <div>
//                 <Icon type={this.state.loading ? 'loading' : ''} />
//                 <div className="ant-upload-text"></div>
//             </div>
//         );
//         const imageUrl = this.state.imageUrl;
//         const RadioItem = Radio.RadioItem
//
//         return (
//             <div>
//                 {/*<img id="imggg" src="" alt=""/>*/}
//                 <Upload
//                     name="avatar"
//                     listType="picture-card"
//                     className="avatar-uploader"
//                     showUploadList={false}
//                     // multiple={true}
//                     action="/uploadAvatar"
//                     beforeUpload={beforeUpload}
//                     onChange={this.handleChange}
//                 >
//                     {imageUrl ? <img src={imageUrl} alt="" /> : uploadButton}
//                 </Upload>
//                 <WingBlank>
//                     <List>
//                         <InputItem
//                             placeholder="请输入昵称"
//                             onChange={val=>this.handleChange('nickname',val)}
//                         >昵称</InputItem>
//                         <WhiteSpace/>
//                         <RadioItem
//                             checked={this.state.gender==='man'}
//                             onChange={()=>this.handleChange('gender','man')}
//                         >男</RadioItem>
//                         <WhiteSpace/>
//                         <RadioItem
//                             checked={this.state.gender==='woman'}
//                             onChange={()=>this.handleChange('gender','woman')}
//                         >女</RadioItem>
//                         <WhiteSpace/>
//                         <InputItem
//                             placeholder="请输入个性签名"
//                             onChange={val=>this.handleChange('signature',val)}
//                         >个性签名</InputItem>
//                         <WhiteSpace/>
//                         <Button
//                             onClick={()=>this.savePersonalData()}
//                             type="primary"
//                         >保存</Button>
//                     </List>
//                 </WingBlank>
//             </div>
//
//         );
//     }
// }
// export default Test
