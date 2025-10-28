import React, { useState } from 'react';

export default function PasswordManager({ onUpdatePassword, currentPassword }) {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPass !== confirmPass) {
      setMessage('Password baru dan konfirmasi password tidak cocok');
      return;
    }

    if (newPass.length < 6) {
      setMessage('Password harus minimal 6 karakter');
      return;
    }

    const success = await onUpdatePassword(newPass);
    if (success) {
      setMessage('Password berhasil diupdate!');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      setMessage('Gagal mengupdate password');
    }
  };

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Security Settings</h2>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-medium mb-3 text-sm sm:text-base">Update Password</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password Baru
            </label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Masukkan password baru"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Konfirmasi password baru"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
          >
            Update Password
          </button>
        </form>
        {message && (
          <div className={`mt-3 p-2 rounded text-sm ${
            message.includes('berhasil') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}