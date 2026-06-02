import React from 'react';
import UploadCTA from './UploadCTA';
import { Button } from './ui/Button';

export default function LawyerDashboard({ user, quota }) {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text">Welcome, {user.name}!</h1>
        <p className="text-body-grey mt-2">You are logged in as a Verified Lawyer. You have access to extended features.</p>
        <Button variant="outline" className="mt-4">Submit a New Template</Button>
      </div>
      <UploadCTA role="lawyer" quota={quota} />
    </div>
  );
}
