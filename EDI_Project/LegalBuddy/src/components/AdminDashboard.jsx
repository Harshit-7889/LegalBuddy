import React from 'react';
import { Button } from './ui/Button';
import { Link } from 'react-router-dom';

export default function AdminDashboard({ user }) {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-text">Admin Dashboard</h1>
        <p className="text-body-grey mt-2">Welcome, {user.name}. You have full administrative access.</p>
        <div className="mt-6 space-x-4">
            {/* This link will eventually go to a real admin management page */}
            <Link to="/admin/verifications">
                <Button>Manage Verifications</Button>
            </Link>
            <Button variant="secondary">View System Stats</Button>
        </div>
      </div>
    </div>
  );
}
