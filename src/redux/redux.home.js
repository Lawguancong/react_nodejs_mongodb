

const initState = {
    isHomePage:true,// 是否为首页
    searchBoxText:'',// 首页输入框文本
    active_Fresh_Hot:'fresh',
    scrollTop:null,// 当离开首页时 记录高度，默认距离最顶部为 0
    fresh_ScrollTop:0,// 当前为首页时 记录 fresh或者hot切换时距离顶部的高度
    hot_ScrollTop:0,// 当前为首页时 记录 fresh或者hot切换时距离顶部的高度
    freshPublishList:[],
    freshPublishList_Timestamp:null,// fresh的最后一条的时间戳
    hotPublishList:[],
    hotPublishList_Timestamp:null,// hot的最后一条的时间戳
    ajax_getFreshPublish:false,
    ajax_getHotPublish:false,
    ajax_getMoreFreshPublish:false,
    ajax_getMoreHotPublish:false,
    fresh_noMore:false,
    hot_noMore:false

}

//reducer -> home
export function home(state = initState,action) {
    switch (action.type) {
        case 'SET_SEARCH_BOX_TEXT_VALUE':
            return {...state,searchBoxText:action.searchBoxText}
        case 'GET_FRESH_PUBLISH_LIST':
            return{...state,freshPublishList:[...state.freshPublishList,...action.freshPublishList],freshPublishList_Timestamp:action.freshPublishList[action.freshPublishList.length-1].publishTime}
        case 'GET_MORE_FRESH_PUBLISH_LIST':
            return{...state,ajax_getMoreFreshPublish:false,freshPublishList:[...state.freshPublishList,...action.freshPublishList],freshPublishList_Timestamp:action.freshPublishList[action.freshPublishList.length-1].publishTime}
        case 'GET_HOT_PUBLISH_LIST':
            return{...state,hotPublishList:[...state.hotPublishList,...action.hotPublishList],hotPublishList_Timestamp:action.hotPublishList[action.hotPublishList.length-1].publishTime}
        case 'GET_MORE_HOT_PUBLISH_LIST':
            return{...state,ajax_getMoreHotPublish:false,hotPublishList:[...state.hotPublishList,...action.hotPublishList],hotPublishList_Timestamp:action.hotPublishList[action.hotPublishList.length-1].publishTime}
        case 'ACTIVE_FRESH_HOT':
            return{...state,active_Fresh_Hot:action.active_Fresh_Hot}
        case 'SET_SCROLL_TOP_VALUE':
            return{...state,scrollTop:action.scrollTop}
        case 'SET_HOT_SCROLL_TOP_VALUE':
            return{...state,hot_ScrollTop:action.scrollTop}
        case 'SET_FRESH_SCROLL_TOP_VALUE':
            return{...state,fresh_ScrollTop:action.scrollTop}
        case 'FRESH_NO_MORE':
            return{...state,fresh_noMore:true}
        case 'HOT_NO_MORE':
            return{...state,hot_noMore:true}
        default:
            return state
    }
}

export function setSearchBoxTextValue(searchBoxText) {
    return{
        searchBoxText,
        type:'SET_SEARCH_BOX_TEXT_VALUE'
    }
}
export function getFreshPublishList(freshPublishList) {
    return{
        freshPublishList,
        type:'GET_FRESH_PUBLISH_LIST'
    }
}
export function getMoreFreshPublishList(freshPublishList) {
    return{
        freshPublishList,
        type:'GET_MORE_FRESH_PUBLISH_LIST'
    }
}
export function getHotPublishList(hotPublishList) {
    return{
        hotPublishList,
        type:'GET_HOT_PUBLISH_LIST'
    }
}
export function getMoreHotPublishList(hotPublishList) {
    return{
        hotPublishList,
        type:'GET_MORE_HOT_PUBLISH_LIST'
    }
}
export function active_Fresh_Hot(active_Fresh_Hot) {
    return{
        active_Fresh_Hot,
        type:'ACTIVE_FRESH_HOT'
    }
}
export function setScrollTopValue(scrollTop) {
    return{
        scrollTop,
        type:'SET_SCROLL_TOP_VALUE'
    }
}
export function setHotScrollTopValue(scrollTop) {
    return{
        scrollTop,
        type:'SET_HOT_SCROLL_TOP_VALUE'
    }
}
export function setFreshScrollTopValue(scrollTop) {
    return{
        scrollTop,
        type:'SET_FRESH_SCROLL_TOP_VALUE'
    }
}
export function fresh_noMore() {
    return{
        type:'FRESH_NO_MORE'
    }
}
export function hot_noMore() {
    return{
        type:'HOT_NO_MORE'
    }
}