import React from 'react';
import { useTheme } from '../context/ThemeContext';
import schema from '../assets/schema.jpg';
import Header from '../components/Header';

const HowItsMade = () => {
  const { theme, themeData, handleThemeChange } = useTheme();

  return (
    <div>
      <Header />
    
    <div className="p-4 m-20">
      <h1 className="text-3xl font-bold mb-4">How it's made</h1>
      <p>This page describes Voyagr's architecture.</p>
      <h2 className="text-2xl font-semibold mt-6">Front End</h2>
      <p>The React frontend uses React Router for routing, Tailwind for CSS utility classes, DaisyUI for prebuilt CSS components, and Vite for building the application. Nginx is deployed as a webserver to serve the static files built by Vite and a reverse proxy to expose my server to the internet.</p>
      <h3 className="text-xl font-semibold mt-4">Themes</h3> 
      <label className="flex cursor-pointer gap-2">
  <span className="label-text">Current</span>
  <input type="checkbox" value="dark" className="toggle theme-controller" />
  <span className="label-text">Dark</span>
</label>
  <div>
    <h4>Even with DaisyUI themes implementing vastly different themes (light mode) is a lot of work and I don't have any plans to do that anytime soon.</h4>
    
  </div>
      <h3 className="text-xl font-semibold mt-4">Responsive</h3>
      <p>Works just as well on mobile. Use dev tools to see for yourself. Steps: <kbd className="kbd">Right click</kbd> - <kbd className="kbd">Inspect</kbd> - <kbd className="kbd">toggle device toolbar</kbd> - <kbd className="kbd">Dimension tool</kbd> - <kbd className="kbd">switch to iPhone view</kbd>.</p>

      <h2 className="text-2xl font-semibold mt-6">Backend</h2>
      <p>The backend uses a Node.js web framework called Express. Sequalize is used as a Node.js Object-Relational Manager for type safe database interactions.</p>

      <h2 className="text-2xl font-semibold mt-6">Data</h2>
      <p>Postgres is used to store persistent data. PgAdmin is deployed alongside the Postgres database to provide a web gui for interacting with the database. 
        The following diagram shows the data model. Reed, if you need to update this image, it was exported from PgAdmin using <a href="https://www.pgadmin.org/docs/pgadmin4/9.0/erd_tool.html#">the ERD tool</a>.
        Items are a generic type that belong to users. Values, habits, events, and todos are all items.
        </p>
      <img src={schema} alt="Data Model" className="mt-6" />

      <h2 className="text-2xl font-semibold mt-6">Deployment</h2>
      <h3 className="text-xl font-semibold mt-4">Hardware</h3>
      <p>Voyagr is deployed to a micro-pc plugged into my home network. The micro-pc runs Proxmox which contain an lxc container where the docker containers running Voyagr live.
      </p>
      <h3 className="text-xl font-semibold mt-4">Docker</h3>
      <p> 
        An update to the main branch of my GitHub repository triggers a GitHub Action. A GitHub Runner, in a separate lxc container on the same Proxmox host pulls the deployment job and runs <kbd className="kbd">deploy.yaml</kbd>.  
        This file builds the frontend and backend images using the instructions in <kbd className="kbd">Dockerfiles</kbd>. Next it uses <kbd className="kbd">docker-compose.prod.yml</kbd> to configure the docker containers to run these images as well as the postgres and pgadmin containers. 
        Containers that are unchanged are not rebuilt. Postgres is the only stateful container and relies on volumes to persist data in the case of a failure or rebuild. Volumes are backed up daily using a cron job.
      </p>
      <h3 className="text-xl font-semibold mt-4">Environment Variables and Secrets</h3>
      <p>Environment variables are hardcoded in <kbd className="kbd">deploy.yaml</kbd>. Vite requires the environment variables to be passed in at buildtime. The frontend contains no secrets so this isn't a security issue. Secrets used by the backend are hosted by GitHub Secrets and passed in as variables to the <kbd className="kbd">deploy.yaml</kbd> and onto the container runtime from there.</p>
    <h2 className="text-xl font-semibold mt-4">Challenges</h2>
    <p>
      Unclear requirement - todos: I didn't intend for Voyagr to be todo app but I wanted a way to support a user thinking through what they needed to accomplish in an active session. 
      This could have been done with a free form text body but I found that unstructured when I used Session so I introduced todos. With any todo feature you can create todos ahead of time and work on them later so that is what I created. 
      Todos could be created in values or habits and were pulled into the active session.
      This confused the data model because the parents of todos could either be a value, a habit, or an event. 
      I could have made it work but instead I took a step back and decided that todos cannot be created ahead of time.
      With that decision, I get the actual value I set out to get, adding structure to the event and don't take on the complexity of a todo app.
      Environment variables: At first, I didn't think to provide environment variables as part of the docker container. Instead I manually added them to the environment of the container. Just like the old days, this was a pain to debug because I had to log on to servers.
      So I decided to manage the environment variables in code. Unfortunately, I hadn't yet disambiguated the <kbd className="kbd">deploy.yaml</kbd> from the <kbd className="kbd">Dockerfiles</kbd> or the <kbd className="kbd">docker-compose.prod.yml</kbd> so my original attempt was a shot in the dark.
      Eventually I took the time and understood the docker deployment workflow. I also made my repo public which enabled me to use GitHub hosted Environment Variables and Secrets. I admittedly, committed some secrets in code along the way but I've since changed them.
      I'm very happy with the result as environment variables are now easily debugged.
      Too much flexibility too early: Events can be initiated from either values or habits. This is so that a user doesn't have to have a specific habit that represents everything they do for that value.
      I though this flexibility was a nice feature but I would rather have built a simpler solution first and then adjusted it. Something I don't understand is whether the incremental approach that works so well for the frontend extends to the data model.
    </p>
    </div>
    </div>
  );
}

export default HowItsMade;