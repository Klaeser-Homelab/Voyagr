# Voyagr
![Screenshot 2025-04-05 at 6 03 37 PM](https://github.com/user-attachments/assets/147372c9-0f3e-4530-bfa5-34f29df3cc58)

Voyagr is a learning project and a tool I use to manage my day. You can give [Voyagr](https://voyagr.me/) a try as well, though there is currently no onboarding and the app is an alpha that is not hardened for production use.

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

Here's what you'll see when you get in

![Screenshot 2025-04-04 at 3 56 30 PM](https://github.com/user-attachments/assets/b5dfd581-bf28-412b-a0a0-330810c79e63)

## Inspiration
Many of us struggle at some point in our lives with the question of how we should spend our time. There is no generic answer but I think a good start is to discover your values, start living them, and take opportunities as they come. Another way of saying this is to find and keep your attention on what you decide matters most. Attention is difficult and Voyagr is built to help maintain it. Several books got me thinking along these lines and I wanted to mention them here. 
- [The Suble Art of not giving a f*ck - Manson](https://www.goodreads.com/book/show/28257707-the-subtle-art-of-not-giving-a-f-ck)
- [Atomic Habits - Clear](https://www.goodreads.com/book/show/40121378-atomic-habits?from_search=true&from_srp=true&qid=pTZ9qbuEcd&rank=1)
- [Four Thousand Weeks - Burkeman](https://www.goodreads.com/book/show/54785515-four-thousand-weeks?ref=nav_sb_ss_1_19)

## Building Voyagr

### Frontend
`npm run dev`  in /frontend starts frontend on 3000. The frontend uses Vite as its development server, React Router for routing, Tailwind for CSS utility classes, and DaisyUI for prebuilt CSS components. Nginx is deployed as a webserver to serve the static files built by Vite's production build process.

### Database
The Postgres database used for development runs in a Docker instance within Docker desktop. A separate Postgres database is used in production. PgAdmin is deployed alongside the Postgres database to provide a web gui for interacting with the database.
`docker compose -f docker-compose.dev.yml up -d` will run the docker-compose.dev.yml that includes the build information for the Docker instance. Once the database is built, login to PgAdmin and change the password from the default.

### Backend
`npm run dev` in /backend starts backend on 3001. The backend will error if you have not built the Database or it is not currently running in Docker Desktop. The backend uses a Node.js web framework called Express. Sequalize is used as a Node.js Object-Relational Manager to interact with the database with types.

### Deployment
Voyagr is deployed to self-hosted docker containers running on Proxmox. The deployment is configured using GitHub Actions configured in `.github/workflows/deploy.yaml`.  Dockerfiles that build the layers of the containers and a docker-compose file that configures the services run in the container. Environment variables are configured in a .env file on the developer's machine and on the Proxmox build server that hydrates the environment variables for the containers that host the website.
