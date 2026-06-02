import React from 'react';
import UploadCTA from './UploadCTA'; // We still want them to see the upload action

export default function UserDashboard({ user, quota }) {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text">Welcome, {user.name}!</h1>
        <p className="text-body-grey mt-2">You are logged in as a Regular User. You can now upload your documents for analysis.</p>
      </div>
      {/* We can re-use the UploadCTA component here */}
      <UploadCTA role="user" quota={quota} />
    </div>
  );
}
