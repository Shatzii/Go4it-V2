# Go4It Sports Platform - Frontend Documentation

## Overview
The Go4It Sports Platform is an AI-powered sports analytics platform designed specifically for neurodivergent student athletes. This frontend application is built using React, Vite, TypeScript, and Tailwind CSS, providing a responsive and user-friendly interface.

## Project Structure
- **src/**: Contains the main application code.
  - **App.tsx**: The main component that sets up the application structure and routing.
  - **main.tsx**: The entry point for the React application, rendering the App component.
  - **components/**: Reusable UI components.
  - **pages/**: Contains page components like the Dashboard.
  - **hooks/**: Custom hooks for managing state and side effects.
  - **utils/**: Utility functions for API calls and other helper functions.
  - **types/**: TypeScript interfaces and types used throughout the application.
- **public/**: Contains static files, including the main HTML file.
- **package.json**: Lists dependencies and scripts for the frontend project.
- **tsconfig.json**: TypeScript configuration file.
- **tailwind.config.js**: Configuration for Tailwind CSS.

## Setup Instructions
1. **Clone the repository**:
   ```
   git clone https://github.com/microsoft/vscode-remote-try-go.git
   cd go4it-sports-platform/frontend
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root of the frontend directory and add the necessary environment variables. Refer to the `.env.example` file for guidance.

4. **Run the application**:
   ```
   npm run dev
   ```

## Key Features
- GAR Analytics System with star ratings.
- Self-hosted AI video analysis with multiple AI models.
- NCAA eligibility calculator.
- Multi-sport training system supporting 12 sports.
- StarPath skill development.
- Advanced AI features dashboard.
- Integration with USA Football affiliate.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.