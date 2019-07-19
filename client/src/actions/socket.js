import { CONNECT_SOCKET, DISCONNECT_SOCKET } from './types'

export const connectSocket = socket => dispatch => {
    try {
        dispatch({
            type: CONNECT_SOCKET,
            payload: socket
        })
    } catch (err) {
        dispatch({
            type: DISCONNECT_SOCKET
        })
    }
}

export const disconnectSocket = socket => dispatch => {
    try {
        dispatch({
            type: DISCONNECT_SOCKET
        })
    } catch (err) {
        console.log(err)
    }
}