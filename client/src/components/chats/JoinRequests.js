import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { acceptJoinRequest } from '../../actions/chat'

const JoinRequests = ({joinRequests, acceptJoinRequest, chat_id}) => {
    
    const handleClick = (user_id, chat_id) => {
        acceptJoinRequest(user_id, chat_id)
    }
    return (
        <div>
            { joinRequests.length !== 0 ? <div>
                <div>Join requests list:</div>
                {joinRequests.map(joinRequest => 
                <div key={joinRequest._id}>
                    {joinRequest.user.name}
                    <button onClick={() => handleClick(joinRequest.user._id, chat_id)}>Accept</button>
                </div>)}
            </div> : null}
        </div>
    )
}

JoinRequests.propTypes = {
    acceptJoinRequest: PropTypes.func.isRequired
}

export default connect(null, {acceptJoinRequest})(JoinRequests)
