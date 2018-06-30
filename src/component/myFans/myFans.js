import React from 'react'
import {Icon} from 'antd'
import axios from 'axios'
import './myFans.css'
import {authDataSuccess} from '../../redux/redux.user'
import {connect} from 'react-redux'


@connect(
    state => state,
    {authDataSuccess}
)
class MyFans extends React.Component{
    constructor(props){
        super(props)
        this.state = {

        }
    }
    componentDidMount(){
        // console.log('componentDidMount')
        // console.log(this.state.myFansList)
        if(!this.props.user.userData) {
            this.authData()
        }else{
            this.getMyFansList()

        }

    }
    componentDidUpdate(){
        // console.log('')
        // console.log(this.state.myFansList)

    }
    getMyFansList(){
        axios.post('/getMyFansList').then( res => {
            // console.log(res)
            this.setState({
                myFansList:[...res.data.myFansList]
            })
        })
    }
    authData(){
        // 获取用户信息
        axios.post('/authData').then( res => {
            if(res.status === 200 && res.data.code === 1 && res.data.msg === '有用户登录信息'){
                this.props.authDataSuccess(res.data.data)// 如果有用户登录信息，则更新redux的用户数据
                this.getMyFansList()

            }else{
                // window.location.href="/";// 重刷新 '/'
                this.props.history.push('/')
            }
        })
    }
    render(){
        return(
            <div style={{paddingTop:'50px',paddingBottom:'20px'}}>
                <div className="header">
                    <Icon onClick={() => this.props.history.goBack()} type="left"/>
                    <span style={{color:'white'}}>我的粉丝</span>
                </div>
                <div className="my-fans-list">
                    {this.state.myFansList === undefined ? (null) : (
                        this.state.myFansList.length === 0 ? (<div>还没有粉丝哦~</div>) : (
                            this.state.myFansList.map( v => {
                                return(
                                    <div className="my-fans-details" style={{padding:'5px 0'}}>
                                        <div className="" style={{display:'inline-block',position:'relative',verticalAlign:'top'}}>
                                            <img style={{width: '60px', height: '60px',borderRadius: '100%'}} src={v.avatarName}alt="" onClick={() => this.props.history.push(`/user/${v._id}`)}/>
                                        </div>
                                        <div className="" style={{display:'inline-block',maxWidth:'75%',marginLeft:'10px'}}>
                                            <p style={{position:'relative',margin:'0',fontWeight:'bold'}}>{v.nickName}{v.gender  === '男' ? (<img style={{width:'24px',verticalAlign:'top'}} src={require(`./img/male.png`)} alt=""/>) : (<img style={{width:'24px',verticalAlign:'top'}} src={require(`./img/female.png`)} alt=""/>)}</p>
                                            <p style={{overflow: 'hidden', textOverflow:'ellipsis', whiteSpace: 'nowrap',margin:'0'}}>{v.signature}</p>
                                            <p style={{margin:'0',color:'gray'}}>{v.fans}位粉丝</p>
                                        </div>
                                    </div>
                                )
                            })
                        )
                    )}
                </div>
            </div>
        )
    }
}
export default MyFans