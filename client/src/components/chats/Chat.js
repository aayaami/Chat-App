import React, { useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'
import { getChat, clearChat, refreshMessages } from '../../actions/chat'
import { connectSocket, disconnectSocket } from '../../actions/socket'
import { connect } from 'react-redux'
import Messages from './Messages'
import MessageForm from './MessageForm'
import io from 'socket.io-client'


const Chat = ({ 
    auth: { user }, 
    match, 
    chat: { chat, loading }, 
    getChat, clearChat, 
    socket: { socket, socketLoading }, 
    connectSocket, 
    disconnectSocket,
    refreshMessages
}) => {

    useEffect(() => {
        getChat(match.params.chat_id)
        return () => {
            clearChat()
        }
    }, [getChat])


    useEffect(() => {
        
        if(!loading) {
            const tempSocket = io('http://localhost:5000')
            if(chat) {
                tempSocket.emit('join chat', chat._id)
                connectSocket(tempSocket)
            }
        }

    }, [loading, connectSocket])

    useEffect(() => {
        return () => {
            if(socket) {
                disconnectSocket()
                socket.emit('leave chat', chat._id)
            }
        }
    }, [socketLoading])

    useEffect(() => {
        if(socket) {
            socket.on('refresh messages', () => {
                refreshMessages(match.params.chat_id)
            })
        }
        
    }, [socketLoading])

    return !loading ? ( 
        
        <Fragment>
            <Messages messages={chat.messages}/>
            <MessageForm userId={user._id} userName={user.name} chatId={chat._id} />
        </Fragment>) : (<Fragment>Loading</Fragment>)
}

Chat.propTypes = {
    chat: PropTypes.object.isRequired,
    getChat: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    clearChat: PropTypes.func.isRequired,
    refreshMessages: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    chat: state.chat,
    auth: state.auth,
    socket: state.socket
})

export default connect(mapStateToProps, { getChat, clearChat, connectSocket, disconnectSocket, refreshMessages })(Chat)
