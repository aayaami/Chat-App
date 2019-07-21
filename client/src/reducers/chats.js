import { GET_CHATS, CHATS_FAIL, FIND_CHATS } from '../actions/types'

const initialState = {
    chats: null,
    loading: true
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
        case CHATS_FAIL:
            return {
                chats: null,
                chat: null,
                loading: true
            }
        default:
            return state
    }
}