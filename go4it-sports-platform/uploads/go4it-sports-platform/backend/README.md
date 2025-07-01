# Go4It Sports Platform - Backend

## Overview
The Go4It Sports Platform is an AI-powered sports analytics platform designed specifically for neurodivergent student athletes. This backend application is built using Express.js and TypeScript, providing a robust API for the frontend to interact with.

## Key Features
- GAR Analytics System with star ratings
- Self-hosted AI video analysis using multiple AI models
- NCAA eligibility calculator
- Multi-sport training system supporting 12 sports
- StarPath skill development
- Advanced AI features dashboard
- Integration with USA Football affiliate

## Project Structure
```
backend/
├── src/
│   ├── app.ts               # Entry point of the application
│   ├── controllers/         # Contains controller functions for handling requests
│   ├── routes/              # Defines API routes
│   ├── models/              # Data models for the application
│   ├── middleware/          # Authentication middleware
│   ├── utils/               # Utility functions for video processing
│   └── types/               # TypeScript interfaces and types
├── package.json             # NPM dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # Documentation for the backend
```

## Setup Instructions
1. **Clone the repository:**
   ```
   git clone https://github.com/microsoft/vscode-remote-try-go.git
   cd go4it-sports-platform/backend
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the backend directory and add the following variables:
   ```
   DATABASE_URL=postgresql://...
   NODE_ENV=production
   SESSION_SECRET=your-secret-key
   PORT=5000
   ```

4. **Run the application:**
   ```
   npm start
   ```

## Usage
The backend API provides endpoints for various functionalities, including user authentication, analytics retrieval, and video processing. Refer to the routes defined in `src/routes/index.ts` for detailed API documentation.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.