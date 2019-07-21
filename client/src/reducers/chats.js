import { GET_CHATS, CHATS_FAIL, FIND_CHATS, GET_USER_CHATS } from '../actions/types'

const initialState = {
    chats: null,
    loading: true,
    userChats: []
}

export default function(state = initialState, action) {
    const { type, payload } = action
    switch(type) {
        case GET_CHATS:
        case FIND_CHATS:
            return {
                ...state,
                chats: payload,
                loading: false
            }
        case GET_USER_CHATS:
            return {
                ...state,
                userChats: payload
            }
        case CHATS_FAIL:
            return {
                chats: null,
                loading: true
            }
        default:
            return state
    }
}