
const initState = {
    myPublishList:[]
}

//reducer -> myPublish
export function myPublish(state = initState,action) {
    switch (action.type) {
        case 'DO_DELETE_PUBLISH':
            return {...state}
        case 'GET_MY_PUBLISH_LIST':
            return {...state,myPublishList:action.myPublishList}
        default:
            return state
    }
}


export function doDeletePublish() {
    return {
        type: 'DO_DELETE_PUBLISH'
    }
}
export function getMyPublishList(myPublishList) {
    return{
        myPublishList,
        type:"GET_MY_PUBLISH_LIST"
    }
}
