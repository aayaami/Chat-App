import React, { useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getUserChats } from '../../actions/chats'

const UserChats = ({ userChats, getUserChats, match }) => {
    useEffect(() => {
        getUserChats()
    }, [])
    
    return userChats ? (<ul>
        {userChats.map(chat =>  <li key={chat._id} ><Link to={`/chats/${chat._id}`}>{chat.name}</Link></li>)}
    </ul>) : (<div>Loading</div>)
}

UserChats.propTypes = {
    getUserChats: PropTypes.func.isRequired,
    
}

const mapStateToProps = state => ({
    userChats: state.chats.userChats
})

export default connect(mapStateToProps, { getUserChats })(UserChats)