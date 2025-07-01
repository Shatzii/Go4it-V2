# Go4It Sports Platform

## Overview

The Go4It Sports Platform is a comprehensive sports analytics application designed to provide insights and tools for athletes, coaches, and academic tracking. The platform integrates a robust backend with an interactive frontend, enabling users to access real-time data and analytics.

## Features

- **Express Backend**: A fully operational backend that supports various functionalities including athlete scouting, transfer portal monitoring, and AI coaching services.
- **Next.js Frontend**: A dynamic frontend built with Next.js, featuring authentication, dashboards, and various components for user interaction.
- **API Integration**: Seamless communication between the frontend and backend through a well-defined API proxy system.
- **Authentication**: Secure user authentication using Clerk, ensuring that user data is protected and accessible only to authorized individuals.
- **Real-Time Data**: Access to real-time data from athlete scouts, academic progress tracking, and team management features for coaches.

## Project Structure

```
go4it-sports-platform
├── app
│   ├── api
│   │   ├── academic
│   │   ├── coach
│   │   ├── player
│   │   └── skill-tree
│   ├── academics
│   ├── coach
│   ├── starpath
│   └── middleware.ts
├── server
│   ├── middleware
│   ├── index.ts
│   └── types
├── public
├── .env.local
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

1. **Clone the Repository**: 
   ```bash
   git clone <repository-url>
   cd go4it-sports-platform
   ```

2. **Install Dependencies**: 
   ```bash
   npm install
   ```

3. **Configure Environment Variables**: 
   Create a `.env.local` file in the root directory and populate it with the necessary environment variables, including API keys and backend URLs.

4. **Run the Application**: 
   Start both the frontend and backend servers concurrently:
   ```bash
   npm run dev
   ```

5. **Access the Application**: 
   Open your browser and navigate to `http://localhost:3000` to access the frontend.

## Usage Guidelines

- **Authentication**: Users must sign in to access protected routes and features.
- **Data Access**: All data displayed on the platform is fetched from the backend, ensuring that users see real-time information.
- **Feedback and Contributions**: Contributions to the project are welcome. Please submit issues or pull requests for any enhancements or bug fixes.

## Critical Success Metrics

- Successful user authentication and access to protected pages.
- Accurate display of skill tree data, player progress, and academic tracking.
- Operational integrity of all backend services and API endpoints.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.