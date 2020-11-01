import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';

const BackDrop = () => {
    const styles = {
        width: '100vw',
        height: '100vh',
        backgroundColor: '#00000063',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 99999
    }
    return (
        <div style = {styles}>
            <CircularProgress />
        </div>
    )
}

export default BackDrop
