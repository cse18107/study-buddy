# Deployment Guide for Frontend App

This guide explains how to deploy the frontend application to Vercel and connect it to your backend.

## Prerequisites

- A [Vercel](https://vercel.com/) account.
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket).
- The deployed backend URL: `https://study-buddy-backend-22tp.onrender.com/`

## Deployment Steps

1.  **Import Project to Vercel**:
    - Go to your Vercel dashboard.
    - Click "Add New..." -> "Project".
    - Import your Git repository containing the `frontend-app`.

2.  **Configure Project**:
    - **Framework Preset**: Vercel should automatically detect **Next.js**.
    - **Root Directory**: Ensure this is set to `frontend-app` if your repo has multiple folders. If the repo *is* the `frontend-app` folder, leave it as `./`.

3.  **Environment Variables**:
    - Expand the **Environment Variables** section.
    - Add the following variable:
        - **Key**: `NEXT_PUBLIC_API_URL`
        - **Value**: `https://study-buddy-backend-22tp.onrender.com`
    - Click "Add".

4.  **Deploy**:
    - Click the **Deploy** button.
    - Wait for the build and deployment to complete.

## Local Development

For local development, the application uses the `.env.local` file (if present) or falls back to `http://localhost:8000`.
You can create a `.env.local` file in the root of `frontend-app` with:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Troubleshooting

- **CORS Issues**: Ensure your backend allows requests from your Vercel domain.
- **Build Errors**: Check the build logs in Vercel for any TypeScript or ESLint errors.
