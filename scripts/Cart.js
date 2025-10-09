const transientState = {
    currentGovernor: null,
    currentFacility: null,
    currentColony: null,
    mineralsInCart : []
}

export const updateTransientState = (e, key) => {
    const keyMap = {
        "governor": "currentGovernor",
        "facility": "currentFacility",
        "colony": "currentColony",
        "mineral" : "mineralsInCart"
    }

    if (key !== "mineral" ) {
    transientState[keyMap[key]] = Number(e.target.value)
    } else {
        transientState.mineralsInCart.push(Number(e.target.value))
    }
    console.log(transientState)

}

export const getTransientState = () => {
    return transientState
}




export const Cart = async () => {
    const response = await fetch("http://localhost:8088/minerals")
    const minerals = await response.json()





    let html = `
        <section class="cart">
    `



}