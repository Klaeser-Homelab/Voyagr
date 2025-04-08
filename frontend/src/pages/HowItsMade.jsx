import React from 'react';

const HowItsMade = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">How It's Made</h1>
      <p>This page explains how our application is built and the technologies used.</p>
      <h2 className="text-2xl font-semibold mt-6">Front End</h2>
      <h3 className="text-xl font-semibold mt-4">Themes</h3>
      <p>The React frontend uses React Router for routing, Tailwind for CSS utility classes, DaisyUI for prebuilt CSS components, and Vite for building the application. Nginx is deployed as a webserver to serve the static files built by Vite and a reverse proxy to expose my server to the internet.</p>
      <h3 className="text-xl font-semibold mt-4">Flex - Works on Mobile</h3>
      <p>Explanation of how the application is designed to be responsive and mobile-friendly.</p>

      <h2 className="text-2xl font-semibold mt-6">Backend</h2>
      <p>The backend uses a Node.js web framework called Express. Sequalize is used as a Node.js Object-Relational Manager to interact with the database with types..</p>

      <h2 className="text-2xl font-semibold mt-6">Data</h2>
      <p>The Postgres database used for development runs in a Docker instance within Docker desktop. A separate Postgres database is used in production. PgAdmin is deployed alongside the Postgres database to provide a web gui for interacting with the database..</p>

      <h2 className="text-2xl font-semibold mt-6">Deployment</h2>
      <h3 className="text-xl font-semibold mt-4">Docker</h3>
      <p>Information on how Docker is used for containerization and deployment. ### Deployment
      Voyagr is deployed to self-hosted docker containers running on Proxmox. The deployment is configured using GitHub Actions configured in `.github/workflows/deploy.yaml`.  Dockerfiles that build the layers of the containers and a docker-compose file that configures the services run in the container. Environment variables are created in deploy.yaml and passed to the buildtime for the frontend and runtime for the backend. For development, </p>
      <h3 className="text-xl font-semibold mt-4">Environment Variables and Secrets</h3>
      <p>Explanation of how environment variables and secrets are managed.</p>
      <h3 className="text-xl font-semibold mt-4">Backups</h3>
      <p>Details on the backup strategies implemented for data safety.</p>

    </div>
  );
}

export default HowItsMade;