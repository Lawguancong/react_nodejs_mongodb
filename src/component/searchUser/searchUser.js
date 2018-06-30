import React from 'react'
import axios from 'axios'
import {Icon,Input, Card, Avatar,message } from 'antd'
import './searchUser.css'
import $ from 'jquery'
class SearchUser extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            resultList:null
        }
    }
    componentDidMount(){
        console.log('componentDidMount')
        axios.post('/searchUser',{nickName:this.props.match.params.nickName}).then( res => {
            if(res.status === 200 && res.data.code === 1 && res.data.msg === '搜索到该用户成功!'){
                // this.props.history.push(`/user/${res.data._id}`)
                $('div.resultList').empty()
                this.setState({resultList:res.data.userList})
            }else{
                this.setState({resultList:null})
                $('div.resultList').html('<h3>没有搜索到您要找的用户!</h3>')
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
            this.props.history.push(`/searchUser/${value}`)
            axios.post('/searchUser',{nickName:value}).then( res => {
                if(res.status === 200 && res.data.code === 1 && res.data.msg === '搜索到该用户成功!'){
                    // this.props.history.push(`/user/${res.data._id}`)
                    $('div.resultList').empty()
                    this.setState({resultList:res.data.userList})
                }else{
                    this.setState({resultList:null})
                    $('div.resultList').html('<h3>没有搜索到您要找的用户!</h3>')
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
                        defaultValue={this.props.match.params.nickName}
                        placeholder='搜索用户...'
                        // onChange={(e) => this.setState({chatText:e.target.value})}
                        maxLength={11}
                        style={{width:'85%',lineHeight:'50px',marginRight:'15px'}}
                        />
                </div>
                <div className="resultList" style={{marginTop:'10px'}}>
                    {this.state.resultList === null ? (null) : (
                        this.state.resultList.map( value => {
                            return(
                                <div
                                    style={{position:'relative',width:'100%',margin:'1px auto',border:'1px solid #e8e8e8',padding:'10px 24px',zoom:'1'}}
                                    key={value._id}
                                    onClick={() => this.props.history.push(`/user/${value._id}`)}
                                >
                                    <img src={value.avatarName} alt="" style={{width:'32px',height:'32px',borderRadius:'100%'}} />
                                    <p style={{display:'inline-block',margin:'0',maxWidth:'70%',position:'relative',left:'10px'}}>{value.nickName}</p>
                                    <br/>
                                    <p  style={{
                                        display:'inline-block',
                                        margin:'5px 0 5px 0',
                                        maxWidth:'85%',
                                        // position:'absolute',
                                        // top:'40px',
                                        // left:'40px',
                                        overflow: 'hidden',
                                        textOverflow:'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>{value.signature}</p>


                                </div>

                            )
                        })
                    )}
                </div>


            </div>
        )
    }
}
export default SearchUser