import React from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'


import {authDataSuccess} from '../../redux/redux.user'

@withRouter
@connect(
    state => state,
    {authDataSuccess}
)

class Auth extends React.Component{
    constructor(props){
        super(props)
    }
    componentDidMount(){
        console.log('auth')

        // console.log(this.props.location.pathname)
        if(this.props.location.pathname === '/'
            || this.props.location.pathname === '/browser'
            || this.props.location.pathname === '/publish'
            || this.props.location.pathname === '/message'
            || this.props.location.pathname === '/me'){
        }else{
            // this.authData()
            // 验证用户信息状态管理-是否有登录信息。
            // 在刷新页面的时候，'/' '/browser' '/publish' '/message' '/me' 不authData,
            // 因为footerLink已经authData，不需要重复authData
        }
    }
    componentDidUpdate(){
        // console.log(this.props.user)
    }
    authData() {
        // 获取用户信息
        axios.post('/authData').then( res => {
            if(res.status === 200 && res.data.code === 1 && res.data.msg === '有用户登录信息'){
                this.props.authDataSuccess(res.data.data)
            }else{
                window.location.href="/";// 重刷新 '/'
            }
        })
    }
    render(){
        return null
    }
}
export default Auth