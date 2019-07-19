import { GET_CHAT, CLEAR_CHAT, UPDATE_LOCAL_MESSAGES, UPDATE_MESSAGES } from '../actions/types'
import uuid from 'uuid'
const initialState = {
    chat: null,
    loading: true
}

export default function(state = initialState, action) {
    const { type, payload } = action
    console.log(payload)
    switch(type) {
        case GET_CHAT:
            return {
                chat: payload,
                loading: false
            }
        case UPDATE_LOCAL_MESSAGES:
            return {
                ...state,
                chat: {
                    ...state.chat,
                    messages: [
                        ...state.chat.messages,
                        {
                            user: {
                                name: payload.userName
                            },
                            text: payload.text,
                            _id: uuid.v4()
                        }
                    ]
                }
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