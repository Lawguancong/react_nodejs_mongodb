import React from 'react'
import {connect} from 'react-redux'
import {Icon,Input,Button,message} from 'antd'
import axios from 'axios'
import {authDataSuccess} from '../../redux/redux.user'

@connect(
    state => state,
    {authDataSuccess}
)
class UpdatePassword extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            exPassword:'',// 原密码
            updatePassword:'',// 修改后的密码
            isUpdatePassword:false,// 是否发送ajax重置密码
        }
    }
    componentDidMount(){
        this.authData()

    }
    authData(){
        // 获取用户信息
        axios.post('/authData').then( res => {
            if(res.status === 200 && res.data.code === 1 && res.data.msg === '有用户登录信息'){
                this.props.authDataSuccess(res.data.data)// 如果有用户登录信息，则更新redux的用户数据
            }else{
                // window.location.href="/";// 重刷新 '/'
                this.props.history.push('/')

            }
        })
    }
    handleChange = (e,key) => {
        // console.log(e)
        // console.log( e.target.value)
        // console.log(key)
        this.setState({
            [key]:e.target.value
        });
    }
    updatePassword(){
        // console.log('updatePassword')
        // console.log(this.state)

        const passwordReg = new RegExp(" ")// 过滤密码非法字符，防止数据库注入安全
        if(this.state.exPassword === ''){
            message.error('请输入原密码');
        }else if(this.state.updatePassword === ''){
            message.error('请输入新密码');
        }else if(passwordReg.test(this.state.updatePassword)) {
            message.error('新密码含有非法字符');
        }else{
            const _self = this
            this.setState({
                isUpdatePassword:true
            })
            axios.post('/updatePassword',{exPassword:this.state.exPassword,updatePassword:this.state.updatePassword}).then( res => {
                if(res.status=== 200 && res.data.code === 0 && res.data.msg === '后端数据库出错') {
                    message.error('后端数据库出错，稍后再试！');
                }else if(res.status=== 200 && res.data.code === 0 && res.data.msg === '原密码错误'){
                    message.error('原密码错误!');
                }else if(res.status=== 200 && res.data.code === 0 && res.data.msg === '新密码与原密码一样'){
                    message.error('新密码与原密码一样!');
                }else if(res.status=== 200 && res.data.code === 1 && res.data.msg === '密码修改成功'){
                    message.success('密码修改成功!');
                    setTimeout(function () {
                        _self.props.history.goBack()
                    },1000)
                }
                this.setState({
                    isUpdatePassword:false
                })
            })

        }

    }
    render(){
        return(
            <div style={{paddingTop:'50px'}}>
                <div className="header" style={{height:'50px',backgroundColor:'rgb(54,54,59)',width:'100%',lineHeight:'50px'}}>
                    <Icon onClick={() => this.props.history.goBack()} type="left" style={{fontSize:'16px',color:'white',marginLeft:'5%',lineHeight:'50px'}}/>
                </div>
                <div style={{width:'80%',margin:'20px auto'}}>
                    <Input placeholder="原密码" value={this.state.exPassword} type='password' maxLength={20} onChange={e => this.handleChange(e,'exPassword')}/>
                    <br/><br/>
                    <Input placeholder="新密码" value={this.state.updatePassword} type='password' maxLength={20} onChange={e => this.handleChange(e,'updatePassword')}/>
                    <br/><br/>
                    <Button onClick={() => this.updatePassword()} disabled={this.state.isUpdatePassword} type="primary" size='large' style={{width:'100%'}}>修改密码</Button>
                    <br/><br/>
                </div>
            </div>
        )
    }
}
export default UpdatePassword