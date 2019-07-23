import React, { useEffect, useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getChats } from '../../actions/chats'
import NewChatForm from './NewChatForm'
import { joinRequest } from '../../actions/chats'
import { loadUser } from '../../actions/auth';
import SearchChatsForm from './SearchChatsForm';
import UserChats from './UserChats';

const Chats = ({ auth: {user}, getChats, loadUser, joinRequest, chats: { chats }, socket: {socket} }) => {
    useEffect(() => {
        getChats()
        
    }, [getChats])

    return chats ? (
    <Fragment>
        <section className="container">
                
                
            <ul className="accept-list">
                <li><NewChatForm /></li>
                <li><SearchChatsForm /></li>
                
                {chats.map(chat =>  <li key={chat._id} ><h3>{chat.name}</h3><button className="btn btn-success" onClick={() => joinRequest(chat._id, socket)}>Send join request</button> </li>)}
            </ul>
        </section>

        <section className="aside">
            <UserChats />
        </section>
    </Fragment>
    ) : (<div>Loading</div>)
}

Chats.propTypes = {
    chats: PropTypes.object.isRequired,
    getChats: PropTypes.func.isRequired,
    joinRequest: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    loadUser: PropTypes.func.isRequired,
    socket: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    chats: state.chats,
    auth: state.auth,
    socket: state.socket
})

export default connect(mapStateToProps, { getChats, joinRequest, loadUser })(Chats)