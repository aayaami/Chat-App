import React, { Fragment } from 'react'

const ChatUsersList = ({ users }) => {
    return users ? (<ul className="accept-list">
        <h2>Users</h2>
        {users.map(user => <li key={user._id}>{user.user.name}</li>)}
    </ul>) : (<Fragment>Loading</Fragment>)
}

export default ChatUsersList