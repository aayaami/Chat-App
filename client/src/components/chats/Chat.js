import React, { useEffect, Fragment, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { getChat, clearChat, refreshMessages } from '../../actions/chat'
import { connectSocket, disconnectSocket } from '../../actions/socket'
import { connect } from 'react-redux'
import Messages from './Messages'
import MessageForm from './MessageForm'
import JoinRequests from './JoinRequests'
import ChatUsersList from './ChatUsersList'
import { loadUser } from '../../actions/auth'

const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop)

const Chat = ({ 
    auth: { user }, 
    match, 
    chat: { chat, loading }, 
    getChat, clearChat, 
    socket: { socket, socketLoading }, 
    connectSocket, 
    disconnectSocket,
    refreshMessages,
    loadUser
}) => {

    

    const myRef = useRef(null)
   const executeScroll = () => scrollToRef(myRef)

    const[isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        getChat(match.params.chat_id)
        loadUser()
        return () => {
            // clearChat()
        }
    }, [getChat])

    useEffect(() => {
        if(!loading && socket) {
            if(chat) {
                socket.emit('join chat', chat._id)
            }
        }
        return () => {
            if(socket && chat) {
                // disconnectSocket()
                socket.emit('leave chat', chat._id)
                clearChat()
            }
        }
    }, [socketLoading, loading])

    useEffect(() => {
        if(socket) {
            socket.on('refresh messages', () => {
                refreshMessages(match.params.chat_id)
            })

            socket.on('refresh chat', () => {
                getChat(match.params.chat_id)
                console.log('got')
            })
        }

        if(user && !loading && chat) {
            chat.admins.map(admin => {
                if(admin.user === user._id) {
                    setIsAdmin(true)
                }
            })
        }
    }, [loading])

    if(!loading && !socketLoading && user) {
        return (
            <Fragment>
            { isAdmin ? <section className="sidebar"><JoinRequests joinRequests={chat.joinRequests} chat_id={chat._id} />
            </section> : null }
            <section className="aside">
                <ChatUsersList users={chat.users} />
            </section>

            <section className="container">
                <Messages messages={chat.messages}/>
                <MessageForm userId={user._id} userName={user.name} chatId={chat._id} />
            </section>
         </Fragment>
        )
    } else {
        return <Fragment>Loading</Fragment>
    }
}

Chat.propTypes = {
    chat: PropTypes.object.isRequired,
    getChat: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    clearChat: PropTypes.func.isRequired,
    refreshMessages: PropTypes.func.isRequired,
    loadUser: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    chat: state.chat,
    auth: state.auth,
    socket: state.socket
})

export default connect(mapStateToProps, { getChat, clearChat, connectSocket, disconnectSocket, refreshMessages, loadUser })(Chat)
