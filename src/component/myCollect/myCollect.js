import React from 'react'
import axios from 'axios'
import './myCollect.css'
import {Icon} from 'antd'
import {authDataSuccess} from '../../redux/redux.user'
import {connect} from 'react-redux'


@connect(
    state => state,
    {authDataSuccess}
)
class MyCollect extends React.Component{
    constructor(props){
        super(props)
        this.state = {

        }
    }
    componentDidMount(){
        if(!this.props.user.userData) {
            this.authData()
        }else{
            this.getMyCollectList()

        }
    }
    componentDidUpdate(){
    }
    authData(){
        // 获取用户信息
        axios.post('/authData').then( res => {
            if(res.status === 200 && res.data.code === 1 && res.data.msg === '有用户登录信息'){
                this.props.authDataSuccess(res.data.data)// 如果有用户登录信息，则更新redux的用户数据
                this.getMyCollectList()


            }else{
                // window.location.href="/";// 重刷新 '/'
                this.props.history.push('/')
            }
        })
    }
    deleteMyCollect(publishDetailsId){
        axios.post('/deleteMyCollect',{publishDetailsId}).then( res => {
            if(res.status === 200 && res.data.code === 1 && res.data.msg === '删除收藏失效的宝贝成功'){
                this.getMyCollectList()
            }
        })
    }
    getMyCollectList(){
        axios.post('/getMyCollectList').then( res => {
            if(res.status === 200 && res.data.code === 1 && res.data.msg === '获取我所有的收藏成功'){
                this.setState({
                    myCollectList:[...res.data.myCollectList]
                })
            }
        })
    }
    render(){
        return(
            <div style={{paddingTop:'50px',paddingBottom:'20px'}}>
                <div className="header">
                    <Icon onClick={() => this.props.history.goBack()} type="left"/>
                    <span style={{color:'white'}}>我的收藏</span>
                </div>
                {this.state.myCollectList === undefined ? (null) : (
                    this.state.myCollectList.length === 0 ? (<div>啥都没收藏</div>) : (
                        this.state.myCollectList.map( v => {
                            if(v.isDeleted === true){
                                return (
                                    <div className="my-collect-details">
                                        <div className="img"></div>
                                        <span className="title">该宝贝已删除!</span>
                                        <div className="description" style={{textAlign:'right'}}>
                                            <span style={{color:'red'}} onClick={() => this.deleteMyCollect(`${v.publishDetailsId}`)}>删除</span>
                                        </div>
                                    </div>
                                )
                            }else {
                                return (
                                    <div className="my-collect-details" onClick={() => this.props.history.push(`/publishDetails/${v.publishDetailsId}`)}>
                                        <div className="img">
                                            <img src={v.mainImg} style={{width:'40px'}} alt=""/>
                                        </div>
                                        <span className="title">{v.title}</span>
                                        <span className="price">￥{v.price}</span>
                                        <span className="classification">{v.classification}</span>
                                        <span className="clickNum">浏览 {v.clickNum}</span>
                                        <div className="description">
                                            <p>{v.description}</p>
                                        </div>
                                    </div>
                                )
                            }
                        })
                    )

                )}
            </div>
        )
    }
}
export default MyCollect