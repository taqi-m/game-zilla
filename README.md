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
    <a href="https://www.gnu.org/licenses/gpl-3.0">
        <img src="https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge" alt="License: GPL v3" />
    </a>
</p>

A full-stack web application for gamers to discover, track, and review video games. Built with React, Node.js, Express, and SQL Server.

> This project was developed as a university semester project for a Database Systems course, with a primary focus on implementing and demonstrating core database concepts. The application utilizes SQL Server features such as indexes, views, and triggers to leverage the full functionality of the database system.

## 📚 Table of Contents

- [📋 Features](#-features)
- [🛠️ Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
- [📝 API Documentation](#-api-documentation)
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
   git clone https://github.com/yourusername/game-zilla.git
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
   JWT_SECRET=your_jwt_secret
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

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register a new user |
| `/api/auth/login` | POST | Login a user |
| `/api/games` | GET | Get all games |
| `/api/games/:id` | GET | Get a specific game |
| `/api/reviews` | POST | Create a review |
| `/api/user/library` | GET | Get user's game library |

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

