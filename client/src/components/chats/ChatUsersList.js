import React, { Fragment } from 'react'

const ChatUsersList = ({ users }) => {
    return users ? (<Fragment>
        <div>User List</div>
        <div>=====================</div>
        {users.map(user => <li key={user._id}>{user.user.name}</li>)}
        <div>=====================</div>
    </Fragment>) : (<Fragment>Loading</Fragment>)
}

export default ChatUsersList