# Voyagr
[![Watch the video](https://github.com/user-attachments/assets/7280a745-699d-4398-be9b-150fc6afdcd3)](https://youtu.be/bW34WQVk7L8)

### [Watch this video on YouTube](https://youtu.be/bW34WQVk7L8)

Voyagr is a learning project and a tool I use to manage my day. Give it a try [Voyagr](https://voyagr.me/).

### Grade
3/10 - See Substack post for details

## What is Voyagr?
Voyagr is a habit tracker and self-management app that helps you live your values. You can think of it as a cross between a habit tracker like [Habatica](https://habitica.com/) or [Finch](https://finchcare.com/) and a pomodoro timer like [Session](https://www.stayinsession.com/). Habits can be configured to be scheduled or unscheduled and can be suggested as breaks after Pomodoro sessions.

## Learning objectives
- [x] Build a responsive frontend and package it into a desktop app
- [x] Set up 0Auth authentication
- [x] Configure self-hosted production environment.
- [x] Build a CI/CD pipeline with testing and automatic deployments.
- [x] Build a flexible frontend with dark/light themes that looks good on desktop and mobile.

## Features
See [issues](https://github.com/Klaeser-Homelab/Voyagr/issues) for details.
- [x] Create and record values.
- [x] Manage your time using a pomodoro timer, stopwatch, and tasks.
- [x] Visualize your progress using a habit tracker.  
- [x] Gamify progress so it feels good to value your time.  
- [ ] Share progress with friends. 
- [ ] Discover and share values and habits.
- [ ] Initiate habits and session from places smart home buttons.

## Why
Voyagr is about keeping your attention on what you decide matters most to you. These are some books along the same lines. 
- [The Suble Art of not giving a f*ck - Manson](https://www.goodreads.com/book/show/28257707-the-subtle-art-of-not-giving-a-f-ck)
- [Atomic Habits - Clear](https://www.goodreads.com/book/show/40121378-atomic-habits?from_search=true&from_srp=true&qid=pTZ9qbuEcd&rank=1)
- [Four Thousand Weeks - Burkeman](https://www.goodreads.com/book/show/54785515-four-thousand-weeks?ref=nav_sb_ss_1_19)

### 1. .env
.env files must be configured in both the frontend and backend directories. See .env.backend.example and .env.frontend.example for guidance since actual .env files are not in source control for security. You'll need to get the values marked as secrets from Reed. Or if you are Reed, you'll need to track down the secrets.

### 2. Database
`docker compose -f docker-compose.dev.yml up -d` will run the docker-compose.dev.yml that includes the build information for the Docker instance. Once the database is built, login to PgAdmin and change the password from the default.

### 3. Backend
`npm run dev` in /backend starts backend on 3001.

### 4. Frontend
`npm run dev`  in /frontend starts frontend on 3000. 
