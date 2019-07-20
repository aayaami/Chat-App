import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

const UserChats = ({ auth: {user}}) => {

    if(user) {
        console.log(user)
    }

    return user ? (<div>
        {user.userChats.map(chat =>  <div key={chat.chat._id} ><Link to={`/chats/${chat.chat._id}`}>{chat.chat.name}</Link></div>)}
    </div>) : (<div>Loading</div>)
}

UserChats.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {})(UserChats)