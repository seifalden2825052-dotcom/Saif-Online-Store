---
name: GitHub/Vercel source alignment
description: Deployment-source alignment for the storefront's external Vercel project
---

Vercel deploys the repository and branch configured in its project, not the current Replit workspace. The GitHub repository must contain the current storefront tree and root deployment configuration before a Vercel redeploy can reflect Replit changes.

**Why:** The external repository had an older Lovable app while the Replit workspace contained AUREN, which caused Vercel to select the wrong framework and serve a project-level 404.

**How to apply:** When Vercel shows Lovable/TanStack detection or a project-level 404, compare the connected GitHub repository's root files and latest commit with the Replit workspace before changing app code.