import axios from 'axios'
import { GET_CHAT, CLEAR_CHAT, SEND_MESSAGE, UPDATE_MESSAGES, GET_CHATS, CHATS_FAIL } from './types'

// Clear
export const clearChat = () => dispatch => {
    try {
        dispatch({
            type: CLEAR_CHAT
        })
    } catch (err) {
        console.log(err)
    }
}

// Get chat if you're it's member
export const getChat = chat_id => async dispatch => {
    try {
        console.log(chat_id, 'action')
        const res = await axios.get(`/api/chats/${chat_id}`)
        console.log(res)
        dispatch({
            type: GET_CHAT,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: CLEAR_CHAT
        })
    }
}

export const sendMessage = ({id, text, chat_id, userName, socket}) => async dispatch => {
    try {
        const body = { text: text }
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.put(`/api/chats/message/${chat_id}`, body, config)
        dispatch({
            type: SEND_MESSAGE,
            payload: res.data
        })
        await socket.socket.emit('update messages', chat_id)

        // dispatch({
        //     type: UPDATE_LOCAL_MESSAGES,
        //     payload: {id, text, chat_id, userName}
        // })
    } catch (err) {
        console.log(err)
    }
}

export const refreshMessages = chat_id => async dispatch => {
    try {
        console.log('refresh start')
        const res = await axios.get(`/api/chats/messages/${chat_id}`)

        dispatch({
            type: UPDATE_MESSAGES,
            payload: res.data
        })

        console.log('refresh done')
    } catch (err) {
        console.log(err)
    }
}

export const createChat = ({name}) => async dispatch => {
    try {
        const body = { name: name }
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        await axios.post('/api/chats', body, config)
        const res = await axios.get('/api/chats')
        dispatch({
            type: GET_CHATS,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: CHATS_FAIL
        })
    }
}