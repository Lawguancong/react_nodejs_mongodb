import React from 'react'
import {Icon} from 'antd'
import axios from 'axios'
import './userFocus.css'
import browserCookie from 'browser-cookies'


class UserFocus extends React.Component{
    constructor(props){
        super(props)
        this.state = {

        }
    }
    componentDidMount(){
        // console.log('componentDidMount')
        console.log(this.state.userFocusList)
        axios.post('/getUserFocusList',{focusId:this.props.match.params._id}).then( res => {
            // console.log(res)
            // console.log(res.data.userFocusList)
            this.setState({
                userFocusList:[...res.data.userFocusList]
            })
        })
    }
    componentDidUpdate(){
        // console.log('')
        console.log(this.state.userFocusList)

    }
    redirectToUser(_id){
        console.log(_id)
        // const _id = browserCookie.get('_id').split('"')[1]// _id 为当前用户登录的cookies:_id
        // console.log(_id)
        if(browserCookie.get('_id').split('"')[1] === _id){
            this.props.history.push('/me')

        }else{
            this.props.history.push(`/user/${_id}`)
        }
    }
    render(){
        return(
            <div style={{paddingTop:'50px',paddingBottom:'20px'}}>
                <div className="header">
                    <Icon onClick={() => this.props.history.goBack()} type="left"/>
                    <span style={{color:'white'}}>Ta的关注</span>
                </div>
                <div className="user-focus-list">
                    {this.state.userFocusList === undefined ? (null) : (
                        this.state.userFocusList.length === 0 ? (<div>Ta还没有关注哦~</div>) : (
                            this.state.userFocusList.map( v => {
                                return(
                                    <div className="user-focus-details" key={v._id}>
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
export default UserFocus