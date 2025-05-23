# Voyagr
![Screenshot 2025-04-04 at 3 56 30 PM](https://github.com/user-attachments/assets/b5dfd581-bf28-412b-a0a0-330810c79e63)

Voyagr is a learning project and a tool I use to manage my day. Learn more about its [architecture here](https://voyagr.me/how-its-made) or give it a try [Voyagr](https://voyagr.me/). Fair warning that there is currently no onboarding and the app is an alpha that is not hardened for production use.

## What is Voyagr?
Voyagr is a habit tracker and self-management app that helps you discover and live your values. You can think of it as a cross between a habit tracker like [Habatica](https://habitica.com/) or [Finch](https://finchcare.com/) and a pomodoro timer like [Session](https://www.stayinsession.com/). Voyagr helps you define who you are and how you want to live by creating a process for value selection and habit definition. Habits in Voyagr can have fine-tuned requirements including time based requirements. Habits can also be configured to be scheduled or unscheduled and can be suggested as breaks after Pomodoro sessions.

## Learning objectives
- [x] Configure self-hosted production environment.
- [x] Build a CI/CD pipeline with testing and automatic deployments.
- [x] Build a flexible frontend with dark/light themes that looks good on desktop and mobile.
- [ ] Build a data-model that allows a simpler frontend (fewer conditionals and flags) because objects own their state and behavior.

## What features exist and are planned?
See [issues](https://github.com/Klaeser-Homelab/Voyagr/issues) for details.
- [x] Create and record values.
- [x] Manage your time using a pomodoro timer, stopwatch, and tasks.
- [ ] Visualize your progress using a habit tracker.  
- [ ] Gamify progress so it feels good to value your time.  
- [ ] Share your Voyagr with different levels of a support network. 
- [ ] Discover and share values and habits.
- [ ] Initiate habits and session from places smart home buttons.
- [ ] Voyagr API allows habit tracking to be recorded from self-management apps.
- [ ] The app's personality is configurable. Supportive, chiding, etc. This will be packaged as "Choose your guide".

## Inspiration
Many of us struggle at some point in our lives with the question of how we should spend our time. There is no generic answer but I think a good start is to discover your values, start living them, and take opportunities as they come. Another way of saying this is to find and keep your attention on what you decide matters most. Attention is difficult and Voyagr is built to help maintain it. Several books got me thinking along these lines and I wanted to mention them here. 
- [The Suble Art of not giving a f*ck - Manson](https://www.goodreads.com/book/show/28257707-the-subtle-art-of-not-giving-a-f-ck)
- [Atomic Habits - Clear](https://www.goodreads.com/book/show/40121378-atomic-habits?from_search=true&from_srp=true&qid=pTZ9qbuEcd&rank=1)
- [Four Thousand Weeks - Burkeman](https://www.goodreads.com/book/show/54785515-four-thousand-weeks?ref=nav_sb_ss_1_19)

## Building Voyagr
Follow these steps to build Voyagr locally. [How its made](https://voyagr.me/how-its-made) is a good place to build an understanding of the system.

### 1. .env
.env files must be configured in both the frontend and backend directories. See .env.backend.example and .env.frontend.example for guidance since actual .env files are not in source control for security. You'll need to get the values marked as secrets from Reed. Or if you are Reed, you'll need to track down the secrets.

### 2. Database
`docker compose -f docker-compose.dev.yml up -d` will run the docker-compose.dev.yml that includes the build information for the Docker instance. Once the database is built, login to PgAdmin and change the password from the default.

### 3. Backend
`npm run dev` in /backend starts backend on 3001.

### 4. Frontend
`npm run dev`  in /frontend starts frontend on 3000. 
