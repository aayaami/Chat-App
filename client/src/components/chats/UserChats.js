import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getUserChats } from '../../actions/chats'

const UserChats = ({ userChats, getUserChats, match }) => {
    useEffect(() => {
        getUserChats()
    }, [getUserChats])
    
    return userChats ? (<ul className="accept-list">
        <h2>My Chats</h2>
        {userChats.map(chat =>  <Link to={`/chats/${chat._id}`}><li key={chat._id} >{chat.name}</li></Link>)}
    </ul>) : (<div>Loading</div>)
}

UserChats.propTypes = {
    getUserChats: PropTypes.func.isRequired,
    
}

const mapStateToProps = state => ({
    userChats: state.chats.userChats
})

export default connect(mapStateToProps, { getUserChats })(UserChats)