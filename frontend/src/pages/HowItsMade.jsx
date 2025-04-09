import React from 'react';
import { useTheme } from '../context/ThemeContext';
import schema from '../../public/assets/schema.jpg';
const HowItsMade = () => {
  const { theme, themeData, handleThemeChange } = useTheme();

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">How it's made</h1>
      <p>This page describes Voyagr's architecture.</p>
      <h2 className="text-2xl font-semibold mt-6">Front End</h2>
      <p>The React frontend uses React Router for routing, Tailwind for CSS utility classes, DaisyUI for prebuilt CSS components, and Vite for building the application. Nginx is deployed as a webserver to serve the static files built by Vite and a reverse proxy to expose my server to the internet.</p>
      <h3 className="text-xl font-semibold mt-4">Flexibile - Themes</h3> 
      <label className="flex cursor-pointer gap-2">
  <span className="label-text">Current</span>
  <input type="checkbox" value="dark" className="toggle theme-controller" />
  <span className="label-text">Dark</span>
</label>
  <div>
    <h4>Toggle the theme. Notice I have not implemented a theme responsive icon yet.</h4>
    
  </div>
      <h3 className="text-xl font-semibold mt-4">Flexible - Works on Mobile</h3>
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

    </div>
  );
}

export default HowItsMade;