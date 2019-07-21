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
            
            <form onSubmit={e => handleSubmit(e)}>
                <div><label>Search</label></div>
                <input type="text" name="name" placeholder="Type chat name" value={name} onChange={e => setName(e.target.value)} required/>
            </form> 
        </div>
    )
}

SearchChatsForm.propTypes = {
    findChats: PropTypes.func.isRequired
}


export default connect(null, { findChats })(SearchChatsForm)
