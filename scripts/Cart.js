import { render } from "./main.js"
import { CheckoutButton } from "./CheckoutButton.js"

const transientState = {
    currentGovernor: null,
    currentFacility: null,
    currentMineral : null
}

export const updateTransientState = async (e, key) => {
    const keyMap = {
        "governor": "currentGovernor",
        "facility": "currentFacility",
        "mineral" : "currentMineral"
    }

    if (key !== "mineral") {
        transientState.currentMineral = null
    }

    transientState[keyMap[key]] = Number(e.target.value)

    await render()
}

export const getTransientState = () => {
    return transientState
}

export const resetMineral = () => {
    transientState.currentMineral = null
}




export const Cart = async () => {
    const mineralResponse = await fetch(`http://localhost:8088/minerals?id=${transientState.currentMineral}`)
    const mineral = await mineralResponse.json()

    const facilityResponse = await fetch(`http://localhost:8088/facilities?id=${transientState.currentFacility}`)
    const facility = await facilityResponse.json()

    let html = `
        <section class="cart">
            <h2>Space Cart</h2>
                ${mineral.length > 0 ? `<p>1 ton of ${mineral[0].name} from ${facility[0].name}</p>` : ""}
                ${CheckoutButton()}
        </section>
    `


    return html
}