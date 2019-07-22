import React, { Fragment } from 'react'

const ChatUsersList = ({ users }) => {
    return users ? (<ul>
        <div>Users:</div>
        {users.map(user => <li key={user._id}>{user.user.name}</li>)}
    </ul>) : (<Fragment>Loading</Fragment>)
}

export default ChatUsersList