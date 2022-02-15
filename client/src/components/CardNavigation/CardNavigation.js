import React from 'react'
import "./CardNavigation.css"
var cardLinks = ["Card A", "Card B","Card C","Card D","Card E","Card F", ]
function CardNavigation(){
return(
    <div className = 'card-nav'>

        <ul>
            {cardLinks.map((link) => {
                return(<li>{link}</li>)
            })}
        </ul>
    </div>
)
}
export default CardNavigation;