import React, { Fragment, useState } from 'react'

const Login = props => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleSubmit = e => {
        e.preventDefault()
        console.log(formData)
    }

    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
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

export default Login