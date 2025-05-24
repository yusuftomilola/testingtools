# ScavTools

A developer tools utilities platform providing high-quality, browser-based tools for developers. The tools range from simple frontend utilities to backend-integrated, blockchain-powered features.

## Project Structure

The project is organized into three main folders:

- **frontend**: Next.js application with the user interface
- **backend**: NestJS API server with PostgreSQL database
- **blockchain**: StarkNet integration for blockchain-related tools

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Yarn or npm

### Installation

1. Clone the repository
2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:

Create a `.env` file in the backend directory with the following variables:

\`\`\`
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=scavtools
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
\`\`\`

4. Start the development servers:

\`\`\`bash
npm run dev
\`\`\`

This will start both the frontend (http://localhost:3000) and backend (http://localhost:3001) servers.

## Features

- Frontend-only tools (Box Shadow Generator, Hash Generator, etc.)
- Backend-integrated tools (Smart Contract Address Shortener)
- StarkNet-powered tools (Contract Reader)
- User authentication and authorization
- Dark/light mode toggle
- Responsive design

## License

[MIT](LICENSE)
