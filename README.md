# E-commerce Platform

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css)
![Sanity](https://img.shields.io/badge/Sanity-4.22.0-000?style=for-the-badge&logo=sanity&logoColor=fff)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.x-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-24.0.5-2496ED?style=for-the-badge&logo=docker&logoColor=white)

[![CI Status](https://img.shields.io/github/actions/workflow/status/username/repo/ci.yml?style=for-the-badge)](https://github.com/username/repo/actions/workflows/ci.yml)
[![Coverage](https://img.shields.io/codecov/c/github/username/repo?style=for-the-badge)](https://codecov.io/gh/username/repo)
[![License](https://img.shields.io/github/license/username/repo?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/github/package-json/v/username/repo?style=for-the-badge)](package.json)

A modern, full-stack e-commerce platform built with Next.js, Sanity CMS, PostgreSQL, and Tailwind CSS. Features include secure authentication, product management, shopping cart functionality, and responsive design.

## 🚀 Features

- **Modern UI/UX**: Built with Tailwind CSS and shadcn/ui components
- **Authentication**: Secure user authentication with Clerk
- **Content Management**: Powered by Sanity CMS for product management
- **Responsive Design**: Mobile-first responsive layout
- **Shopping Cart**: Full-featured cart with persistence
- **Payment Integration**: Ready for payment processing
- **SEO Optimized**: Meta tags, structured data, and performance optimization
- **Containerized**: Docker and Docker Compose support
- **Testing**: Comprehensive unit, integration, and end-to-end tests
- **CI/CD Ready**: Pre-configured for continuous integration

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16.1.1](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom components
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Sequelize](https://sequelize.org/)
- **CMS**: [Sanity](https://www.sanity.io/)
- **Authentication**: [Clerk](https://clerk.com/)

### Infrastructure
- **Containerization**: [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- **Caching**: [Redis](https://redis.io/)
- **Testing**: [Vitest](https://vitest.dev/), [Jest](https://jestjs.io/), [React Testing Library](https://testing-library.com/)
- **Code Quality**: [Biome.js](https://biomejs.dev/)

## 📦 Installation

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v18 or later)
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads)

### Quick Setup with Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ecommerce.git
   cd ecommerce
   ```

2. Create a `.env` file from the template:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your configuration values:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   
   # Sanity Configuration
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   SANITY_API_READ_TOKEN=your_read_token
   
   # Database
   DATABASE_URL=postgresql://postgres:0000@localhost:5432/ecommerce
   
   # Backend API
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
   ```

4. Start the application with Docker Compose:
   ```bash
   docker-compose up --build
   ```

5. The application will be available at:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:5000](http://localhost:5000)
   - Database: [http://localhost:5432](http://localhost:5432)
   - Redis: [http://localhost:6379](http://localhost:6379)

### Manual Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ecommerce.git
   cd ecommerce
   ```

2. Install dependencies:
   ```bash
   # Install frontend dependencies
   pnpm install
   
   # Install backend dependencies
   cd backend && pnpm install
   cd ..
   ```

3. Set up environment variables (see `.env.example` for reference)

4. Start the development servers:
   ```bash
   # Terminal 1: Start the backend
   cd backend && pnpm run dev
   
   # Terminal 2: Start the frontend
   pnpm run dev
   ```

## 🧪 Testing

### Running Tests

#### Frontend Tests
```bash
# Run all frontend tests
pnpm run test

# Run tests in watch mode
pnpm run test:dev

# Run tests with UI
pnpm run test:ui

# Run tests and generate coverage
pnpm run test:coverage

# Run tests once
pnpm run test:run

# Run unit tests only
pnpm run test:unit

# Run integration tests only
pnpm run test:integration
```

#### Backend Tests
```bash
# Run all backend tests
cd backend && pnpm run test

# Run unit tests only
pnpm run test:unit

# Run integration tests only
pnpm run test:integration

# Run tests with coverage
pnpm run test:coverage

# Run tests in watch mode
pnpm run test:watch

# Run tests for CI
pnpm run test:ci
```

### Test Structure

#### Backend Tests
Located in `backend/__tests__/`:
- `userModel.test.js` - Unit tests for the User model
- `productModel.test.js` - Unit tests for the Product model
- `categoryModel.test.js` - Unit tests for the Category model
- `orderModel.test.js` - Unit tests for the Order model
- `userController.test.js` - Validation tests for the User controller
- `productController.test.js` - Validation tests for the Product controller
- `api.integration.test.js` - Integration tests for API endpoints

#### Frontend Tests
Located in `__tests__/`:
- `ProductCard.test.tsx` - Unit tests for the ProductCard component
- `Header.test.tsx` - Unit tests for the Header component
- `CartItem.test.tsx` - Unit tests for the CartItem component
- `CartSheet.test.tsx` - UI tests for the CartSheet component
- `ux.test.tsx` - User experience tests

## 📊 Project Statistics

| Metric | Count |
|--------|-------|
| Languages | 3+ (TypeScript, JavaScript, SQL) |
| Dependencies | ~50+ |
| Components | 20+ |
| Tests | 100+ |
| Lines of Code | ~10,000+ |

### Performance Metrics

- **Bundle Size**: < 200KB (Gzipped)
- **Lighthouse Score**: > 90 (Performance)
- **Page Load Time**: < 2 seconds (on average)
- **Time to Interactive**: < 3 seconds

## 🚀 Deployment

### Production Deployment

#### Using Docker Compose
```bash
# Build and deploy production version
docker-compose -f docker-compose.prod.yml up --build -d
```

#### Manual Deployment
1. Build the application:
   ```bash
   pnpm run build
   ```

2. Start the production server:
   ```bash
   pnpm run start
   ```

### Environment Variables for Production

Make sure to set these environment variables in your production environment:

```env
NODE_ENV=production
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_production_publishable_key
CLERK_SECRET_KEY=your_production_secret_key
NEXT_PUBLIC_SANITY_PROJECT_ID=your_production_project_id
SANITY_API_READ_TOKEN=your_production_read_token
DATABASE_URL=your_production_database_url
NEXT_PUBLIC_API_BASE_URL=your_production_backend_url
```

## 🐳 Containerization

The application is fully containerized using Docker:

- **Frontend**: Next.js application in a Node.js Alpine container
- **Backend**: Express.js API in a Node.js Alpine container
- **Database**: PostgreSQL 15
- **Cache**: Redis

### Docker Compose Services

- `frontend`: Next.js application (port 3000)
- `backend`: Express.js API (port 5000)
- `postgres`: PostgreSQL database (port 5432)
- `redis`: Redis cache (port 6379)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style (enforced by Biome.js)
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting a PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Sanity](https://www.sanity.io/) - Headless CMS
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Accessible UI components
- [Clerk](https://clerk.com/) - Authentication solution
- [Vercel](https://vercel.com/) - Hosting platform

---

<div align="center">

**Made with ❤️ by the E-commerce Team**

⭐ Star this repo if you find it helpful!

</div>