# Testing Documentation

This document outlines the testing strategy and implementation for the E-commerce application.

## Table of Contents
- [Overview](#overview)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Test Types](#test-types)
- [Writing Tests](#writing-tests)

## Overview

The e-commerce application implements a comprehensive testing strategy covering both frontend and backend components. Our testing approach includes:

- Unit tests for individual functions and components
- Integration tests for API endpoints and component interactions
- UI tests for user interface components
- User experience tests for end-to-end flows

## Test Structure

### Backend Tests
Backend tests are located in the `backend/__tests__` directory and include:

- `userModel.test.js` - Unit tests for the User model
- `productModel.test.js` - Unit tests for the Product model
- `categoryModel.test.js` - Unit tests for the Category model
- `orderModel.test.js` - Unit tests for the Order model
- `userController.test.js` - Validation tests for the User controller
- `productController.test.js` - Validation tests for the Product controller
- `api.integration.test.js` - Integration tests for API endpoints
- `setup.js` - Test setup and teardown utilities

### Frontend Tests
Frontend tests are located in the `__tests__` directory and include:

- `ProductCard.test.tsx` - Unit tests for the ProductCard component
- `Header.test.tsx` - Unit tests for the Header component
- `CartItem.test.tsx` - Unit tests for the CartItem component
- `CartSheet.test.tsx` - UI tests for the CartSheet component
- `ux.test.tsx` - User experience tests
- `setup.ts` - Test setup and utilities

## Running Tests

### Frontend Tests
```bash
# Run all frontend tests
npm run test

# Run tests in watch mode
npm run test:dev

# Run tests with UI
npm run test:ui

# Run tests and generate coverage
npm run test:coverage

# Run tests once
npm run test:run
```

### Backend Tests
```bash
# Run all backend tests
npm run test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests for CI
npm run test:ci
```

## Test Types

### Unit Tests
Unit tests verify the functionality of individual functions, methods, and components in isolation. These tests:

- Test individual functions and methods
- Verify model validations and business logic
- Check component rendering with different props
- Validate error handling for edge cases

### Integration Tests
Integration tests verify how different parts of the system work together. These tests:

- Test API endpoints and their responses
- Verify database operations and relationships
- Check middleware and authentication flows
- Validate cross-component interactions

### UI Tests
UI tests verify the visual and interactive aspects of components. These tests:

- Check component rendering with various states
- Verify user interactions (clicks, form submissions)
- Test responsive behavior
- Validate accessibility features

### User Experience Tests
UX tests simulate real user journeys through the application. These tests:

- Verify complete user flows (browse, add to cart, checkout)
- Test navigation between pages
- Validate error states and recovery
- Check loading states and performance

## Writing Tests

### Backend Tests
When writing backend tests:

1. Follow the AAA pattern (Arrange, Act, Assert)
2. Test both success and failure cases
3. Verify all validation rules
4. Test edge cases and error conditions
5. Clean up test data after each test

Example:
```javascript
it('should create a user with valid data', async () => {
  const userData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };

  const user = await User.create(userData);

  expect(user.id).toBeDefined();
  expect(user.name).toBe(userData.name);
  expect(user.email).toBe(userData.email);
});
```

### Frontend Tests
When writing frontend tests:

1. Use semantic queries (getByRole, getByLabelText)
2. Test user interactions, not implementation details
3. Verify component behavior with different props
4. Test loading and error states
5. Mock external dependencies appropriately

Example:
```javascript
it('renders product name correctly', () => {
  render(<ProductCard product={mockProduct} />);
  expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
});
```

## Test Coverage

Our goal is to maintain high test coverage across the application:

- Models: 90%+ coverage
- Controllers: 85%+ coverage
- Components: 80%+ coverage
- API endpoints: 95%+ coverage

## Continuous Integration

Tests are run automatically in the CI pipeline:

- Unit tests run on every commit
- Integration tests run on pull requests
- Coverage reports are generated for each build
- Tests must pass before merging

## Best Practices

- Write tests that are fast, isolated, and deterministic
- Use descriptive test names that explain the expected behavior
- Test behavior, not implementation details
- Keep tests independent of each other
- Regularly update tests when requirements change
- Maintain a good balance between test types