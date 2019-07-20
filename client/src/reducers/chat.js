import { GET_CHAT, CLEAR_CHAT, UPDATE_MESSAGES } from '../actions/types'
const initialState = {
    chat: null,
    loading: true
}

export default function(state = initialState, action) {
    const { type, payload } = action
    switch(type) {
        case GET_CHAT:
            return {
                chat: payload,
                loading: false
            }
        case UPDATE_MESSAGES:
            return {
                ...state,
                chat: {
                    ...state.chat,
                    messages: [...payload.messages]
                }
            }
        case CLEAR_CHAT:
            return {
                chat: null,
                loading: true
            }
        default:
            return state
    }
}