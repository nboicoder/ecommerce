#!/bin/bash

# Ecommerce Application Deployment Script

set -e

echo "Starting deployment of Ecommerce application..."

# Create namespace
echo "Creating namespace..."
kubectl apply -f k8s/01-namespace.yaml

# Apply database configuration
echo "Deploying database..."
kubectl apply -f k8s/02-database.yaml

# Apply frontend secrets
echo "Deploying frontend secrets..."
kubectl apply -f k8s/06-frontend-secrets.yaml

# Apply backend
echo "Deploying backend..."
kubectl apply -f k8s/03-backend.yaml

# Apply frontend
echo "Deploying frontend..."
kubectl apply -f k8s/04-frontend.yaml

# Apply ingress
echo "Deploying ingress..."
kubectl apply -f k8s/05-ingress.yaml

echo "Deployment completed successfully!"
echo ""
echo "Services deployed:"
echo "- Frontend: frontend-service on port 3000"
echo "- Backend: backend-service on port 5000"
echo "- Database: postgres-service on port 5432"
echo ""
echo "To check the status of your deployment, run:"
echo "kubectl get pods -n ecommerce"
echo "kubectl get services -n ecommerce"