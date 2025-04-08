import React from 'react';

const HowItsMade = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">How It's Made</h1>
      <p>This page explains how our application is built and the technologies used.</p>

      <h2 className="text-2xl font-semibold mt-6">Architecture</h2>
      <p>Details about the overall architecture of the application.</p>

      <h2 className="text-2xl font-semibold mt-6">Deployment</h2>
      <h3 className="text-xl font-semibold mt-4">Docker</h3>
      <p>Information on how Docker is used for containerization and deployment.</p>
      <h3 className="text-xl font-semibold mt-4">Environment Variables and Secrets</h3>
      <p>Explanation of how environment variables and secrets are managed.</p>
      <h3 className="text-xl font-semibold mt-4">Backups</h3>
      <p>Details on the backup strategies implemented for data safety.</p>

      <h2 className="text-2xl font-semibold mt-6">Front End</h2>
      <h3 className="text-xl font-semibold mt-4">Themes</h3>
      <p>Overview of the theming system and customization options.</p>
      <h3 className="text-xl font-semibold mt-4">Flex - Works on Mobile</h3>
      <p>Explanation of how the application is designed to be responsive and mobile-friendly.</p>

      <h2 className="text-2xl font-semibold mt-6">Backend</h2>
      <p>Information about the backend technologies and architecture.</p>

      <h2 className="text-2xl font-semibold mt-6">Data Model</h2>
      <p>Details on the data model and how data is structured within the application.</p>
    </div>
  );
}

export default HowItsMade;