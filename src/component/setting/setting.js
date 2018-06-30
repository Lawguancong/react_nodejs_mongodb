import React from 'react'
import {connect} from 'react-redux'
import { Button,Modal ,Input ,Radio,Row, Col ,Icon,message} from 'antd';
import browserCookie from 'browser-cookies'
import {doLogout,doUpdateNickName,doUpdateSignature,authDataSuccess} from '../../redux/redux.user'
import './setting.css'
import axios from 'axios'



const confirm = Modal.confirm;

@connect(
    state => state,
    {doLogout,doUpdateNickName,doUpdateSignature,authDataSuccess}
)
class Setting extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            updateNickNameVisible: false,
            nickNameLength:null,// 设置昵称剩余的长度

            updateSignatureVisible: false,
            signatureLength:null,// 设置个性剩余的长度

        }
        this.showConfirm = this.showConfirm.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.nickNameOnChange = this.nickNameOnChange.bind(this)
    }
    componentWillReceiveProps (nextProps) {
        // console.log(nextProps)
        // console.log('componentWillReceiveProps')
        // this.authData()
    }
    componentDidMount(){
        // console.log('componentDidMount')
        // const _self = this
        // console.log(this.props.user.nickName)
        if(!this.props.user.userData) {
            this.authData()
        }
    }
    componentDidUpdate(){
        // console.log('componentDidUpdate')
    }
    authData(){
        // 获取用户信息
        axios.post('/authData').then( res => {
            if(res.status === 200 && res.data.code === 1 && res.data.msg === '有用户登录信息'){
                this.props.authDataSuccess(res.data.data)// 如果有用户登录信息，则更新redux的用户数据
            }else{
                window.location.href="/";// 重刷新 '/'
            }
        })
    }
    showConfirm() {
        const _self = this
        confirm({
            title: '是否退出登录？',
            cancelText:'取消',
            okText:'确定',
            onOk() {
                browserCookie.erase('_id')
                browserCookie.erase('phone')
                browserCookie.erase('pwd')
                _self.props.doLogout()
                window.location.href="/";// 重刷新 '/'
            },
            onCancel() {

            },
        });
    }

    handleChange = (e,key) => {
        this.setState({
            [key]:e.target.value
        });
    }
    doUpdateNickName(){
        if(document.getElementById('nickName').value === this.props.user.nickName){
            message.warning('昵称与原来一样!');
        }else{
            const nickNameReg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]")// 过滤昵称非法字符，防止数据库注入安全
            if(document.getElementById('nickName').value === ''){
                message.error('请输入昵称');
            }else if(nickNameReg.test(document.getElementById('nickName').value)) {
                message.error('昵称含有非法字符');
            }else{
                const _self = this
                let nickName = document.getElementById('nickName').value
                axios.post('/updateNickName',{nickName}).then( res=> {
                    if(res.status === 200 && res.data.code === 0 && res.data.msg === '保存昵称失败') {
                        message.error('保存昵称失败，请重新保存!')
                        _self.props.doUpdateNickName(nickName,'保存昵称失败')
                    }else if(res.status === 200 && res.data.code === 1 && res.data.msg === '保存昵称成功'){
                        message.success('保存昵称成功!')
                        _self.props.doUpdateNickName(nickName,'保存昵称成功')
                        _self.setState({
                            updateNickNameVisible:false
                        });
                    }
                })
            }
        }
    }
    showUpdateNickNameModal(){
        this.setState({
            updateNickNameVisible:true
        });
    }
    hideUpdateNickNameModal(){
        this.setState({
            updateNickNameVisible:false,
            nickNameLength:null
        });
        document.getElementById('nickName').value = this.props.user.nickName
    }
    nickNameOnChange = (e) => {
        this.setState({
            nickNameLength:(11-e.target.value.length < 0) ? (0) : (11-e.target.value.length)
        })
    }

    doUpdateSignature(){
        if(document.getElementById('signature').value === this.props.user.signature){
            message.warning('个性签名与原来一样!');
        }else{
            const _self = this
            let signature = document.getElementById('signature').value
            axios.post('/updateSignature',{signature}).then( res=> {
                if(res.status === 200 && res.data.code === 0 && res.data.msg === '保存个性签名失败') {
                    message.error('保存个性签名失败，请重新保存!')
                    _self.props.doUpdateSignature(signature,'保存个性签名失败')
                }else if(res.status === 200 && res.data.code === 1 && res.data.msg === '保存个性签名成功'){
                    message.success('保存个性签名成功!')
                    _self.props.doUpdateSignature(signature,'保存个性签名成功')
                    _self.setState({
                        updateSignatureVisible:false
                    });
                }
            })
        }
    }
    showUpdateSignatureModal(){
        this.setState({
            updateSignatureVisible:true
        });
    }
    hideUpdateSignature(){
        this.setState({
            updateSignatureVisible:false,
            signatureLength:null
        });
        document.getElementById('signature').value = this.props.user.signature
    }
    signatureOnChange = (e) => {
        this.setState({
            signatureLength:(30-e.target.value.length < 0) ? (0) : (30-e.target.value.length)
        })
    }

    render(){
        const { TextArea } = Input;
        // console.log(this.props.user.nickName)
        // console.log(2)
        return(
            <div>


                {this.props.user.phone === ''
                    ? (null)
                    : (<div>
                        <Modal
                            title="设置昵称"
                            wrapClassName="vertical-center-modal"
                            visible={this.state.updateNickNameVisible}
                            onOk={() => this.doUpdateNickName()}
                            onCancel={() => this.hideUpdateNickNameModal()}
                            okText="保存"
                            cancelText="取消"
                        >
                            <br/>
                            <Input id="nickName" size="large" defaultValue={this.props.user.nickName} maxLength={11} onChange={this.nickNameOnChange}/>
                            <p style={{textAlign:'right'}}>{this.state.nickNameLength}&nbsp;</p>

                        </Modal>

                        <Modal
                            title="设置个性签名"
                            wrapClassName="vertical-center-modal"
                            visible={this.state.updateSignatureVisible}
                            onOk={() => this.doUpdateSignature()}
                            onCancel={() => this.hideUpdateSignature()}
                            okText="保存"
                            cancelText="取消"
                        >
                            <br/>
                            <TextArea id="signature" defaultValue={this.props.user.signature} maxLength={30} autosize={{ minRows: 2, maxRows: 6 }} onChange={this.signatureOnChange}/>
                            <p style={{textAlign:'right'}}>{this.state.signatureLength}&nbsp;</p>

                        </Modal>

                        <div className="header" style={{height:'50px',backgroundColor:'rgb(54,54,59)',width:'100%',lineHeight:'50px'}}>
                            <Icon onClick={() => this.props.history.goBack()} type="left" style={{fontSize:'16px',color:'white',marginLeft:'5%',lineHeight:'50px'}}/>
                        </div>
                            <div style={{paddingTop:'50px'}}>
                                <div className="row" style={{height:'50px',lineHeight:'50px'}} onClick={() => this.showUpdateNickNameModal()}>
                                    <div className="left">昵称</div>
                                    <div className="right">{this.props.user.nickName} <Icon type="right" style={{fontSize:'16px'}}/></div>
                                </div>
                                <div className="row" style={{height:'50px',lineHeight:'50px'}}>
                                    <div className="left">手机号</div>
                                    <div className="right">{this.props.user.phone}</div>
                                </div>
                                <div className="row" style={{height:'50px',lineHeight:'50px'}}>
                                    <div className="left">性别</div>
                                    <div className="right">{this.props.user.gender}</div>
                                </div>
                                <div className="row" onClick={() => this.showUpdateSignatureModal()}>
                                    <div className="left" style={{lineHeight:'50px',verticalAlign:'middle'}}>个性签名</div>
                                    <div className="right" style={{lineHeight:'50px',height:'100%'}}><Icon type="right" style={{fontSize:'16px'}}/></div>
                                    <div className="signature"><span style={{}}>{this.props.user.signature}</span></div>
                                </div>
                            </div>
                        </div>)}
                <button className='updatePassword' onClick={() => this.props.history.push('updatePassword')} style={{width:'92%',margin:'20px auto 0',display:'block'}}>修改密码</button>

                <button className='logout' onClick={this.showConfirm} style={{width:'92%',margin:'20px auto 0',display:'block'}}>退出登录</button>
            </div>
        )
    }
}
export default Setting