import React from 'react'

function ConnectionStatus({ isConnected }) {
  return (
    <div className='connection-container'>
        <div className="connection-status">
            <div
                className={`status-indicator ${isConnected ? "online" : "offline"}`}
            ></div>
            <span>{isConnected ? "Connected" : "Offline"}</span>
        </div>
    </div>
  )
}

export default ConnectionStatus