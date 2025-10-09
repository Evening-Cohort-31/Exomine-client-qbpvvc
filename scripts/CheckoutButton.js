import { getTransientState } from "./Cart.js"
import { resetMineral } from "./Cart.js"
import { render } from "./main.js"

export const CheckoutButton = () => {
    return `<button id="submit">Purchase Mineral</button>`
}

export const handleSubmit = async () => {
    const currentState = getTransientState()
    const { currentGovernor, currentFacility, currentMineral } = currentState

    // Get the governor's colony ID
    const governorResponse = await fetch(`http://localhost:8088/governors/${currentGovernor}`)
    const governor = await governorResponse.json()
    const currentColony = governor.colonyId

    // Check if there's already a colonyMineral record for this colony and mineral
    const colonyMineralsResponse = await fetch(`http://localhost:8088/colonyMinerals?colonyId=${currentColony}&mineralId=${currentMineral}`)
    const existingColonyMinerals = await colonyMineralsResponse.json()

    if (existingColonyMinerals.length > 0) {
        // Update existing colonyMineral record - increase quantity by 1
        const existingRecord = existingColonyMinerals[0]
        const updatedQuantity = existingRecord.quantity + 1

        const patchResponse = await fetch(`http://localhost:8088/colonyMinerals/${existingRecord.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                quantity: updatedQuantity
            })
        })
        console.log("Colony patch response:", patchResponse.status)
    } else {
        // Create new colonyMineral record with quantity of 1
        const postResponse = await fetch("http://localhost:8088/colonyMinerals", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                colonyId: currentColony,
                mineralId: currentMineral,
                quantity: 1
            })
        })
        console.log("Colony post response:", postResponse.status)
        if (!postResponse.ok) {
            console.error("POST failed:", await postResponse.text())
        }
    }

    // Update facilityMinerals - reduce quantity by 1
    const facilityMineralsResponse = await fetch(`http://localhost:8088/facilityMinerals?facilityId=${currentFacility}&mineralId=${currentMineral}`)
    const facilityMinerals = await facilityMineralsResponse.json()
    
    if (facilityMinerals.length > 0) {
        const facilityRecord = facilityMinerals[0]
        
        const updatedFacilityQuantity = facilityRecord.quantity - 1

        const facilityPatchResponse = await fetch(`http://localhost:8088/facilityMinerals/${facilityRecord.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                quantity: updatedFacilityQuantity
            })
        })
        console.log("Facility patch response:", facilityPatchResponse.status)
        if (!facilityPatchResponse.ok) {
            console.error("Facility PATCH failed:", await facilityPatchResponse.text())
        }
    } else {
        console.error("No facility mineral record found for facilityId:", currentFacility, "mineralId:", currentMineral)
    }
    resetMineral()
    await render()
}
