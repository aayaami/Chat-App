import React, { useEffect, useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getChats } from '../../actions/chats'
import { Link } from 'react-router-dom'
import NewChatForm from './NewChatForm'
import { joinRequest } from '../../actions/chats'
import { loadUser } from '../../actions/auth';
import SearchChatsForm from './SearchChatsForm';
import UserChats from './UserChats';

const Chats = ({ auth: {user}, getChats, loadUser, joinRequest, chats: { chats } }) => {
    useEffect(() => {
        getChats()
        
    }, [getChats])

    return chats ? (
    <Fragment>
        <section className="container">
            <ul>
                <NewChatForm />
                <SearchChatsForm />
                
                {chats.map(chat =>  <li key={chat._id} ><Link to={`/chats/${chat._id}`}>{chat.name}</Link> <button onClick={() => joinRequest(chat._id)}>Send join request</button> </li>)}
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
}

const mapStateToProps = state => ({
    chats: state.chats,
    auth: state.auth
})

export default connect(mapStateToProps, { getChats, joinRequest, loadUser })(Chats)