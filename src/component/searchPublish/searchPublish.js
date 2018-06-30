import React from 'react'
import axios from 'axios'
import {Icon,Input, Card, Avatar,message } from 'antd'
import './searchPublish.css'
import $ from 'jquery'

class SearchPublish extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            publishList:null
        }
    }
    componentDidMount(){
        console.log('componentDidMount')
        axios.post('/searchPublish',{publishTitle:this.props.match.params.publishTitle}).then( res => {
            if(res.status === 200 && res.data.code === 1 && res.data.msg === '搜索物品成功!'){
                // this.props.history.push(`/user/${res.data._id}`)
                $('div.publishList').empty()
                this.setState({publishList:res.data.publishList})
            }else if(res.status === 200 && res.data.code === 0 && res.data.msg === '没有搜索到您要找的物品!'){
                this.setState({publishList:null})
                $('div.publishList').html('<h3>没有搜索到您要找的物品!</h3>')

            }
        })

    }
    componentDidUpdate(){
        console.log('componentDidUpdate')
        console.log(this.state)
    }
    onSearch(value){
        // console.log(value)
        if(value.trim().length !== 0){
            this.props.history.push(`/searchPublish/${value}`)
            axios.post('/searchPublish',{publishTitle:value}).then( res => {
                if(res.status === 200 && res.data.code === 1 && res.data.msg === '搜索物品成功!'){
                    // this.props.history.push(`/user/${res.data._id}`)
                    $('div.publishList').empty()
                    this.setState({publishList:res.data.publishList})
                }else if(res.status === 200 && res.data.code === 0 && res.data.msg === '没有搜索到您要找的物品!'){
                    this.setState({publishList:null})
                    $('div.publishList').html('<h3>没有搜索到您要找的物品!</h3>')

                }
            })
        }

    }
    render(){
        const Search = Input.Search;
        const { Meta } = Card;
        return(
            <div style={{paddingTop:'50px'}}>
                <div className="" style={{height:'50px',backgroundColor:'#fff',width:'100%',lineHeight:'0',position:'fixed',top:'0',textAlign:'right',boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'}}>
                    <Icon onClick={() => this.props.history.push('/')} type="left" style={{position: 'absolute',top:'0',left:'0',fontSize:'16px',color:'#d2d2d2',marginLeft:'5%',lineHeight:'50px'}}/>
                    <Search
                        onSearch={value => this.onSearch(`${value}`)}
                        enterButton
                        defaultValue={this.props.match.params.publishTitle}
                        placeholder='搜索物品...'
                        // onChange={(e) => this.setState({chatText:e.target.value})}
                        maxLength={11}
                        style={{width:'85%',lineHeight:'50px',marginRight:'15px'}}
                    />
                </div>
                <div className="publishList" style={{marginTop:'10px'}}>
                    {this.state.publishList === null ? (null) : (
                        this.state.publishList.map( value => {
                            return(
                                <div className="" key={value._id} onClick={() => this.props.history.push(`/publishDetails/${value._id}`)} style={{width:'48%',display:'inline-block',margin:'0 1%'}}>
                                    <div className="">
                                        <img alt="example" src={value.mainImg} style={{width:'100%'}} />
                                        <p style={{overflow: 'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',fontWeight:'bold'}}>{value.title}</p>
                                        <p><span style={{color:'red',fontWeight:'600'}}>￥{value.price}</span> <span style={{float:'right',marginRight:'5px'}}>浏览:{value.clickNum}</span></p>
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
export default SearchPublish