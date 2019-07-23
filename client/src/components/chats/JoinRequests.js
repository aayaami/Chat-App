import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { acceptJoinRequest } from '../../actions/chat'

const JoinRequests = ({joinRequests, acceptJoinRequest, chat_id, socket: { socket }}) => {
    
    const handleClick = (user_id, chat_id) => {
        acceptJoinRequest(user_id, chat_id, socket)
    }
    return (
        <div>
            { joinRequests.length !== 0 ? <ul className="accept-list">
                <h2>Join requests</h2>
                {joinRequests.map(joinRequest => 
                <li key={joinRequest._id}>
                    {joinRequest.user.name}
                    <button className="btn btn-success" onClick={() => handleClick(joinRequest.user._id, chat_id)}>Accept</button>
                </li>)}
            </ul> : null}
        </div>
    )
}

JoinRequests.propTypes = {
    acceptJoinRequest: PropTypes.func.isRequired,
    socket: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    socket: state.socket
})

export default connect(mapStateToProps, {acceptJoinRequest})(JoinRequests)
