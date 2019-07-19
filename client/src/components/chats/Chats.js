import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getChats } from '../../actions/chats'
import { Link } from 'react-router-dom'

const Chats = ({ getChats, chats: { chats, loading } }) => {
    useEffect(() => {
        getChats()
    }, [getChats])
    return chats ? (<div>
        {chats.map(chat => <Link key={chat._id} to={`/chats/${chat._id}`}>{chat.name}</Link>)}
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