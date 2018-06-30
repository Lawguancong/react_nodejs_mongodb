
const initState = {
    commentList:[],// 评论列表
}

//reducer -> publishDetails
export function publishDetails(state = initState,action) {
    switch (action.type) {
        case 'CLEAR_COMMENT_LIST':
            return {...initState}
        case 'GET_COMMENT_LIST_SUCCESS':
            return {...state,commentList:action.commentList}
        default:
            return state
    }
}
export function clearCommentList() {
    return{
        type:'CLEAR_COMMENT_LIST'
    }
}
export function getCommentList(commentList) {
    return {
        commentList,
        type:'GET_COMMENT_LIST_SUCCESS'
    }
}