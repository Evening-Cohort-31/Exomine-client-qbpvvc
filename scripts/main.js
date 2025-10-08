// import {Governor} from "./Governor.js"
// import {Facility} from "./Facility.js"
// import {Minerals} from "./Minerals.js"
// import {Colony} from "./Colony.js"
// import {Cart} from "./Cart.js"


export const render = () => {


    const html = `
        <header>
            <h1>Solar System Mining Marketplace</h1>
        </header>
        <article class="selections">
            <section class="selections__governor">
                $ {Governor()}
            </section>
            <section class="selections__facilities">
                $ {Facility()}
            </section>
        </article>
        <article class="colony_inventory">
                $ {Colony()}
        </article>
        <article class="facility_inventory">
                $ {Minerals()}
        </article>
        <article class="cart">
                $ {Cart()}
        </article> 
    `


    const body = document.querySelector("body")
    body.innerHTML = html
}


render()