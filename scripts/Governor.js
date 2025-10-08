// import { setGovernorChoice } from "./transientState.js"

// setting up import for future transient state work ^

export const Governor = async () => {
    const response = await fetch("http://localhost:8088/governors")
    const governors = await response.json()
    // defined function making sure to use async and await while defining the cariable of governors to hold the array that is imported from the database. 

    let governorHTML =  `<h2>Governors</h2><select id="resource">
        <option value="0">Choose a Governor...</option>`

        // set the beginning of the HTML so that it will be a select dropdown menu that firstly displays "Choose a Governor"
    
    
    const governorOptions = governors.map(governor => {
        return `<option value="${governor.id}">${governor.name}</option>`
    })

    // created a map function that takes each governor and converts it to display as another option in the drop down menu

    governorHTML += governorOptions.join("")

    // join all of the responses gotten from running our governor array through the map function so they all display in the dropdown menu

    governorHTML += `</select>`

    return governorHTML
}



// const handleGovernorChoice = (event) => {

//     if (event.target.name === "governor") {
//         setGovernorChoice(event.target.value)
//     }
// }

// document.addEventListener("change", handleGovernorChoice)

//  may need this, not sure just following what was done on kneel diamonds, may need more explanation or to go back and figure out more on my own