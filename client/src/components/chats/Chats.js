import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getChats } from '../../actions/chats'
import { Link } from 'react-router-dom'
import NewChatForm from './NewChatForm'
import { joinRequest } from '../../actions/chats'
import { loadUser } from '../../actions/auth';
import SearchChatsForm from './SearchChatsForm';

const Chats = ({ auth: {user}, getChats, loadUser, joinRequest, chats: { chats }, history }) => {
    useEffect(() => {
        getChats()
        
    }, [getChats])

    const [chatsArray, setChatsArray] = useState([])
    const [chatsArray2, setChatsArray2] = useState([])
    
    useEffect(() => {
        if(chats && user && chatsArray.length === 0) {
            chats.map(chat => {
                if(chat.joinRequests.map(joinRequest => joinRequest.user).indexOf(user._id) === -1) {
                    let newArr = chatsArray
                    newArr.push(chat)
                    setChatsArray([...newArr])
                }
                return null
            })


        
            chatsArray.map(chat => {
                let unique = true
                user.userChats.map(chat2 => { 
                    if(chat._id !== chat2.chat._id) {
                        unique = false
                    }
                    return null
                })
                if(unique)
                {
                    let newArr = chatsArray2
                    newArr.push(chat)
                    setChatsArray2([...newArr])
                }
                return null
            })

            
        }
        loadUser()
    }, [chats])

    return chatsArray2 !== [] ? (<div>
        <NewChatForm />
        <SearchChatsForm />
        {chatsArray2.map(chat =>  <div key={chat._id} ><Link to={`/chats/${chat._id}`}>{chat.name}</Link> <button onClick={() => joinRequest(chat._id)}>Send join request</button> </div>)}
    </div>) : (<div>Loading</div>)

    // return <div>Hello</div>
}

Chats.propTypes = {
    chats: PropTypes.object.isRequired,
    getChats: PropTypes.func.isRequired,
    joinRequest: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    loadUser: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    chats: state.chats,
    auth: state.auth
})

export default connect(mapStateToProps, { getChats, joinRequest, loadUser })(Chats)