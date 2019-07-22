import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const Messages = ({ chat: {messages} }) => {
    return messages ? (<ul className="messages">
        {messages.map(message => <li key={message._id}>{message.user.name}: {message.text}</li>)}
    </ul>) : (<Fragment>Loading</Fragment>)
}

Messages.propTypes = {
    chat: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    chat: state.chat.chat
})

export default connect(mapStateToProps, {})(Messages)