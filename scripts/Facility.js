// State variables
let apiData = {};
let facilityId = null;


// Fetch database from API - fetches all endpoints
export const fetchDatabase = async () => {
  const [facilities, minerals, governors, colonies, facilityMinerals, colonyMinerals] = await Promise.all([
    fetch('http://localhost:8088/facilities').then(r => r.json()),
    fetch('http://localhost:8088/minerals').then(r => r.json()),
    fetch('http://localhost:8088/governors').then(r => r.json()),
    fetch('http://localhost:8088/colonies').then(r => r.json()),
    fetch('http://localhost:8088/facilityMinerals').then(r => r.json()),
    fetch('http://localhost:8088/colonyMinerals').then(r => r.json())
  ]);
  
  apiData = {
    facilities,
    minerals,
    governors,
    colonies,
    facilityMinerals,
    colonyMinerals
  };
  
  return apiData;
};

// Get only active facilities
export function getActiveFacilities() {
  if (!apiData || !apiData.facilities) return [];
  return apiData.facilities.filter(facility => facility.active);
}

// Get minerals with quantity > 0 for selected facility
export function getAvailableMinerals(selectedFacilityId) {
  if (!apiData || !selectedFacilityId) return [];
  
  return apiData.facilityMinerals
    .filter(facilityMineral => facilityMineral.facilityId === selectedFacilityId && facilityMineral.quantity > 0)
    .map(facilityMineral => ({
      ...apiData.minerals.find(mineral => mineral.id === facilityMineral.mineralId),
      quantity: facilityMineral.quantity
    }));
}


// Generate facility dropdown HTML
export const Facility = async () => {
    await fetchDatabase()
  const facilities = getActiveFacilities();
  
  return `
    <h2>Select Facility</h2>
    <select id="facility">
      <option value="">-- Select a facility --</option>
      ${facilities.map(facility => `<option value="${facility.id}" ${facility.id === facilityId? "selected": ""} >${facility.name}</option>`).join('')}
    </select>
  `;
};

// Attach event listener to facility dropdown
export function attachFacilityListener(callback) {
  const facilitySelect = document.getElementById('facility');
  if (facilitySelect) {
    facilitySelect.addEventListener('change', (event) => {
      facilityId = parseInt(event.target.value) || null;
      console.log('Selected facilityId:', facilityId);
      callback();
    });
  }
}

// Get selected facility ID
export function getFacilityId() {
  return facilityId;
}