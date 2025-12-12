# StyleX

StyleX is a Vite + React experience that pairs a simple Node server with a pollinations.ai backend to draft styling briefs and surface shoppable outfit suggestions.

## Prerequisites
- **Node.js** (v18 or newer recommended) which includes `npm`.
- A terminal with internet access (required for installing dependencies and calling the pollinations API).

## Run locally from scratch
Assuming nothing is installed yet:
1. Install Node.js from [nodejs.org](https://nodejs.org/) (or via a version manager like `nvm`).
2. Clone the repository:
   ```bash
   git clone <repo-url>
   cd StyleX
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the local API server (terminal #1):
   ```bash
   npm run server
   ```
5. Start the Vite dev server (terminal #2):
   ```bash
   npm run dev
   ```
6. Open the printed local URL (typically `http://localhost:5173/`) to use the app.

## Other runnable scripts
- **Build for production**
  ```bash
  npm run build
  ```
- **Preview the production build locally**
  ```bash
  npm run preview
  ```
- **Lint the codebase**
  ```bash
  npm run lint
  ```

## Contribution
Jasroop Dhingra is responsible for all files in this repository.
