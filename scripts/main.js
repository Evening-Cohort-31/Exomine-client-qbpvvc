import { Governor } from "./Governor.js"
import {Facility} from "./Facility.js"
import { Minerals } from "./Minerals.js"
import { Colony } from "./Colony.js";
import { Cart, updateTransientState } from "./Cart.js"
import { handleSubmit } from "./CheckoutButton.js";

export const render = async () => {
  const html = `
        <header>
            <h1>Solar System Mining Marketplace</h1>
        </header>
        <article class="selections">
            <section class="selections__governor">
                ${await Governor()}
            </section>
            <section class="selections__facilities">
                ${await Facility()}
            </section>
        </article>
        <article class="colony_inventory">
                ${await Colony()}
        </article>
        <article class="facility_inventory">
                ${await Minerals()}
        </article>
        <article class="cart">
                ${await Cart()}
        </article> 
    `;

  const body = document.querySelector("body");
  body.innerHTML = html;
  document.querySelectorAll(".mineralRadio").forEach(radio => {
    radio.addEventListener("click", (event) => updateTransientState(event, "mineral"))
  })
  document.querySelector(".governorSelect").addEventListener("change", (event) => {updateTransientState(event, "governor")})
  document.querySelector(".facilitySelector").addEventListener("change", (event) => {updateTransientState(event, "facility")})
  document.querySelector("#submit").addEventListener("click", handleSubmit)
};



await render();



