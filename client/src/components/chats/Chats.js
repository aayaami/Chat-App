import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getChats } from '../../actions/chats'
import { Link } from 'react-router-dom'
import NewChatForm from './NewChatForm'
import { joinRequest } from '../../actions/chats'

const Chats = ({ auth: {user}, getChats, joinRequest, chats: { chats }, history }) => {
    useEffect(() => {
        getChats()
        
    }, [getChats])

    const chatsArray = []
    const chatsArray2 = []
    if(chats && user) {
        chats.map(chat => {
            if(chat.joinRequests.map(joinRequest => joinRequest.user).indexOf(user._id) === -1) {
                chatsArray.push(chat)
            }
            return null
        })
        chatsArray.map(chat => {
            let unique = true
            user.userChats.map(chat2 => { 
                if(chat._id === chat2.chat._id) {
                    unique = false
                }
                return null
            })
            if(unique)
            {
                chatsArray2.push(chat)
            }
            return null
        })
    }

    return chatsArray2 !== [] ? (<div>
        <NewChatForm />
        {chatsArray2.map(chat =>  <div key={chat._id} ><Link to={`/chats/${chat._id}`}>{chat.name}</Link> <button onClick={() => joinRequest(chat._id)}>Send join request</button> </div>)}
    </div>) : (<div>Loading</div>)
}

Chats.propTypes = {
    chats: PropTypes.object.isRequired,
    getChats: PropTypes.func.isRequired,
    joinRequest: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    chats: state.chats,
    auth: state.auth
})

export default connect(mapStateToProps, { getChats, joinRequest })(Chats)