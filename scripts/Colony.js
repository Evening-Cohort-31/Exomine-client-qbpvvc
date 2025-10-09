import { getTransientState } from "./Cart.js";

export const Colony = async () => {
  const currentTransientState = getTransientState()
  const currentGovernorId = currentTransientState.currentGovernor

  const response = await fetch(`http://localhost:8088/governors?id=${currentGovernorId}&_expand=colony`)
  const currentGovernor = await response.json()


  let coloniesHTML = `<h2>${currentGovernor.length > 0 ? `${currentGovernor[0].colony.name + " Minerals"}` : "Colony Minerals"}</h2>`;

  // const colonyOptions = colonies.map((colony) => {
  //   return `<option value= ${colony.id} ${currentTransientState.currentColony === colony.id ? "selected" : ""}>${colony.name}</option>`;
  // });
  // coloniesHTML += colonyOptions.join("");
  // coloniesHTML += "</select>";
  return coloniesHTML;
};
