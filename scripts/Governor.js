import { setGovernorChoice } from "./transientState.js"

export const Governor = async () => {
    const response = await fetch("http://localhost:8088/governors")
    const governors = await response.json()

    let governorHTML =  `<select id="resource">
        <option value="0">Choose a Governor...</option>`
    
    
    const governorOptions = governor.map(governor => {
        return `<option value="${governor.id}">${governor.name}</option>`
    })

    governorHTML += governorOptions.join("")

    governorHTML += `</select>`

    return governorHTML
}

// const handleGovernorChoice = (event) => {

//     if (event.target.name === "governor") {
//         setGovernorChoice(event.target.value)
//     }
// }

// document.addEventListener("change", handleGovernorChoice)