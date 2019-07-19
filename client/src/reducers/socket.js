import { CONNECT_SOCKET, DISCONNECT_SOCKET } from '../actions/types'

const initialState = {
    socket: null,
    socketLoading: true
}

export default function(state = initialState, action) {
    const { type, payload } = action
    switch(type) {
        case CONNECT_SOCKET:
            return {
                ...state,
                socket: payload,
                socketLoading: false
            }
        case DISCONNECT_SOCKET:
            return {
                ...state,
                socket: null,
                socketLoading: true
            }
        default:
            return state
    }
}