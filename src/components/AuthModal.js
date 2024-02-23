import { useState } from "react"



const AuthModal =({setShowModal, isSignup})=>{
    const [email,setEmail] =useState(null)
    const[password,setPassword]=useState(null)
    const[ConfirmPassword,setConfirmPassword]=useState(null)
    const[error,setError]=useState(null)
    const handleclick = () => {
            setShowModal(false)
           
    }

    const handleSubmit=(e)=>{
      e.preventDefault()
      try {
        if(isSignup && password!==ConfirmPassword){
          setError('Password Needs to Match')
        }
        console.log('make a post req to our data base')
      } catch (error) {
        console.log(error)
      }
    }
    return (
      <div className="wrap">
    <div  className="Auth-Modal">
        <div className="close-icon" onClick={handleclick}>x</div>
        <h1 >{isSignup ?' Create Account':'Login In'}</h1>

        <p>By signing up, you agree to our Terms , Privacy Policy and Cookies Policy .</p>
        <form onSubmit={handleSubmit}>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              required={true}
              onChange={(e)=>setEmail(e.target.value)}
            ></input>
               <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required={true}
              onChange={(e)=>setPassword(e.target.value)}>
            </input>
            {isSignup&& <input
              type="password"
              id="password-check"
              name="password-check"
              placeholder="Password-check"
              required={true}
              onChange={(e)=>setConfirmPassword(e.target.value)}>
            </input>}
            <br></br>
            <input className="secondary-btn" type="submit"></input>
            <p>{error}</p>

        </form>
        <hr></hr>
    </div>
    </div>
    )
    
    }
    export default AuthModal