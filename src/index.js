import React from 'react'
import ReactDom from 'react-dom'
import {createStore,applyMiddleware,compose} from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers/reducers'
import { Provider } from 'react-redux'
import {BrowserRouter,Switch,Route} from 'react-router-dom'
import Auth from './component/auth/auth'

import Chat from './component/chat/chat'

import Forget from './component/forget/forget'
import Setting from './component/setting/setting'
import Test from './component/test/test'
import MyPublish from './component/myPublish/myPublish'
import PublishDetails from './component/publishDetails/publishDetails'
import EditMyPublish from './component/editMyPublish/editMyPublish'
import MyCollect from './component/myCollect/myCollect'
import MyFocus from './component/myFocus/myFocus'
import MyFans from './component/myFans/myFans'

import UserCollect from './component/userCollect/userCollect'
import UserFocus from './component/userFocus/userFocus'
import UserFans from './component/userFans/userFans'


import UserPublish from './component/userPublish/userPublish'

import User from './component/user/user'

import SearchUser from './component/searchUser/searchUser'
import SearchPublish from './component/searchPublish/searchPublish'
import UpdatePassword from './component/updatePassword/updatePassword'


import Home from './component/home/home'
import Browser from './component/browser/browser'
import Publish from './component/publish/publish'
import Message from './component/message/message'
import Me from './component/me/me'


import FooterLink from './component/footerLink/footerLink'


import './index.css'

//reudx数据流 -> 创建store
const store = createStore(reducers,compose(//
    applyMiddleware(thunk),// 可以让redux数据流处理异步
    window.devToolsExtension?window.devToolsExtension():f=>f
))

ReactDom.render(
    (
        <Provider store={store}>
            <BrowserRouter>
                <div>
                    {/*<Auth/>*/}
                    <Switch>
                        {/*<Route path="/browser" component={Browser}/>*/}
                        {/*<Route path="/publish" component={Publish}/>*/}
                        {/*<Route path="/message" component={Message}/>*/}
                        {/*<Route path="/me" component={Me}/>*/}

                        <Route path="/searchUser/:nickName" component={SearchUser}/>
                        <Route path="/searchPublish/:publishTitle" component={SearchPublish}/>
                        <Route path="/chat/:_id" component={Chat}/>
                        <Route path="/forget" component={Forget}/>
                        <Route path="/setting" component={Setting}/>
                        <Route path="/publishDetails/:_id" component={PublishDetails}/>
                        <Route path="/myCollect" component={MyCollect}/>
                        <Route path="/myFocus" component={MyFocus}/>
                        <Route path="/myFans" component={MyFans}/>
                        {/*<Route path="/editMyPublish/:_id" component={EditMyPublish}/>*/}
                        <Route path="/myPublish" component={MyPublish}/>
                        <Route path="/userCollect/:_id" component={UserCollect}/>
                        <Route path="/userFocus/:_id" component={UserFocus}/>
                        <Route path="/userFans/:_id" component={UserFans}/>
                        <Route path="/userPublish/:_id" component={UserPublish}/>
                        <Route path="/user/:_id" component={User}/>
                        <Route path="/updatePassword" component={UpdatePassword}/>

                        <Route path="/browser" component={Browser}/>
                        <Route path="/publish" component={Publish}/>
                        <Route path="/message" component={Message}/>
                        <Route path="/me" component={Me}/>
                        <Route path="/" component={Home}/>


                        <Route path="/test" component={Test}/>
                        {/*<Route component={FooterLink}/>*/}
                    </Switch>
                </div>
            </BrowserRouter>
        </Provider>

    ),
    document.getElementById('root')
)








