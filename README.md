# Alsa MGM - ERP/MES Production Planner

Alsa MGM is a scalable Manufacturing Execution System (MES) and Enterprise Resource Planning (ERP) platform tailored for production planning, workstation management, and assembly line orchestration.

> [!WARNING]
> **NOT FOR PRODUCTION USE**
> Please note that this repository is a public demonstration and development project. It is **NOT intended for use in a production environment**. It lacks enterprise-grade security hardening, extensive end-to-end testing, and reliability guarantees required for actual industrial, operational, or commercial production deployment. Use it strictly for educational, testing, or development purposes.

## Architecture & Tech Stack

The project adheres to strict typing and architectural standards to ensure maintainability and robustness:

### Backend 
- **Node.js & TypeScript**
- **TSOA**: Utilized for automatic route generation, strict OpenAPI spec compliance, and strong typing via `@Route`, `@Tags`, and `@Response` decorators.
- **API Standard**: All endpoints adhere to the **JSON API v1.0** specification.
- **Production Logic**:
  - Timezone-aware scheduling utilizing UTC.
  - Strict validation of production statuses (e.g., transitions from 'Planned' strictly require 'In Progress' before 'Completed').
  - **Data Safety**: No hard deletes; soft deletion (`isDeleted`) methodology is utilized across entities.

### Frontend 
- **Angular 21**: Modern structured UI utilizing Standalone Components.
- **State Management**: Heavy reliance on Angular Signals for reactive state handling, minimizing traditional RxJS streams.
- **Styling**: Tailwind CSS combined with SCSS for dynamic styling (e.g., CSS variables representing production line statuses).
- **Communication**: Strongly-typed frontend services mapped exactly to backend schemas.

## Getting Started

### Prerequisites
- Node.js (v20+)
- npm 

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd alsa_mgm
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application Locally

To start both the backend and frontend concurrently for development:
```bash
npm run dev
```

Alternatively, you can run them in separate terminal instances:
- **Backend API**: `npm run start:backend`
- **Frontend App**: `npm run start:frontend`

### Seeding the Database
To populate the development database with mock production lines and workstations:
```bash
npm run seed
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. As Free Software (Wolne Oprogramowanie), you are granted permission to view, modify, and distribute this software, subject to the conditions of the license.
