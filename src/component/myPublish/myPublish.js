import React from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import { Popconfirm, message, Button ,Icon} from 'antd';
import './myPublish.css'
import {doDeletePublish,getMyPublishList} from '../../redux/redux.myPublish'
import {authDataSuccess} from '../../redux/redux.user'

import $ from 'jquery'

@connect(
    state => state,
    {doDeletePublish,getMyPublishList,authDataSuccess}
)
class MyPublish extends React.Component{
    constructor(props){
        super(props)
        this.deletePublish = this.deletePublish.bind(this)
        this.getMyPublish = this.getMyPublish.bind(this)
    }
    componentDidMount(){
        if(!this.props.user.userData) {
            this.authData()
        }else{
            this.getMyPublish()

        }


    }
    authData(){
        // 获取用户信息
        axios.post('/authData').then( res => {
            if(res.status === 200 && res.data.code === 1 && res.data.msg === '有用户登录信息'){
                this.props.authDataSuccess(res.data.data)// 如果有用户登录信息，则更新redux的用户数据
                this.getMyPublish()

            }else{
                // window.location.href="/";// 重刷新 '/'
                this.props.history.push('/')
            }
        })
    }

    componentDidUpdate(){
    }
    deletePublish(_id){
        axios.post('/doDeletePublish',{_id}).then( res => {
            if(res.status === 200 && res.data.code === 0 && res.data.msg === '后端数据库出错'){
                message.error('后端数据库出错，稍后再试!')
            }else if(res.status === 200 && res.data.code === 0 && res.data.msg === '删除我发布的宝贝失败'){
                message.error('删除我发布的宝贝失败!')
            }else if(res.status === 200 && res.data.code === 1 && res.data.msg === '删除我发布的宝贝成功'){
                message.success('删除我发布的宝贝成功!')
                this.getMyPublish()
            }
        })
    }
    getMyPublish(){
        axios.post('/getMyPublish').then( res => {
            // this.setState({myPublishList:[...res.data.myPublishList]})
            if(res.status === 200 && res.data.code === 0 && res.data.msg === '后端数据库出错'){
                message.error('后端数据库出错，稍后再试!')
            }else if(res.status === 200 && res.data.code === 1 && res.data.msg === '获取我发布的所有宝贝成功'){
                this.props.getMyPublishList(res.data.myPublishList)
                // console.log(res.data.myPublishList)
                if(res.data.myPublishList.length === 0 ){
                    $('.my-publish-list').html('什么都没有')
                }
            }
        })
    }
    render(){
        return(
            <div>
                <div className="header">
                    <Icon onClick={() => this.props.history.goBack()} type="left"/>
                    <span style={{color:'white'}}>我发布的</span>
                </div>
                <div className="my-publish-list" style={{paddingTop:'50px',paddingBottom:'20px'}}>
                    {this.props.myPublish.myPublishList.length === 0 ? (null) : (
                            this.props.myPublish.myPublishList.map( v => {
                                return (
                                    <div key={v._id} className="my-publish-one">
                                        <div className="top" onClick={ () => this.props.history.push(`/publishDetails/${v._id}`)}>
                                            <div className="img">
                                                <img  src={v.mainImg} alt="" />
                                            </div>
                                            <span className="title" style={{}}>{v.title}</span>
                                            <span style={{position:'absolute',left:'103px',top:'45px',fontSize:'15px',color:'#ff4238',}}>￥{v.price}</span>
                                            <span style={{position:'absolute',left:'103px',top:'80px',fontSize:'12px'}}>留言{v.commentNum} • 浏览{v.clickNum}</span>
                                        </div>
                                        <div className="bottom" style={{textAlign:'right'}}>
                                            {/*<span onClick={() => this.props.history.push(`/editMyPublish/${v._id}`)}>编辑</span>&nbsp;&nbsp;&nbsp;*/}
                                            {/*<span>编辑</span>&nbsp;&nbsp;&nbsp;*/}
                                            <Popconfirm placement="topRight" title='您确定要删除这个宝贝吗!' onConfirm={()=>this.deletePublish(`${v._id}`)} okText="确定" cancelText="取消">
                                                <Button type="danger" size="small" style={{fontSize:'10px'}}>删除</Button>
                                                {/*<span>删除</span>*/}
                                            </Popconfirm>
                                        </div>
                                    </div>
                                )
                            })
                    )}
                </div>
            </div>
        )
    }
}
export default MyPublish