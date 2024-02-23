import Nav from "../components/Nav"
import { useState } from "react"
import AuthModal from "../components/AuthModal"

const Home =()=>{
    const [showModal,setShowModal]=useState(false)
    const authtoken=true
const handleclick =()=>{
    console.log('clicked')
    setShowModal(true)
    setIssignUp(true)
}
const [isSignup,setIssignUp]=useState(true)
return (
<div className="overlay">
    <Nav authtoken={authtoken} setShowModal={setShowModal} showModal={showModal} setIssignUp={setIssignUp}/>
    <div className="home">
        <h1 className="primary-title">Swipe Right</h1>
        <button className="primary-button" onClick={handleclick}>
            {authtoken ? 'Create Account': 'Logout'}
        </button>
    </div>
    {showModal && (<AuthModal setShowModal={setShowModal} setIssignUp={setIssignUp} isSignup={isSignup}/>)}
    
    </div>
)

}
export default Home