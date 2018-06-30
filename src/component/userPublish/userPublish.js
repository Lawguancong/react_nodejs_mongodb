import React from 'react'
import {Icon,message,Button} from 'antd'
import axios from 'axios'
import {connect} from 'react-redux'
import $ from 'jquery'



@connect(
    state => state,
    {}
)
class UserPublish extends React.Component{
    constructor(props){
        super(props)
        this.state = {

        }
    }
    componentDidMount(){
        console.log(this.state.userPublishList)

        axios.post('/getUserPublish',{publisher:this.props.match.params._id}).then( res => {
            if(res.status === 200 && res.data.code === 0 && res.data.msg === '后端数据库出错'){
                message.error('后端数据库出错，稍后再试!')
            }else if(res.status === 200 && res.data.code === 1 && res.data.msg === '获取对方用户发布的所有宝贝成功'){


                if(res.data.userPublishList.length === 0 ){
                    $('.user-publish-list').html('对方什么都没有')
                    // console.log('对方什么都没有')
                }else{
                    this.setState({
                        userPublishList:[...res.data.userPublishList]
                    })
                }
            }
        })
    }
    componentDidUpdate(){
        console.log(this.state.userPublishList)
    }
    render(){
        return(
            <div>
                <div className="header">
                    <Icon onClick={() => this.props.history.goBack()} type="left"/>
                    <span style={{color:'white'}}>Ta发布的宝贝</span>
                </div>
                <div className="user-publish-list" style={{paddingTop:'50px',paddingBottom:'20px'}}>
                    {this.state.userPublishList === undefined ? (null) : (
                        this.state.userPublishList.map( v => {
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
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        )
    }
}
export default UserPublish