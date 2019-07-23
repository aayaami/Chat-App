import axios from 'axios'
import { GET_CHAT, CLEAR_CHAT, UPDATE_MESSAGES, GET_CHATS, CHATS_FAIL } from './types'

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
        const res = await axios.get(`/api/chats/${chat_id}`)
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

export const sendMessage = ({text, chat_id, socket}) => async dispatch => {
    try {
        const body = { text: text }
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        await axios.put(`/api/chats/message/${chat_id}`, body, config)
        await socket.socket.emit('update messages', chat_id)
    } catch (err) {
        console.log(err)
    }
}

export const refreshMessages = chat_id => async dispatch => {
    try {
        const res = await axios.get(`/api/chats/messages/${chat_id}`)

        dispatch({
            type: UPDATE_MESSAGES,
            payload: res.data
        })
    } catch (err) {
        console.log(err)
    }
}

export const createChat = ({name, socket, id}) => async dispatch => {
    try {
        const body = { name: name }
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        await axios.post('/api/chats', body, config)
        await socket.emit('update chatlist')
        await socket.emit('update chats', id)
    } catch (err) {
        dispatch({
            type: CHATS_FAIL
        })
    }
}

export const acceptJoinRequest = (user_id, chat_id, socket) => async dispatch => {
    try {
        await axios.put(`/api/chats/acceptrequest/${chat_id}/${user_id}`)
        await socket.emit('update chat', chat_id)
        await socket.emit('update chats', user_id)
    } catch (err) {
        console.log(err)
    }
}