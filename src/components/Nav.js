import logo from '../images/logo.jpg'
import React from 'react'


const Nav =({setShowModal, showModal,setIssignUp})=>{
     const authtoken=false
    const handleclick=()=>{
        setShowModal(true)
        setIssignUp(false)
    }
    return (
    <nav >
        <div className="logo-container">
            <img className="logo" alt='no' src={logo}/>
        </div>
        {authtoken && <button className='navbutton'
            onClick={handleclick}
            disabled={showModal}
        >Login</button>}
    </nav>
    )
    
    }
    export default Nav