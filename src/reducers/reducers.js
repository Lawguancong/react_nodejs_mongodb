//合并所有reducer 并且返回
import {combineReducers} from 'redux'
import {auth} from '../redux/redux.auth'
import {home} from '../redux/redux.home'
import {browser} from '../redux/redux.browser'
import {user} from '../redux/redux.user'
import {chat} from '../redux/redux.chat'
import {message} from '../redux/redux.message'
import {publish} from '../redux/redux.publish'
import {myPublish} from '../redux/redux.myPublish'
import {editPublish} from '../redux/redux.editPublish'
import {publishDetails} from '../redux/redux.publishDetails'


export default combineReducers({auth,home,browser,user,chat,message,publish,myPublish,editPublish,publishDetails})