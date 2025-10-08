// import { fetchColonies } from "./database.json";

// const colonies = fetchColonies();

export const Colony = async () => {
  const response = await fetch("http://localhost:8088/colonies");
  const colonies = await response.json();

  let coloniesHTML = `<h2>Colonies</h2><select name="colony" > <option value="">Select a colony</option>`;

  const colonyOptions = colonies.map((colony) => {
    return `<option value= ${colony.id}>${colony.name}</option>`;
  });
  coloniesHTML += colonyOptions.join("");
  coloniesHTML += "</select>";
  return coloniesHTML;
};
