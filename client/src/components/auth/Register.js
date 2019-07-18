import React, { Fragment, useState } from 'react'

const Register = props => {
    const [formData, setFormData] = useState({
        nick: '',
        email: '',
        password: '',
        password2: ''
    })

    const handleSubmit = e => {
        e.preventDefault()
        if(password !== password2) {
            return console.log('Passwords should match')
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

export default Register