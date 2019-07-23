import React, { useState } from 'react'
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
        <section className="container">
            <form onSubmit={e => handleSubmit(e)} className="container-full form">
                <h1>Login</h1>
                <div>
                    <input 
                    type="email" 
                    name="email" 
                    value={email} 
                    onChange={e => handleChange(e)}
                    required
                    placeholder="email"
                    />
                </div>
                <div>
                    <input 
                    type="password" 
                    name="password" 
                    value={password} 
                    onChange={e => handleChange(e)}
                    required
                    minLength="6"
                    placeholder="password"
                    />
                </div>
                <div>
                    <button type="submit" className="btn btn-success">Login</button> 
                </div>
            </form>
        </section>
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