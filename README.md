# Journeyman

Journeyman is a habit forming self-management system that helps you manage your time by the minute and across a lifetime. Journeyman helps you identify values and habits you'd like to live by, focus your time using the pomodoro method, and visualize your progress. 

## Why use Journeyman?
Other self-management apps exist, why should you use Journeyman? If you are looking for a pomodoro app that strongly integrates with your desktop environment to block or trigger actions and is hands off about your goals and whether you achieve them then try [Session](https://www.stayinsession.com/). Journeyman on the other hand is deeply concerned with helping you achieve your goals through reminders, chiding, and habit tracking. If on the other hand you are only looking for a habit former and do not want to track your time or care for comprehensive habit tracking then try [Finch](https://finchcare.com/). Finch is only available as a phone app but is built around inclusivity and accessibility. Suceeding at a habit is a powerful way to start and end your day but checking your phone often derails these same habits. The long term vision for Journeyman is to extend the system beyond screens using simple and cheap devices with buttons and displays. 

## Mission
Why build Journeyman?
- Learning: My recent projects have relied on abstractions like full-stack web frameworks and cloud hosting. With Journeyman I want to strip back these abstractions which is why its built using separate frontend and backend frameworks and is self hosted on a micro pc plugged into my router. As a consequence of learning being my primary motivation, I will likely leave some features underdeveloped and others overdeveloped. For instance, UX may take a backseat to caching or observability both of which I'm looking to learn. If anyone else joins this project, I'd encourage them to follow this same logic and contribute what interests them rather than what is needed. This may duplicate work, for instance, deployments may need to be shifted from my proxmox server to a cloud provider in the future but that's a cost I'm willing to pay for learning.
- Fulfilling Lives: How should we spend our lives? And if we can answer that, how can we stay attentive to living according to that answer? These are difficult questions that most of us struggle with. Answering the first is equivalent in my mind to discovering your values and the opportunities that exist in your life to excercise those values. Journeyman cannot answer these questions for you but it can provide a framework for reflecting on them and putting them into action. I find such a tool personally compelling and that's enough for me to build it. If someone else finds it useful, even better.
- Market: [SensorTower](https://app.sensortower.com/overview/1528595748?country=US) estimates Finch has 700K monthly downloads and $2 million in monthly revenue. If Journeyman were well built perhaps people would pay for it.

## Getting started making contributions

### Frontend
`npm run dev`  in /frontend starts frontend on 3000. The frontend uses Vite as its development server, React Router for routing, Tailwind for CSS utility classes, and DaisyUI for prebuilt CSS components. Nginx is deployed as a webserver to serve the static files built by Vite's production build process.

### Database
The Postgres database used for development runs in a Docker instance within Docker desktop. A separate Postgres database is used in production. PgAdmin is deployed alongside the Postgres database to provide a web gui for interacting with the database.
`docker compose -f docker-compose.dev.yml up -d` will run the docker-compose.dev.yml that includes the build information for the Docker instance. Once the database is built, login to PgAdmin and change the password from the default.

### Backend
`npm run dev` in /backend starts backend on 3001. The backend will error if you have not built the Database or it is not currently running in Docker Desktop. The backend uses a Node.js web framework called Express. Sequalize is used as a Node.js Object-Relational Manager to interact with the database with types.

### Deployment
Journeyman is deployed to self-hosted docker containers running on Proxmox. The deployment is configured using GitHub Actions configured in `.github/workflows/deploy.yaml`.  Dockerfiles that build the layers of the containers and a docker-compose file that configures the services run in the container. Environment variables are configured in a .env file on the developer's machine and on the Proxmox build server that hydrates the environment variables for the containers that host the website.
