import TinderCard from "react-tinder-card"
import { useState } from "react"




const Dashboard =()=>{
    const characters = [
        {
          name: 'Richard Hendricks'
          
        },
        {
          name: 'Erlich Bachman'
       
        },
        {
          name: 'Monica Hall'
          
        },
        {
          name: 'Jared Dunn'
          
        },
        {
          name: 'Dinesh Chugtai'
         
        }
      ]
    const [lastDirection, setLastDirection] = useState()
  
    const swiped = (direction, nameToDelete) => {
      console.log('removing: ' + nameToDelete)
      setLastDirection(direction)
    }
  
    const outOfFrame = (name) => {
      console.log(name + ' left the screen!')
    }
  
    return (
    <div className="Dashboard">
        
        <div className="swi-per-container">
            <div className="cardContainer">
            {characters.map((character) =>
          <TinderCard className='swipe' key={character.name} onSwipe={(dir) => swiped(dir, character.name)} onCardLeftScreen={() => outOfFrame(character.name)}>
            <div style={{ backgroundImage: 'url(' + character.url + ')' }} className='card'>
              <h3>{character.name}</h3>
            </div>
          </TinderCard>
        )}
            </div>

        </div>



    </div>
    )
    
    }
    export default Dashboard