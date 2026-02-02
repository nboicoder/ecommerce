# Setting up Sanity CMS Credentials

This document explains how to obtain and configure your Sanity CMS credentials for the ecommerce project.

## Getting Your Sanity Project ID and Dataset Name

1. **Log in to Sanity Dashboard**
   - Go to [https://www.sanity.io/manage](https://www.sanity.io/manage)
   - Sign in with your Sanity account credentials

2. **Find Your Project**
   - On the dashboard, locate your project in the list
   - If you need to create a new project, click "Create new project"

3. **Get Your Project ID**
   - Click on your project to view its details
   - The Project ID is displayed in the project settings
   - It typically looks like a random string of letters and numbers (e.g., "abc123def456")

4. **Identify Your Dataset Name**
   - In the project settings, navigate to the "Datasets" section
   - Common dataset names are "production" or "development"
   - You can create additional datasets as needed

## Updating Environment Variables

### Local Development (.env.local)

Update your `.env.local` file with the actual values:

```bash
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_actual_project_id_here
NEXT_PUBLIC_SANITY_DATASET=your_actual_dataset_name_here
NEXT_PUBLIC_SANITY_API_VERSION=2022-03-07
```

## Creating API Tokens

1. **Navigate to API Settings**
   - In your Sanity project dashboard
   - Go to "Settings" → "API"

2. **Create a New Token**
   - Click "Add New Token"
   - Give your token a name (e.g., "frontend-app")
   - Select the appropriate permissions (typically "Read" for frontend applications)
   - Copy the generated token and store it securely

## Updating Kubernetes Secrets

When deploying to Kubernetes, you'll need to update the secrets with base64-encoded values:

1. **Encode your values in base64**:
   ```bash
   echo -n "your_project_id" | base64
   echo -n "your_dataset_name" | base64
   echo -n "your_api_token" | base64
   ```

2. **Update the secret manifest** with the encoded values:
   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: frontend-secrets
     namespace: ecommerce
   type: Opaque
   data:
     NEXT_PUBLIC_SANITY_PROJECT_ID: <base64_encoded_project_id>
     SANITY_API_READ_TOKEN: <base64_encoded_api_token>
   ```

## Testing Your Configuration

After updating your credentials:

1. Restart your development server
2. Check the browser console and terminal for any Sanity-related errors
3. Verify that content is loading correctly from Sanity

## Troubleshooting

- **"Dataset not found" error**: Double-check that your dataset name is spelled correctly and matches exactly what's in your Sanity project settings
- **"Project not found" error**: Verify that your project ID is correct and that you have access to this project
- **Permission errors**: Ensure your API token has the necessary permissions for the operations you're trying to perform