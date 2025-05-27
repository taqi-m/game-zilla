<p align="center">
    <h1 align="center">🎮 Game-Zilla</h1>
</p>

<p align="center">
    <a href="https://reactjs.org/">
        <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=20232A" alt="React" />
    </a>
    <a href="https://nodejs.org/">
        <img src="https://img.shields.io/badge/Node.js-3C873A?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    </a>
    <a href="https://expressjs.com/">
        <img src="https://img.shields.io/badge/Express-303030?style=for-the-badge&logo=express&logoColor=61DAFB" alt="Express" />
    </a>
    <a href="https://www.microsoft.com/sql-server">
        <img src="https://img.shields.io/badge/SQL%20Server-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white" alt="SQL Server" />
    </a>
    <a href="https://jwt.io/">
        <img src="https://img.shields.io/badge/JWT-F7B93E?style=for-the-badge&logo=jsonwebtokens&logoColor=000000" alt="JWT" />
    </a>
    <a href="./LICENSE">
        <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License: MIT" />
    </a>
</p>

A full-stack web application for gamers to discover, track, and review video games. Built with React, Node.js, Express, and SQL Server.

> This project was developed as a university semester project for a Database Systems course, with a primary focus on implementing and demonstrating core database concepts. The application utilizes SQL Server features such as indexes, views, and triggers to leverage the full functionality of the database system. Over time, this semester project evolved into a full-stack web application, integrating both frontend and backend technologies for a complete user experience.

## 📚 Table of Contents

- [📋 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
- [📝 API Documentation](#-api-documentation)
- [📊 Database Schema](#-database-schema)
- [📄 License](#-license)
- [👥 Team](#-team)

## 📋 Features

- **Game Discovery**: Browse and search through an extensive database of games
- **User Authentication**: Secure login and registration system
- **Personal Game Library**: Track your games, mark favorites, and manage your collection
- **Game Reviews**: Read and write reviews for games
- **Responsive Design**: Fully responsive interface that works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express
- **Database**: SQL Server
- **Authentication**: JWT, bcrypt

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- SQL Server instance
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/taqi-m/game-zilla.git
   cd game-zilla
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   ```

3. **Create a .env file in the backend directory with the following variables**
   ```
   DB_SERVER=your_db_server
   DB_USER=your_db_username
   DB_PASSWORD=your_db_password
   DB_DATABASE=your_db_name
   DB_PORT=1433
   ```

4. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The server will run on http://localhost:5000

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```
   The application will open in your browser at http://localhost:3000

## 📝 API Documentation

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/auth/register` | POST | Register a new user | username, email, password_hash |
| `/api/auth/login` | POST | Login a user | email, password |
| `/api/auth/logout` | POST | Logout a user | None |
| `/api/users` | GET | Get all users | None |
| `/api/users/:id` | GET | Get a specific user | None |
| `/api/users/:id` | PUT | Update a user | username, email, is_active (optional) |
| `/api/users/:id` | DELETE | Delete a user | None |
| `/api/games` | GET | Get all games | sort, genre, platform (all optional) |
| `/api/games/genres` | GET | Get all game genres | None |
| `/api/games/platforms` | GET | Get all game platforms | None |
| `/api/games/:id` | GET | Get a specific game | None |
| `/api/games` | POST | Create a new game | title, description, price, genre, platform, developer, release_date, is_featured |
| `/api/games/:id` | PUT | Update a game | title, description, price, genre, platform, developer, release_date, is_featured |
| `/api/games/:id` | DELETE | Delete a game | None |
| `/api/reviews/game/:gameId` | GET | Get reviews for a game | None |
| `/api/reviews` | POST | Create a review | game_id, rating, comment |
| `/api/reviews/:reviewId` | PUT | Update a review | rating, comment |
| `/api/reviews/:reviewId` | DELETE | Delete a review | None |
| `/api/cart/:userId` | GET | Get user's cart | None |
| `/api/cart/add` | POST | Add item to cart | game_id, quantity, user_id |
| `/api/cart/update` | PUT | Update cart item | cart_item_id, quantity |
| `/api/cart/remove/:cart_item_id` | DELETE | Remove item from cart | None |
| `/api/cart/:userId/clear` | DELETE | Clear user's cart | None |
| `/api/orders` | GET | Get all orders | None |
| `/api/orders/:userId` | GET | Get orders for a user | None |
| `/api/orders` | POST | Place an order | user_id, cart_id, payment_id, shipping_address, billing_address |
| `/api/orders/details/:orderId` | GET | Get order details | None |
| `/api/orders/status/:orderId` | PUT | Update order status | status |
| `/api/orders/payment` | POST | Process payment | user_id, cart_id, amount, payment_method, card_last4 (optional) |
| `/api/categories` | GET | Get all categories | None |
| `/api/categories` | POST | Create a category | name |
| `/api/categories/:id` | PUT | Update a category | name |
| `/api/categories/:id` | DELETE | Delete a category | None |

## 📊 Database Schema

The following Entity-Relationship Diagram (ERD) shows the database structure of Game-Zilla:

```mermaid
%%{init: { 
    'theme': 'base',
    'themeVariables': {
        'primaryColor': '#f0f4ff',
        'primaryBorderColor': '#4a6baf',
        'primaryTextColor': '#1a237e',
        'lineColor': '#3a5683',
        'tertiaryColor': '#e3f2fd',
        'tertiaryBorderColor': '#90caf9',
        'fontFamily': 'Arial, sans-serif',
        'fontSize': '16px',
        'edgeLabelBackground': '#f8f9fa',
        'entityLabelFontWeight': 'bold'
    },
    'themeConfig': {
        'nodeTextMargin': 10,
        'padding': 15,
        'entityPadding': 12
    }
}}%%
erDiagram
    USERS ||--o{ ORDERS : "places"
    USERS ||--|| CARTS : "has"
    USERS ||--o{ REVIEWS : "writes"
    USERS ||--o{ USER_ROLES : "has"
    USERS {
        int user_id PK
        varchar username
        varchar email
        varchar password_hash
        boolean is_verified
        boolean is_active
        datetime created_at
        datetime updated_at
        datetime last_login_at
    }

    ROLES ||--o{ USER_ROLES : "assigned"
    ROLES ||--o{ ROLE_PERMISSIONS : "grants"
    ROLES {
        int role_id PK
        varchar name
        varchar description
    }

    PERMISSIONS ||--o{ ROLE_PERMISSIONS : "includes"
    PERMISSIONS {
        int permission_id PK
        varchar code
        varchar description
    }

    GAMES ||--o{ ORDER_ITEMS : "ordered_in"
    GAMES ||--o{ INVENTORY : "stocked_in"
    GAMES ||--o{ GAME_CATEGORIES : "categorized_as"
    GAMES ||--o{ REVIEWS : "has"
    GAMES ||--o{ GAME_IMAGES : "displays"
    GAMES {
        int game_id PK
        varchar title
        text description
        decimal price
        varchar genre
        varchar platform
        varchar developer
        date release_date
        boolean is_featured
        datetime created_at
        datetime updated_at
    }

    CARTS ||--o{ CART_ITEMS : "contains"
    CARTS {
        int cart_id PK
        int user_id FK
        datetime created_at
        datetime updated_at
    }

    ORDERS ||--o{ ORDER_ITEMS : "contains"
    ORDERS ||--|| PAYMENTS : "processed_via"
    ORDERS {
        int order_id PK
        int user_id FK
        datetime order_date
        decimal subtotal
        decimal tax_amount
        decimal shipping_cost
        decimal total_amount
        varchar status
        varchar shipping_address
        varchar billing_address
        datetime updated_at
    }

    CATEGORIES ||--o{ GAME_CATEGORIES : "groups"
    CATEGORIES {
        int category_id PK
        varchar name
    }

    PAYMENTS {
        int payment_id PK
        int order_id FK
        datetime payment_date
        decimal amount
        varchar payment_method
        varchar status
        varchar transaction_id
        varchar card_last4
    }

    INVENTORY {
        int inventory_id PK
        int game_id FK
        int stock_quantity
        int reserved_quantity
        datetime last_restock
    }

    REVIEWS {
        int review_id PK
        int user_id FK
        int game_id FK
        int rating
        text comment
        datetime created_at
        datetime updated_at
    }

    GAME_IMAGES {
        int image_id PK
        int game_id FK
        varchar image_url
        boolean is_primary
        int display_order
    }

    USER_ROLES {
        int user_id FK, PK
        int role_id FK, PK
        datetime assigned_at
    }

    ROLE_PERMISSIONS {
        int role_id FK, PK
        int permission_id FK, PK
    }

    CART_ITEMS {
        int cart_item_id PK
        int cart_id FK
        int game_id FK
        int quantity
        datetime added_at
    }

    ORDER_ITEMS {
        int item_id PK
        int order_id FK
        int game_id FK
        int quantity
        decimal unit_price
        decimal subtotal
    }
    
    GAME_CATEGORIES {
        int game_id FK, PK
        int category_id FK,PK
    }
```

## 📄 License

This project is licensed under the MIT License. - see the [LICENSE](LICENSE) file for details.

This means:
- You are free to use, modify, and distribute this software
- You may distribute modified versions under any license of your choice
- You are not required to release derivative works as open source
- The software is provided “as is”, without warranty of any kind
<div align="center">

## 👥 Team

<table>
    <tr>
        <td align="center" valign="middle">
            <img src="https://avatars.githubusercontent.com/taqi-m" width="48" height="48" alt="Muhammad Taqi" /><br/>
            <a href="https://github.com/taqi-m"><b>Muhammad Taqi</b></a><br/>
            <sub>Lead Developer</sub>
        </td>
        <td align="center" valign="middle">
            <img src="https://avatars.githubusercontent.com/l232550" width="48" height="48" alt="Tooba Nadeem" /><br/>
            <a href="https://github.com/l232550"><b>Tooba Nadeem</b></a><br/>
            <sub>UI/UX Designer</sub>
        </td>
        <td align="center" valign="middle">
            <img src="https://avatars.githubusercontent.com/NayabMaryam" width="48" height="48" alt="Nayab Maryam" /><br/>
            <a href="https://github.com/NayabMaryam"><b>Nayab Maryam</b></a><br/>
            <sub>Backend Engineer</sub>
        </td>
    </tr>
</table>

</div>

