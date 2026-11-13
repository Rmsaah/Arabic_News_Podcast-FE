# 3ulum Al-Yawm — Frontend

Angular web application for **3ulum Al-Yawm**, an Arabic news podcast platform that presents AI-generated news episodes in the Najdi dialect.

## Project suite

- **Frontend (this repository):** browsing, playback, authentication, and user profiles
- [Backend](https://github.com/Rmsaah/Arabic_News_Podcast-BE): Spring Boot REST API and persistence
- [AI and TTS agent](https://github.com/madaweehath/tts-agent-project): news processing and audio generation

## Features

- Responsive Arabic podcast experience
- Daily and paginated episode listings
- Episode search by title and category
- Audio player with expanded playback controls
- Registration and login
- Protected user profile
- Listening progress, history, and statistics
- Episode ratings

## Technology

- Angular 20
- TypeScript 5.9
- Bootstrap 5 and Bootstrap Icons
- RxJS
- Karma and Jasmine
- Nginx for the production container

## Getting started

### Prerequisites

- Node.js 22 LTS
- npm
- The [backend API](https://github.com/Rmsaah/Arabic_News_Podcast-BE), running by default at `http://localhost:8283`

### 1. Clone and install

```bash
git clone https://github.com/Rmsaah/Arabic_News_Podcast-FE.git
cd Arabic_News_Podcast-FE
npm install
```

### 2. Run locally

```bash
npm start
```

Open `http://localhost:4200`. The development configuration uses `http://localhost:8283/api` as the default API URL.

## Available scripts

```bash
npm start        # Start the development server
npm run build    # Create a production build
npm run watch    # Rebuild when source files change
npm test         # Run the Karma/Jasmine test suite
```

Production output is written under `dist/ArabicNewsPodcast-FE/browser`.

## API configuration

The application reads the backend base URL from `window.__env.API_URL`. If the URL has no path, `/api` is appended automatically.

For local development, change the fallback in:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

The Docker image generates `env.js` at startup, so a deployed image can be configured without rebuilding it.

## Docker

```bash
docker build -t 3ulum-alyawm-frontend .
docker run --rm -p 4354:4354 \
  -e API_URL=http://localhost:8283/api \
  3ulum-alyawm-frontend
```

Open `http://localhost:4354`.

> When the browser, frontend container, and backend run on different hosts, set `API_URL` to an address reachable by the browser and add the frontend origin to the backend's `ALLOWED_ORIGINS`.

## Application routes

- `/` — home and daily episodes
- `/episodes` — episode browser and search
- `/profile` — authenticated user profile

Unknown routes redirect to the home page.
