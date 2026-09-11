# Nebula Commerce

System Role: Strict Senior React Architect. Task: Build the complete UI for a high-end, dark-themed e-commerce platform. Stack: React (Vite), Tailwind CSS, Lucide-React.

CRITICAL RULES FOR LLM:

Write 100% COMPLETE code for every file. DO NOT use placeholders like // add code here.

Use strict Tailwind classes for a premium dark mode (bg-slate-950, text-slate-50, glassmorphism backdrop-blur-md bg-slate-900/50).

Create components step-by-step.

Build the following exact file structure:

Step 1: src/components/Navbar.jsx Create a sticky top navbar. Left: Logo text. Right: A cart icon (Lucide) with a simple badge (e.g., '3'). Use glassmorphism background.

Step 2: src/components/Hero.jsx Create a hero section (min-h-[80vh]). Center text: "Next-Gen Electronics". Below it, a large div (w-full max-w-4xl h-96 bg-slate-900 rounded-2xl border border-slate-800 animate-pulse) to act as a placeholder for our future cinematic video.

Step 3: src/components/ProductCard.jsx Create a card component. Dark background (bg-slate-900), border (border-slate-800). Include a div for the product image, a title, a price tag ($), and an 'Add to Cart' button with hover effects (hover:bg-blue-600).

Step 4: src/components/ProductGrid.jsx Create a responsive grid (grid-cols-1 md:grid-cols-3 lg:grid-cols-4). Map out 8 dummy products using the ProductCard component.

Step 5: src/App.jsx Import and stack Navbar, Hero, and ProductGrid inside a main container (bg-slate-950 min-h-screen text-white font-sans).

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/98be99f0-4789-4cea-9dfb-ff6b5b1a6952).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
