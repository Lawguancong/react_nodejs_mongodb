
const initState = {

}

//reducer -> browser
export function browser(state = initState,action) {
    switch (action.type) {
        case 'GET_HAVE_A_LOOK_DATA':
            return {...state,haveALookData:action.haveALookData}
        default:
            return state
    }
}
export function getHaveALookData(haveALookData) {
    return{
        haveALookData,
        type:'GET_HAVE_A_LOOK_DATA'
    }
}