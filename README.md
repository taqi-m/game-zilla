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

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

This means:
- You are free to use, modify, and distribute this software
- If you distribute modified versions, they must also be licensed under the GPL-3.0
- Any derivative works must be open source
- The complete license text is available in the LICENSE file
## 👥 Team

<div align="center" style="display: flex; justify-content: center; flex-wrap: wrap; gap: 20px;">
    <div style="display: inline-block; margin: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.12); border-radius: 16px; padding: 16px 24px; background: #fff; text-align: center; width: 200px;">
        <a href="https://github.com/taqi-m" style="text-decoration: none;">
            <img src="https://avatars.githubusercontent.com/u/76934497?v=4" alt="Muhammad Taqi" style="border-radius: 50%; width: 80px; height: 80px;"/><br/>
            <span style="display: block; font-weight: bold; font-size: 1.1em; margin-top: 8px;">Muhammad Taqi</span>
            <span style="display: block; color: #555;">👨‍💻 Lead Developer</span>
        </a>
    </div>
    <div style="display: inline-block; margin: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.12); border-radius: 16px; padding: 16px 24px; background: #fff; text-align: center; width: 200px;">
        <a href="https://github.com/l232550" style="text-decoration: none;">
            <img src="https://avatars.githubusercontent.com/u/168574829?v=4" alt="Tooba Nadeem" style="border-radius: 50%; width: 80px; height: 80px;"/><br/>
            <span style="display: block; font-weight: bold; font-size: 1.1em; margin-top: 8px;">Tooba Nadeem</span>
            <span style="display: block; color: #555;">🎨 UI/UX Designer</span>
        </a>
    </div>
    <div style="display: inline-block; margin: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.12); border-radius: 16px; padding: 16px 24px; background: #fff; text-align: center; width: 200px;">
        <a href="https://github.com/NayabMaryam" style="text-decoration: none;">
            <img src="https://avatars.githubusercontent.com/u/168572636?v=4" alt="Nayab Maryam" style="border-radius: 50%; width: 80px; height: 80px;"/><br/>
            <span style="display: block; font-weight: bold; font-size: 1.1em; margin-top: 8px;">Nayab Maryam</span>
            <span style="display: block; color: #555;">🔧 Backend Engineer</span>
        </a>
    </div>
</div>

