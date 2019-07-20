import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getChats } from '../../actions/chats'
import { Link } from 'react-router-dom'
import NewChatForm from './NewChatForm';

const Chats = ({ getChats, chats: { chats }, history }) => {
    useEffect(() => {
        getChats()
    }, [getChats])
    return chats ? (<div>
        <NewChatForm />
        {chats.map(chat =>  <div key={chat._id} ><Link to={`/chats/${chat._id}`}>{chat.name}</Link></div>)}
    </div>) : (<div>Loading</div>)
}

Chats.propTypes = {
    chats: PropTypes.object.isRequired,
    getChats: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    chats: state.chats
})

export default connect(mapStateToProps, { getChats })(Chats)