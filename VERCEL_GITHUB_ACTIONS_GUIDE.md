# Complete Vercel & GitHub Actions CI/CD Deployment Guide

This guide provides a comprehensive, step-by-step walkthrough of how to set up an automated CI/CD pipeline that builds and deploys your Next.js application to Vercel using GitHub Actions.

> [!TIP]
> **Why use GitHub Actions instead of the native Vercel integration?**
> * **Bypasses Free Plan Restrictions:** On Vercel's Hobby (Free) plan, Vercel only deploys commits pushed by the account owner. Using GitHub Actions allows **any collaborator's commits or pull requests** to build and deploy successfully!
> * **Separated Accounts:** The GitHub repository owner and Vercel project owner can be completely different people (perfect for freelance work).

---

## Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Step 1: Link the Project Locally](#step-1-link-the-project-locally)
3. [Step 2: Gather Vercel Credentials](#step-2-gather-vercel-credentials)
4. [Step 3: Save GitHub Secrets](#step-3-save-github-secrets)
5. [Step 4: Create the Workflow File](#step-4-create-the-workflow-file)
6. [Step 5: The Crucial Next.js & Firebase Environment Variables Fix](#step-5-the-crucial-nextjs--firebase-environment-variables-fix)
7. [Step 6: Triggering Your First Deployment](#step-6-triggering-your-first-deployment)

---

## 1. Prerequisites
Before starting, ensure you have:
* A GitHub repository containing your project.
* A Vercel account.
* Vercel CLI installed on your machine (`npm install --global vercel`).

---

## Step 1: Link the Project Locally
To authorize your local repository with Vercel and generate the required Project configuration:

1. Open your terminal in the project root directory.
2. Run the following command:
   ```bash
   npx vercel link
   ```
3. Follow the interactive prompts:
   * **Set up and deploy?** Yes.
   * **Which scope?** Select your personal/team account.
   * **Link to existing project?** Yes (if already created on Vercel) or No (to create a new one).
   * **Detected a repository. Connect it to this project?** **NO**. 
     > [!IMPORTANT]
     > Select **`no`** when prompted to connect the repository. This prevents Vercel from triggering duplicate builds alongside your GitHub Action.

Once complete, Vercel will create a hidden directory `.vercel/` containing `project.json`.

---

## Step 2: Gather Vercel Credentials
To allow GitHub Actions to securely communicate with Vercel, you need three credentials:

1. **Vercel Org ID & Project ID:**
   Open the `.vercel/project.json` file generated in the previous step. It will look like this:
   ```json
   {
     "orgId": "your_org_id_here",
     "projectId": "your_project_id_here"
   }
   ```
   * Record the value of `orgId` (maps to `VERCEL_ORG_ID`).
   * Record the value of `projectId` (maps to `VERCEL_PROJECT_ID`).

2. **Vercel Access Token:**
   * Go to your [Vercel Dashboard](https://vercel.com).
   * Navigate to **Account Settings** -> **Tokens**.
   * Click **Create** to generate a new Personal Access Token. Give it a descriptive name (e.g., `GitHub Actions Deploy Token`).
   * Copy the generated token immediately (maps to `VERCEL_TOKEN`).

---

## Step 3: Save GitHub Secrets
To store your credentials securely inside your GitHub repository:

1. Go to your repository page on GitHub.
2. Navigate to **Settings** (top navigation bar) -> **Secrets and variables** (left sidebar) -> **Actions**.
3. Under the **Repository secrets** tab, click **New repository secret** to add the following three secrets:

| Secret Name | Value | Description |
| :--- | :--- | :--- |
| `VERCEL_TOKEN` | *(Your Vercel Access Token)* | Authorizes GitHub to log in to Vercel |
| `VERCEL_ORG_ID` | `orgId` from `project.json` | Identifies your Vercel organization/scope |
| `VERCEL_PROJECT_ID` | `projectId` from `project.json` | Identifies the specific target project |

---

## Step 4: Create the Workflow File
Create a new file in your repository at the following path:
`.github/workflows/deploy.yml`

Paste the following production-grade configuration into the file:

```yaml
name: Vercel Deployment

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true # Resolves Node.js 20 deprecation warnings

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      # --- PREVIEW ENVIRONMENT DEPLOYMENT (PULL REQUESTS) ---
      - name: Pull Vercel Environment Information (Preview)
        if: github.ref != 'refs/heads/main'
        run: |
          vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
          cp .vercel/.env.preview.local .env.production.local

      # --- PRODUCTION ENVIRONMENT DEPLOYMENT (MERGES/PUSHES TO MAIN) ---
      - name: Pull Vercel Environment Information (Production)
        if: github.ref == 'refs/heads/main'
        run: |
          vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
          cp .vercel/.env.production.local .env.production.local

      # --- BUILD STEP ---
      - name: Build Project Artifacts (Preview)
        if: github.ref != 'refs/heads/main'
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project Artifacts (Production)
        if: github.ref == 'refs/heads/main'
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      # --- DEPLOY STEP ---
      - name: Deploy Project Artifacts to Vercel (Preview)
        if: github.ref != 'refs/heads/main'
        run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy Project Artifacts to Vercel (Production)
        if: github.ref == 'refs/heads/main'
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## Step 5: The Crucial Next.js & Firebase Environment Variables Fix
Next.js compiles and prerenders static pages at build time. During `next build` inside the GitHub Actions runner, the compiler requires active client-side keys (like `NEXT_PUBLIC_FIREBASE_API_KEY`) or the build will crash.

To ensure this works perfectly, we implemented two key solutions in this workflow:

### A. Add Environment Variables as Non-Sensitive
By default, Vercel hides sensitive variables in local pulls. Since client-side keys are compiled into your public browser bundle anyway, add them on Vercel as **`Plain` (non-sensitive)** so the runner can pull them.

Run this command in your local terminal for all your variables using the `--no-sensitive` flag:
```bash
# Example for the Firebase API Key
npx vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production --value "your_key" --yes --force --no-sensitive
npx vercel env add NEXT_PUBLIC_FIREBASE_API_KEY preview "" --value "your_key" --yes --force --no-sensitive
```

### B. The File Copy Step (`cp`)
Vercel pulls your variables into a hidden directory (`.vercel/.env.production.local`). However, Next.js's compiler does not look inside this folder. 

Our workflow automatically runs:
```bash
cp .vercel/.env.production.local .env.production.local
```
This moves the pulled environment variables directly to the root of your project, making Next.js detect them natively and ensuring successful compilation!

---

## Step 6: Triggering Your First Deployment
Once the workflow file is saved:

1. Commit and push the updated workflow file to GitHub:
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "ci: add vercel github actions deployment pipeline"
   git push origin main
   ```
2. Navigate to the **Actions** tab on your GitHub repository.
3. You will see a new run starting immediately. Once the runner completes, your application is officially live! 🎉
