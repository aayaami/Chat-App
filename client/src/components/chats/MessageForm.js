import React, { useState } from 'react'
import { connect } from 'react-redux'
import { sendMessage } from '../../actions/chat'
import PropTypes from 'prop-types'


const MessageForm = ({ userId, chatId, sendMessage, userName, socket }) => {
    const [formData, setFormData] = useState({
        text: '',
        user: userId
    })
    const { text } = formData
    const handleSubmit = e => {
        e.preventDefault()
        setFormData({
            ...formData,
            text: text
        })

    

        sendMessage({id: userId, text: text, chat_id: chatId, userName: userName, socket: socket})
        setFormData({
            ...formData,
            text: ''
        })
    }

    const onEnterPress = e => {
        if(e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault()
            handleSubmit(e)
          }
    }

    
    return (
            <form onSubmit={e => handleSubmit(e)} className="message-form">
                <textarea onKeyDown={e => onEnterPress(e)} type="text" name="text" value={text} onChange={e => setFormData({...formData, text: e.target.value})} required></textarea>
            </form>
    )
}

MessageForm.propTypes = {
    sendMessage: PropTypes.func.isRequired,
    socket: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    socket: state.socket
})

export default connect(mapStateToProps, { sendMessage })(MessageForm)
