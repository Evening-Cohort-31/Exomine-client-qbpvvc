// Import render to rerender page on facility selection
import { getTransientState } from "./Cart.js"

// Sets html for current facility Minerals
export const Minerals = async () => {
    // Retrieve facilities and their minerals from the database
    const response = await fetch("http://localhost:8088/facilities?_embed=facilityMinerals") 
    
    const currentTransientState = getTransientState()
    const currentFacilityId = currentTransientState.currentFacility


    // Start the mineral html
    let html = `<h3>Facility Minerals`

    if (response.ok) {    
        const facilities = await response.json()

        // Check that selection has been made
        if (currentFacilityId) {
            // Find the current facility
            const currentFacility = facilities.find(facility => facility.id === currentFacilityId)
            let currentMinerals = []


                // Adds Facility name to heading
                html += `
                    for ${currentFacility.name}</h3>`

                // Retrieves minerals from the database
                const mineralResponse = await fetch("http://localhost:8088/minerals")
                
                if (response.ok) {
                    const minerals = await mineralResponse.json()     

                    // Create a radio input for each mineral
                    currentMinerals = currentFacility.facilityMinerals.map(fm => {
                        const m = minerals.find(mineral => mineral.id === fm.mineralId)
                        return {id: m.id, name: m.name, quantity: fm.quantity}
                    })

                    currentMinerals.forEach(mineral => html += `<input class="mineralRadio" type="radio" id=${mineral.id} name="mineral" value=${mineral.id} ${currentTransientState.currentMineral === mineral.id ? "checked" : ""}/><label for=${mineral.id}>${mineral.name} ${mineral.quantity}</label>`)
                }

        }
    }
    return html
}

// TODO
// Display mineral count next to radio buttons
// Create radio select handler
// - Reduce count by 1
// - Update Cart
// Clean up event listener, facility select already rerenders
// Undo changes in main before pushing