# Solana OwnNest Fashion

## Overview

The Design  Project is a decentralized application (dApp) that allows users to create and store representing their design ideas on the Solana blockchain. The application features a frontend built with React and a backend API that interfaces with a MongoDB database.

## Features

- User authentication and design submission
-  creation and storage on the Solana blockchain

## Table of Contents

- [Installation](#installation)
- [Frontend and Backend Dependencies](#frontend-dependencies)
- [Smart Contract Dependencies](#smart-contract-dependencies)
- [Frontend API Reference](#frontend-api-reference)
- [Smart Contract](#smart-contract)

## Installation

### Prerequisites

Ensure you have the following installed:

- **Rust**: Required for building the smart contract. Follow the installation guide on [rust-lang.org](https://www.rust-lang.org/tools/install).
- **Node.js**: Required for running the frontend and backend. Download it from [nodejs.org](https://nodejs.org/).
- **MongoDB**: Required for the backend. You can set it up locally or use a cloud service like MongoDB Atlas. Visit [mongodb.com](https://www.mongodb.com/) for more details.

### Frontend and Backend Dependencies
```bash
npm install react axios react-router-dom
npm install express mongoose body-parser
```

### Smart Contract Dependencies
```bash
cargo install --git https://github.com/project-serum/anchor anchor-cli --locked
```

### Frontend API Reference

API Reference: `/api/registers`

POST: Save Design

- **Description**: Saves a new design submitted by the user.

#### Request Body:
- `user_id`: User's ID
- `title`: Design title
- `color`: Design color
- `fabric`: Fabric used
- `buttons`: Button details
- `imageUrl`: Image URL

### Smart Contract

#### Program: `design`

This smart contract manages the storage of designs on the Solana blockchain.

##### Function: `store_design`

- **Description**: Stores the provided JSON design data in the designated design account.

###### Parameters:
- `ctx`: Context - The context for the transaction, including account information.
- `json_data`: JSON string containing the design data.

###### Returns:
- `Result<()>` indicating success or failure.

#### Account: `DesignAccount`

Represents the account that stores design data.

##### Field:
- `json_data`: `Vec<u8>` - A vector of bytes holding the JSON data representing the design.
ownnest_solanaapp

## OwnNest DEMO - Figma

### Index Page
A page designed to add creations. Each button serves a different type of creation record:
- **Fashion (main)**
- **Signature Dishes**
- **Furniture Design**
- **Visual Arts**
- **Marketplace (Valley)**
- **Social Network**

[View Index Page](https://www.figma.com/design/iJNw4sCietYsA3pNpqhLt1/OwnNest-DEMO?node-id=0-1)

---

### A Porter Page
This page contains records of fashion creations and creative processes. It is divided into:
- My Created Designs
- Designs in Progress
- Inspirations
- Process Steps

[View A Porter Page](https://www.figma.com/design/iJNw4sCietYsA3pNpqhLt1/OwnNest-DEMO?node-id=7-392)

---

### Parachute Pants Page
This page contains the recorded steps of the creative process for the Parachute Pants project, including one step yet to be filled.

[View Parachute Pants Project](https://www.figma.com/design/iJNw4sCietYsA3pNpqhLt1/OwnNest-DEMO?node-id=7-2890)

---

### Register New Step Page
This page is open for users to insert the next step in the creative process.

[View Register New Step](https://www.figma.com/design/iJNw4sCietYsA3pNpqhLt1/OwnNest-DEMO?node-id=7-3230)

---

### Registered Page
This page opens after clicking “register” in the previous step and confirms the registration of that step.

[View Registered Page](https://www.figma.com/design/iJNw4sCietYsA3pNpqhLt1/OwnNest-DEMO?node-id=7-3506)
