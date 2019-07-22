import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../../actions/auth'
import PropTypes from 'prop-types'


const Navbar = ({ logout, auth: { isAuthenticated, loading } }) => {
    const authLinks = (
        <ul>
            <li><Link to="/chats">Chats</Link></li>
            <li><a onClick={logout} href="#!">Logout</a></li>
        </ul>
    )

    const guestLinks = (
        <ul>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>
    )
    return (
        <nav className="header navbar">
            <h1><Link to="/">Chat App</Link></h1>
            { !loading && <Fragment>{ isAuthenticated ? authLinks : guestLinks }</Fragment> }
        </nav>
    )
}

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { logout })(Navbar)
