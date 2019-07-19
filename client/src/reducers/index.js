import { combineReducers } from 'redux'
import alert from './alert'
import auth from './auth'
import chats from './chats'
import chat from './chat'
import socket from './socket'

export default combineReducers({
    alert,
    auth,
    chats,
    chat,
    socket
})