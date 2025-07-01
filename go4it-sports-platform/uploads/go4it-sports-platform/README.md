# Go4It Sports Platform

## Overview
Go4It Sports Platform is an AI-powered sports analytics platform designed specifically for neurodivergent student athletes. The platform provides advanced analytics, training resources, and tools to help athletes enhance their skills and achieve their goals.

## Key Features
- **GAR Analytics System**: Offers star ratings with a cyan/blue theme to evaluate athlete performance.
- **Self-hosted AI Video Analysis**: Utilizes four AI models for in-depth video analysis.
- **NCAA Eligibility Calculator**: Helps athletes determine their eligibility for NCAA participation.
- **Multi-sport Training System**: Supports training for 12 different sports.
- **StarPath Skill Development**: A structured approach to skill enhancement.
- **Advanced AI Features Dashboard**: Provides insights and analytics for athletes and coaches.
- **USA Football Affiliate Integration**: Connects athletes with resources and opportunities in football.

## Project Structure
The project is divided into two main parts: the backend and the frontend.

### Backend
- **Technologies**: Express.js, Node.js, TypeScript, PostgreSQL with Drizzle ORM, bcrypt for authentication, and Multer for file uploads.
- **Directory**: `backend/src`
  - `app.ts`: Entry point for the backend application.
  - `controllers/`: Contains controller functions for handling requests.
  - `routes/`: Defines API endpoints and associates them with controllers.
  - `models/`: Data models for user and analytics.
  - `middleware/`: Authentication middleware.
  - `utils/`: Utility functions for video processing.
  - `types/`: TypeScript interfaces and types.

### Frontend
- **Technologies**: React, Vite, TypeScript, Tailwind CSS.
- **Directory**: `frontend/src`
  - `App.tsx`: Main component for the React application.
  - `main.tsx`: Entry point for rendering the application.
  - `components/`: Reusable UI components.
  - `pages/`: Contains page components like the Dashboard.
  - `hooks/`: Custom hooks for managing state.
  - `utils/`: API utility functions.
  - `types/`: TypeScript interfaces and types.

## Setup Instructions
1. **Clone the Repository**: 
   ```
   git clone https://github.com/microsoft/vscode-remote-try-go.git
   cd go4it-sports-platform
   ```

2. **Backend Setup**:
   - Navigate to the backend directory:
     ```
     cd backend
     ```
   - Install dependencies:
     ```
     npm install
     ```
   - Create a `.env` file based on `.env.example` and fill in the required environment variables.
   - Start the backend server:
     ```
     npm start
     ```

3. **Frontend Setup**:
   - Navigate to the frontend directory:
     ```
     cd ../frontend
     ```
   - Install dependencies:
     ```
     npm install
     ```
   - Start the frontend development server:
     ```
     npm run dev
     ```

## Usage
Once both the backend and frontend servers are running, you can access the Go4It Sports Platform through your web browser. The application will provide tools and resources tailored for neurodivergent student athletes to enhance their training and performance.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.