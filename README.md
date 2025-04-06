# Voyagr
![Screenshot 2025-04-05 at 6 03 37 PM](https://github.com/user-attachments/assets/147372c9-0f3e-4530-bfa5-34f29df3cc58)


Discover and live your values. 

### Where does Voyagr fit?
Voyagr is a self-definition and self-management app. Self-definition means that Voyagr helps you define who you are and how you want to live. It does this by creating a process for value selection and a community for sharing values. Self-definition alone is a powerful concept and I considered limiting Voyagr's scope to just that. However, there is so much to be gained by going one step further and applying a vision of self-defintion to a process of self-management that I think this extra step is a must. Great self-management apps exist ( [Session](https://www.stayinsession.com/) ), so do habit forming apps ( [Finch](https://finchcare.com/) ) but I think they miss out on this powerful combination of self-definition and self-management.

## What features exist and are planned?
See issues for details
- [x] Create and record values  
- [x] Manage your time using a pomodoro timer, stopwatch, and tasks  
- [ ] Visualize your progress using a habit tracker  
- [ ] Gamify progress so it feels good to value your time  
- [ ] Share your Voyagr with different levels of a support network  
- [ ] Discover and share values and habits
- [ ] Initiate habits and session from places smart home buttons
- [ ] Voyagr API allows habit tracking to be recorded from self-management apps
- [ ] The app's personality is configurable. Supportive, chiding, etc. This will be packaged as "Choose your guide"

## Using Voyagr
Right now I use Voyagr on my network at home. ~Two~ One issue~s~ must be completed before others can use Voyagr. 
- [x] [Create Login](https://github.com/Klaeser-Homelab/Voyagr/issues/27)
- [ ] [Configure external access](https://github.com/Klaeser-Homelab/Voyagr/issues/29) - server:port where I host Voyagr must be opened up to the wider internet

Here's what you'll see when you get in

![Screenshot 2025-04-04 at 3 56 30 PM](https://github.com/user-attachments/assets/b5dfd581-bf28-412b-a0a0-330810c79e63)

## Product

### Mission - Why build Voyagr?
- Learning: My recent projects have relied on abstractions like full-stack web frameworks and cloud hosting. With Voyagr I want to strip back these abstractions which is why its built using separate frontend and backend frameworks and is self hosted on a micro pc plugged into my router. As a consequence of learning being my primary motivation, I will likely leave some features underdeveloped and others overdeveloped. For instance, UX may take a backseat to caching or observability both of which I'm looking to learn. If anyone else joins this project (you know who you are), I'd encourage them to follow this same logic and contribute what interests them rather than what is needed. This may duplicate work, for instance, deployments may need to be shifted from my proxmox server to a cloud provider in the future but that's a cost I'm willing to pay for learning.
- Fulfilling Lives: Most of us struggle at some point in our lives with the question of how we should spend our time? There is no generic answer but I think a good start is to discover your values, start living them, and take opportunities as they come. Another way of saying this is to find and keep your attention on what matters. If Voyagr could help me on that, well, Voyagr that would be very personally compelling and that's enough for me to build it. If someone else finds it useful, even better.

### How many people want this kind of thing?
- [SensorTower](https://app.sensortower.com/overview/1528595748?country=US) estimates Finch has 700K monthly downloads and $2 million in monthly revenue. Perhaps there are people out there who would use Voyagr. I'm not sure.

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
