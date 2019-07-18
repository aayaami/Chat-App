import React, { Fragment, useState } from 'react'
import { connect } from 'react-redux'
import { setAlert } from '../../actions/alert'
import PropTypes from 'prop-types'

const Register = ({ setAlert }) => {
    const [formData, setFormData] = useState({
        nick: '',
        email: '',
        password: '',
        password2: ''
    })

    const handleSubmit = e => {
        e.preventDefault()
        if(password !== password2) {
            setAlert('Passwords should match', 'danger')
        }
        console.log(formData)
    }

    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const { nick, email, password, password2 } = formData

    return (
        <Fragment>
            <form onSubmit={e => handleSubmit(e)} className="container">
                <h1>Register</h1>
                <div>
                    <input 
                    type="text" 
                    name="nick" 
                    value={nick} 
                    placeholder="nick"
                    onChange={e => handleChange(e)}
                    required
                    />
                </div>
                <div>
                    <input 
                    type="email" 
                    name="email" 
                    value={email} 
                    placeholder="email"
                    onChange={e => handleChange(e)}
                    required
                    />
                </div>
                <div>
                    <input 
                    type="password" 
                    name="password" 
                    value={password} 
                    placeholder="password"
                    onChange={e => handleChange(e)}
                    required
                    minLength="6"
                    />
                </div>
                <div>
                    <input 
                    type="password" 
                    name="password2" 
                    value={password2} 
                    placeholder="confirm password"
                    onChange={e => handleChange(e)}
                    required
                    minLength="6"
                    />
                </div>
                <div>
                    <button type="submit">Register</button>
                </div>
            </form>
        </Fragment>
    )
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
}

export default connect(null, { setAlert })(Register)