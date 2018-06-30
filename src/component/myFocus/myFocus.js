import React from 'react'
import {Icon} from 'antd'
import axios from 'axios'
import './myFocus.css'
import {authDataSuccess} from '../../redux/redux.user'
import {connect} from 'react-redux'


@connect(
    state => state,
    {authDataSuccess}
)
class MyFocus extends React.Component{
    constructor(props){
        super(props)
        this.state = {

        }
    }
    componentDidMount(){
        // console.log('componentDidMount')
        console.log(this.state.myFocusList)
        if(!this.props.user.userData) {
            this.authData()
        }else{
            this.getMyFocusList()

        }

    }
    componentDidUpdate(){
        // console.log('')
        console.log(this.state.myFocusList)

    }
    getMyFocusList(){
        axios.post('/getMyFocusList').then( res => {
            // console.log(res.data.myFocusList)
            this.setState({
                myFocusList:[...res.data.myFocusList]
            })
        })
    }
    authData(){
        // 获取用户信息
        axios.post('/authData').then( res => {
            if(res.status === 200 && res.data.code === 1 && res.data.msg === '有用户登录信息'){
                this.props.authDataSuccess(res.data.data)// 如果有用户登录信息，则更新redux的用户数据
                this.getMyFocusList()

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
                    <span style={{color:'white'}}>我的关注</span>
                </div>
                <div className="my-focus-list">
                    {this.state.myFocusList === undefined ? (null) : (
                        this.state.myFocusList.length === 0 ? (<div>啥都没关注</div>) : (
                            this.state.myFocusList.map( v => {
                                return(
                                    <div className="my-focus-details" style={{padding:'5px 0'}}>
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
export default MyFocus