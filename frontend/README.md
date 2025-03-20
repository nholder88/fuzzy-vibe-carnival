# Home Organization System - Frontend

This is the frontend for the Home Organization System, a microservices-based application designed to streamline household management.

## Chore Management Features

The chore management module includes the following features:

- View all household chores with filtering by status
- Create new chores with details like title, description, priority, status
- Assign chores to household members
- Set due dates and recurring schedules
- Mark chores as completed
- Edit and delete existing chores

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:

```bash
npm install
# or
yarn install
```

### Environment Variables

Create a `.env.local` file in the frontend directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Building for Production

```bash
npm run build
# or
yarn build
```

Then start the production server:

```bash
npm run start
# or
yarn start
```

## Project Structure

- `/app` - Next.js app router
- `/components` - React components
- `/lib` - Utilities, hooks, and type definitions
- `/context` - React context providers

## Chore Management Components

- `ChoreManager` - Main component that manages chore state and views
- `ChoreList` - Displays all chores with filtering options
- `ChoreItem` - Individual chore display component
- `ChoreDetail` - Detailed view of a single chore
- `ChoreForm` - Form for creating and editing chores

## Next Steps

- Implement authentication with Auth0 or Firebase
- Add WebSocket support for real-time updates
- Implement household management features
- Build out inventory tracking module
- Create shopping list functionality
