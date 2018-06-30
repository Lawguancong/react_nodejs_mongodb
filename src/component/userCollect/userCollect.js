import React from 'react'
import axios from 'axios'
import {Icon} from 'antd'
import $ from 'jquery'



class UserCollect extends React.Component{
    constructor(props){
        super(props)
        this.state = {

        }
    }
    componentDidMount(){
        // console.log(this.state.userCollectList)
        const {_id} = this.props.match.params
        axios.post('/getUserCollect',{_id}).then( res => {
            if(res.status === 200 && res.data.code ===1 && res.data.msg ==='获取对方用户收藏的宝贝成功'){
                // console.log(res.data.userCollectList)
                this.setState({
                    userCollectList:[...res.data.userCollectList]
                })
                if(res.data.userCollectList.length === 0){
                    $('div.user-collect').html('<h3>啥都没有收藏!</h3>')
                }
            }else{

            }
        })
    }
    componentDidUpdate(){
        // console.log(this.state.userCollectList)
    }
    render(){
        return(
            <div style={{paddingTop:'50px'}}>
                <div className="header">
                    <Icon onClick={() => this.props.history.goBack()} type="left"/>
                    <span style={{color:'white'}}>Ta的收藏</span>
                </div>
                <div className="user-collect">
                    {this.state.userCollectList === undefined ? (null) : (
                        this.state.userCollectList.map( v => {
                            if(v.isDeleted === true){
                                return (
                                    <div className="my-collect-details">
                                        <div className="img"></div>
                                        <span className="title">该宝贝已删除!</span>
                                        <div className="description" style={{textAlign:'right'}}>
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
                    )}
                </div>

            </div>
        )
    }
}
export default UserCollect