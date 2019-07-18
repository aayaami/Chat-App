import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = props => {
    return (
        <nav className="navbar">
            <h1><Link to="/">Chat App</Link></h1>
        <ul>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>
        </nav>
    )
}

export default Navbar
