import React from 'react';

export default function UserSettings() {
  return (
    <div className="max-w-lg mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">User Settings</h1>
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="name">Name</label>
          <input id="name" name="name" type="text" className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="password">New Password</label>
          <input id="password" name="password" type="password" className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="notifications">Notifications</label>
          <select id="notifications" name="notifications" className="w-full px-3 py-2 border rounded">
            <option value="all">All</option>
            <option value="important">Important Only</option>
            <option value="none">None</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Changes</button>
      </form>
    </div>
  );
}
