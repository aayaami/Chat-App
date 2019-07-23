import React, { useState } from 'react'
import { connect } from 'react-redux'
import { findChats } from '../../actions/chats'
import PropTypes from 'prop-types'

const SearchChatsForm = ({ findChats }) => {
    const [name, setName] = useState('')
    const handleSubmit = e => {
        e.preventDefault()
        findChats(name)
        setName('')
    }
    
    return (
        <div>
            <form onSubmit={e => handleSubmit(e)} className="form">
                <div><label>Chat Search</label></div>
                <input type="text" name="name" placeholder="Chat name" value={name} onChange={e => setName(e.target.value)}/>
                <button className="btn" type="submit">Reset</button>
            </form> 
        </div>
    )
}

SearchChatsForm.propTypes = {
    findChats: PropTypes.func.isRequired
}


export default connect(null, { findChats })(SearchChatsForm)
