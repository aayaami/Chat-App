import React, { useState } from 'react'
import { connect } from 'react-redux'
import { createChat } from '../../actions/chat'
import PropTypes from 'prop-types'

const NewChatForm = ({ createChat }) => {
    const [name, setName] = useState('')
    const handleSubmit = e => {
        e.preventDefault()
        createChat({ name: name })
        setName('')
    }
    
    return (
        <div>
            
            <form onSubmit={e => handleSubmit(e)}>
                <div><label>Create new Chat</label></div>
                <input type="text" name="name" placeholder="Chat name" value={name} onChange={e => setName(e.target.value)} required/>
            </form> 
        </div>
    )
}

NewChatForm.propTypes = {
    createChat: PropTypes.func.isRequired
}


export default connect(null, { createChat })(NewChatForm)
