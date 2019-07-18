import React, { Fragment, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { login } from '../../actions/auth'

const Login = ({ login, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleSubmit = e => {
        e.preventDefault()
        login(email, password)
    }

    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    if(isAuthenticated) {
        return <Redirect to='/chats' />
    }

    const { email, password } = formData

    return (
        <Fragment>
            <form onSubmit={e => handleSubmit(e)} className="container">
                <h1>Login</h1>
                <div>
                    <input 
                    type="email" 
                    name="email" 
                    value={email} 
                    placeholder={email}
                    onChange={e => handleChange(e)}
                    required
                    />
                </div>
                <div>
                    <input 
                    type="password" 
                    name="password" 
                    value={password} 
                    placeholder={password}
                    onChange={e => handleChange(e)}
                    required
                    minLength="6"
                    />
                </div>
                <div>
                    <button type="submit">Login</button> 
                </div>
            </form>
        </Fragment>
    )
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { login })(Login)