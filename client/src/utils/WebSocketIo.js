import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import io from 'socket.io-client'
import { connect } from 'react-redux'
import { connectSocket } from '../actions/socket'

const WebSocketIo = ({ isAuthenticated, socket: {socketLoading}, connectSocket }) => {
    useEffect(() => {
        if(socketLoading) {
            const tempSocket = io('http://localhost:5000')
            connectSocket(tempSocket)
        }
        
      }, [isAuthenticated])
    return (
        <div>
            
        </div>
    )
}

WebSocketIo.propTypes = {
    isAuthenticated: PropTypes.bool,
    socket: PropTypes.object.isRequired,
    connectSocket: PropTypes.func.isRequired,
}

const mapStateToProps = store => ({
    isAuthenticated: store.auth.isAuthenticated,
    socket: store.socket
})

export default connect(mapStateToProps, { connectSocket })(WebSocketIo)
