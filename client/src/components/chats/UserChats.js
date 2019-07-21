import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getUserChats } from '../../actions/chats'

const UserChats = ({ userChats, getUserChats }) => {
    useEffect(() => {
        getUserChats()
    }, [])
    return userChats ? (<div>
        {userChats.map(chat =>  <div key={chat._id} ><Link to={`/chats/${chat._id}`}>{chat.name}</Link></div>)}
    </div>) : (<div>Loading</div>)
}

UserChats.propTypes = {
    getUserChats: PropTypes.func.isRequired,
    
}

const mapStateToProps = state => ({
    userChats: state.chats.userChats
})

export default connect(mapStateToProps, { getUserChats })(UserChats)