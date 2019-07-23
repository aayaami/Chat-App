import React, { useState } from 'react'
import { connect } from 'react-redux'
import { createChat } from '../../actions/chat'
import PropTypes from 'prop-types'

const NewChatForm = ({ createChat, socket: { socket }, auth }) => {
    const [name, setName] = useState('')
    const handleSubmit = e => {
        e.preventDefault()

        createChat({ name, socket, id: auth.user._id })

        setName('')
    }
    
    return (
            <form onSubmit={e => handleSubmit(e)} className="form">
                <div><label>Create new Chat</label></div>
                <input type="text" name="name" placeholder="Chat name" value={name} onChange={e => setName(e.target.value)} required/>
            </form>
    )
}

NewChatForm.propTypes = {
    createChat: PropTypes.func.isRequired,
    socket: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    socket: state.socket,
    auth: state.auth
})

export default connect(mapStateToProps, { createChat })(NewChatForm)
