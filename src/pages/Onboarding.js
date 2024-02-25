import { useState } from "react"
import Nav from "../components/Nav"
const Onboarding =()=>{
    const [formdata,setformdata]=useState({
        user_id:"",
        first_name:"",
        dob_day:'',
        dob_month:'',
        dob_year:'',
        show_gender: false,
        gender_identity:'man',
        gender_interest:'woman',
        email:'',
        url:'',
        about:'',
        matches:[]
    })
    const handleSubmit=()=>{
        console.log("Submmitted")
    }
    const handleChange=(e)=>{
        console.log('e',e)
        const value= e.target.type==='checkbox'?e.target.checked:e.target.value
        const name=e.target.name
        setformdata((prevState)=>({
            ...prevState,
            [name]:value
        }))
    }
    console.log(formdata)
    return (
        <div className="onboarding
        ">
        <Nav 
        setShowModal={()=>{}} 
        showModal={false}
        setIssignUp={false}
        />
        <div className="OnBoarding">
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit}>
                <section >
                    <label htmlFor="first_name">First Name</label>
                    <input
                        id="first_name"
                        type="text"
                        name="first_name"
                        placeholder="First-name"
                        required={true}
                        value={formdata.first_name}
                        onChange={handleChange}
                    ></input>
                     <label >BirthDay</label>
                     <div className="multipleinput">
                    <input
                        id="Dob_day"
                        type="number"
                        name="dob_day"
                        placeholder="DD"
                        required={true}
                        value={formdata.dob_day}
                        onChange={handleChange}
                    ></input>
                      <input
                        id="Dob_month"
                        type="number"
                        name="dob_month"
                        placeholder="MM"
                        required={true}
                        value={formdata.dob_month}
                        onChange={handleChange}
                    ></input>

                    <input
                        id="Dob_year"
                        type="number"
                        name="dob_year"
                        placeholder="YYYY"
                        required={true}
                        value={formdata.dob_year}
                        onChange={handleChange}
                    ></input>
                    </div>

                    <label >Gender</label>
                     <div className="multipleinput">
                    <input
                        id="man-gender"
                        type="radio"
                        name="gender_identity"
                        
                        
                        value="man"
                        onChange={handleChange}
                        checked={formdata.gender_identity==='man'}
                    ></input>
                     <label htmlFor="man-gender">Man</label>
                    <input
                        id="woman-gender"
                        type="radio"
                        name="gender_identity"
                        
                        
                        value="woman"
                        onChange={handleChange}
                        checked={formdata.gender_identity==='woman'}
                    ></input>
                    <label htmlFor="woman-gender">Woman</label>
                    <input
                        id="more-gender"
                        type="radio"
                        name="gender_identity"
                        
                        
                        value="more"
                        onChange={handleChange}
                        checked={formdata.gender_identity==='more'}
                    ></input>
                    <label htmlFor="more-gender">More</label>
                    </div>

                    <label htmlFor="show-gender">Show Gender on My Profile</label>
                    <input
                        id="show-gender"
                        type="checkbox"
                        name="show_gender"
                        
                        
                        
                        onChange={handleChange}
                        checked={formdata.show_gender}
                    ></input>
                     <label>Show Me</label>
                     <div className="multipleinput">
                     <input
                        id="man-gender-interest"
                        type="radio"
                        name="gender_interest"
                        
                        
                        value="man"
                        onChange={handleChange}
                        checked={formdata.gender_interest==='man'}
                    ></input>
                     <label htmlFor="man-gender-interest">Man</label>
                    <input
                        id="woman-gender-interest"
                        type="radio"
                        name="gender_interest"
                        
                        
                        value="woman"
                        onChange={handleChange}
                        checked={formdata.gender_interest='woman'}
                    ></input>
                    <label htmlFor="woman-gender-interest">Woman</label>
                    <input
                        id="everyone-gender-interest"
                        type="radio"
                        name="gender_interest"
                        
                        
                        value="more"
                        onChange={handleChange}
                        checked={formdata.gender_interest==='everyone'}
                    ></input>
                    <label htmlFor="more-gender-interest">Everyone</label>
                
                     </div>
                     <label htmlFor="about">About Me</label>
                     <input 
                      id="about"
                      type="text"
                      name="about"
                      required={true}
                      placeholder="I like mountaainsss....."
                      value={formdata.about}
                      onChange={handleChange}
                     ></input>
                    <input
                     type="submit"
                     ></input>
                </section>
                <section>
                    <label htmlFor="about">Profile</label>
                    <input 
                        type="url"
                        name="url"
                        id="url"
                        onChange={handleChange}
                    ></input>
                    <div className="photo-container">
                        <img src={formdata.url} alt="ProfilePic"></img>
                    </div>
                </section>
            </form>
        </div>
        
        </div>
    )
    
    }
    export default Onboarding