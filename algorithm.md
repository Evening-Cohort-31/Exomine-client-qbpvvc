# Exomine Algorithm - System Architecture

## Overview
Exomine is a mineral trading system where governors manage colonies and purchase minerals from facilities. The system tracks inventory across colonies and facilities, enabling mineral transactions through a cart-based interface.

## System Flow

```
Governor Selection → Facility Selection → Mineral Selection → Cart → Purchase
       ↓                    ↓                   ↓           ↓         ↓
   Set Colony         Set Facility      Add to Cart    Review    Update DB
```

## User Interaction Workflow

### 1. Governor Selection (`Governor.js`)
- **User Action:** Select a governor from dropdown
- **Frontend Effects:**
  - Updates displayed colony information
  - Refreshes colony inventory display
- **Backend Effects:**
  - Sets `colonyId` for the current transaction session
  - Enables facility selection interface

### 2. Facility Selection (`Facility.js`)
- **User Action:** Choose mining facility
- **Frontend Effects:**
  - Updates current facility display
  - Shows available minerals (radio buttons for quantity > 0)
- **Backend Effects:**
  - Sets `facilityId` for the transaction

### 3. Mineral Selection (`Mineral.js`)
- **User Action:** Select mineral via radio button
- **Frontend Effects:**
  - Adds 1 ton of mineral to cart display
  - Enables purchase button
- **Backend Effects:**
  - Stores mineral selection in transient state

### 4. Purchase Completion
- **User Action:** Click purchase button
- **Frontend Effects:**
  - Decrements facility inventory by 1 ton
  - Increments colony inventory by 1 ton
- **Backend Effects:**
  - `PUT /facilityMinerals` - Update facility stock
  - `PUT /colonyMinerals` - Update colony inventory

## Database Architecture

### Core Tables

```sql
-- Colony management
Colonies: { id, name }
Governors: { id, name, active, colonyId }

-- Resource management  
Facilities: { id, name, active }
Minerals: { id, name }
```

### Inventory Tables

```sql
-- Facility stock tracking
facilityMinerals: { 
  facilityId (FK), 
  mineralId (FK), 
  quantity 
}

-- Colony inventory tracking
colonyMinerals: { 
  colonyId (FK), 
  mineralId (FK), 
  quantity 
}
```

### Transient State Management

| State | Structure | Purpose | API Action |
|-------|-----------|---------|------------|
| `fM` | `{ facilityId, mineralId, amount }` | Track facility stock changes | POST request |
| `cM` | `{ colonyId, mineralId, amount }` | Track colony inventory changes | POST (new) / PUT (existing) |

## Component Architecture

### Data Flow Components

#### `Governor.js` - Colony Management
```javascript
// Data Flow
Input: db.governors
Process: Governor selection → Colony change
Output: Governor selection HTML

// Key Functions
- handleInventory(): Updates colony display
- handleFacilitySelectionEnabled(): Enables facility selection
```

#### `Facility.js` - Facility Management  
```javascript
// Data Flow
Input: db.inventory
Process: Facility selection → Mineral availability
Output: Facility selection HTML

// Key Functions  
- Facility selection handler
- Updates mineral availability display
```

#### `Minerals.js` - Mineral Selection
```javascript
// Data Flow
Input: db.facilityMinerals
Process: Display available minerals → User selection
Output: Mineral selection HTML

// Key Functions
- onFacilityChange(facilityId): 
  * Fetches minerals for selected facility
  * Renders radio buttons for available stock
- Radio button selection handler
```

### Display Components

#### `Colony.js` - Colony Information Display
```javascript
// Data Flow
Input: db.colonies, db.colonyMinerals  
Process: Display colony info and inventory
Output: Colony information HTML

// Key Functions
- onGovernorChange(colonyId):
  * Fetch colony details
  * Fetch and display colony inventory
```

#### `Cart.js` - Transaction Management
```javascript
// Data Flow
Input: Selected minerals from transient state
Process: Display cart contents → Purchase execution  
Output: Cart HTML with purchase button

// Key Functions
- onRadioClick(): Display selected mineral in cart
- onButtonClick(): Execute purchase transaction
```

#### `PurchaseButton.js` - Transaction Execution
```javascript
// Simple button component
- Renders purchase button
- Handles click events for transaction completion
```

## API Endpoints (Implied)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/governors` | Fetch all governors |
| `GET` | `/colonies/:id` | Get colony details |
| `GET` | `/facilityMinerals/:facilityId` | Get facility inventory |
| `GET` | `/colonyMinerals/:colonyId` | Get colony inventory |
| `PUT` | `/facilityMinerals` | Update facility stock |
| `PUT` | `/colonyMinerals` | Update colony inventory |

## System Features

### Inventory Management
- **Real-time Updates:** Frontend immediately reflects inventory changes
- **Constraint Handling:** Radio buttons disabled when quantity = 0
- **Dual Tracking:** Separate inventories for facilities and colonies

### Transaction Safety
- **Transient State:** Selections held in memory before commit
- **Atomic Updates:** Both facility and colony inventories updated together
- **Validation:** Only available minerals can be selected

### User Experience
- **Progressive Selection:** Each choice enables the next step
- **Visual Feedback:** Cart displays selected items before purchase
- **Inventory Visibility:** Users can see both source and destination inventories

## Technical Notes

### State Management Strategy
- **Database State:** Persistent storage in join tables
- **Transient State:** Temporary storage for active transactions
- **Component State:** Local UI state management

### Error Handling Considerations
- Network failures during API calls
- Concurrent inventory modifications
- Invalid selections (out of stock items)

### Performance Optimizations
- Lazy loading of mineral data on facility selection
- Efficient join queries for inventory display
- Minimal API calls through strategic caching