import axios from 'axios'
import { GET_CHATS, CHATS_FAIL, GET_CHAT } from './types'


// Get chat names
export const getChats = () => async dispatch => {
    try {
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

// Clear
export const clearChats = () => dispatch => {
    try {
        dispatch({
            type: CHATS_FAIL
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
            type: CHATS_FAIL
        })
    }
}

export const joinRequest = (chat_id) => async dispatch => {
    try {
        
        const body = { chat_id: chat_id }
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        console.log(body)
        await axios.put(`/api/chats/joinrequest/${chat_id}`, body, config)

        console.log('wtf')
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