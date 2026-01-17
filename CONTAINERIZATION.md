# Ecommerce Application - Containerized Deployment

This document describes how to containerize and deploy the Ecommerce application using Docker and Kubernetes.

## Prerequisites

- Docker and Docker Compose
- Kubernetes cluster (Minikube, Kind, or cloud provider)
- kubectl

## Local Development with Docker Compose

### Starting the Application

```bash
# Navigate to the project directory
cd ecommerce

# Start the application in development mode
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Stopping the Application

```bash
docker-compose down
```

## Production Deployment with Kubernetes

### Preparing for Deployment

1. Build the Docker images:
```bash
# Build frontend image
docker build -t ecommerce-frontend:latest .

# Build backend image
cd backend
docker build -t ecommerce-backend:latest .
cd ..
```

2. If using a remote Kubernetes cluster, push the images to a container registry:
```bash
# Tag and push images to your registry
docker tag ecommerce-frontend:latest your-registry/ecommerce-frontend:latest
docker tag ecommerce-backend:latest your-registry/ecommerce-backend:latest
docker push your-registry/ecommerce-frontend:latest
docker push your-registry/ecommerce-backend:latest
```

### Deploying to Kubernetes

```bash
# Run the deployment script
./deploy.sh
```

Or apply the manifests individually:

```bash
# Create namespace
kubectl apply -f k8s/01-namespace.yaml

# Deploy database
kubectl apply -f k8s/02-database.yaml

# Deploy frontend secrets
kubectl apply -f k8s/06-frontend-secrets.yaml

# Deploy backend
kubectl apply -f k8s/03-backend.yaml

# Deploy frontend
kubectl apply -f k8s/04-frontend.yaml

# Deploy ingress
kubectl apply -f k8s/05-ingress.yaml
```

### Checking Deployment Status

```bash
# Check pods
kubectl get pods -n ecommerce

# Check services
kubectl get services -n ecommerce

# Check ingress
kubectl get ingress -n ecommerce
```

### Accessing the Application

After deployment, the application will be accessible based on your ingress configuration. If using Minikube:

```bash
# Get the ingress IP
minikube ip

# Or tunnel the ingress service
minikube tunnel
```

## Configuration

### Environment Variables

The application uses the following environment variables:

#### Frontend
- `NEXT_PUBLIC_API_BASE_URL`: Backend API URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key
- `CLERK_SECRET_KEY`: Clerk secret key
- `DATABASE_URL`: Database connection string
- `NEXT_PUBLIC_SANITY_PROJECT_ID`: Sanity project ID
- `SANITY_API_READ_TOKEN`: Sanity API read token

#### Backend
- `NODE_ENV`: Environment (development/production)
- `DB_HOST`: Database host
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `DB_PORT`: Database port
- `JWT_SECRET`: JWT secret key
- `PORT`: Port to run the server on

### Secrets Management

Secrets are stored in Kubernetes Secrets and mounted as environment variables. Update the secret manifests with your actual values before deployment.

## Scaling

To scale the frontend or backend deployments:

```bash
# Scale frontend
kubectl scale deployment frontend --replicas=3 -n ecommerce

# Scale backend
kubectl scale deployment backend --replicas=3 -n ecommerce
```

## Updating Application

To update the application:

1. Build new Docker images with updated code
2. Update the deployment manifests with new image tags
3. Apply the updated manifests:
```bash
kubectl apply -f k8s/03-backend.yaml
kubectl apply -f k8s/04-frontend.yaml
```

## Troubleshooting

### Check Pod Logs
```bash
kubectl logs -f deployment/backend -n ecommerce
kubectl logs -f deployment/frontend -n ecommerce
```

### Debug Connection Issues
```bash
# Exec into a pod
kubectl exec -it deployment/backend -n ecommerce -- sh

# Check environment variables
kubectl exec deployment/backend -n ecommerce -- env
```

## Cleanup

To remove all deployed resources:

```bash
kubectl delete namespace ecommerce
```