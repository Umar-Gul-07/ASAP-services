import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BuyerHeader from './BuyerHeader'; // ✅ Ensure correct path

export default function BuyerProfile() {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [userData, setUserData] = useState({});
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // ✅ Fetch buyer data
  const fetchBuyerData = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`https://asap-nine-pi.vercel.app/users/${userId}`, {
        headers: {
          Authorization: token,
        },
      });

      const user = res.data.user;
      setUserData(user);
      setName(user.Name || '');
      setPhone(user.phoneNumber || '');
      setEmail(user.email || '');
      if (user.image) {
        setImagePreview(user.image);
      }
    } catch (err) {
      console.error('Failed to fetch buyer data:', err);
    }
  };

  useEffect(() => {
    fetchBuyerData();
  }, []);

  // ✅ Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Upload profile image to buyer API
  const handleUploadImage = async () => {
    if (!imageFile) return alert('Please select an image first.');
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      try {
        setLoading(true);
        const res = await axios.post(
          'https://asap-nine-pi.vercel.app/buyer/update',
          { sellerId: userId, image: base64Image },
          { headers: { 'Content-Type': 'application/json' } }
        );
        alert('Image uploaded successfully!');
        fetchBuyerData();
      } catch (err) {
        console.error('Image upload failed:', err);
        alert('Image upload failed!');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(imageFile);
  };

  // ✅ Update buyer profile
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(
        'https://asap-nine-pi.vercel.app/buyer-update-profile',
        { sellerId: userId, Name: name, email, phoneNumber: phone },
        { headers: { 'Content-Type': 'application/json' } }
      );
      alert('Profile updated successfully!');
      fetchBuyerData();
    } catch (err) {
      console.error('Profile update failed:', err);
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <BuyerHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-[#292511] text-white flex flex-col">
          <div className="text-2xl font-bold p-4 border-b border-yellow-800">ASSOONASPOSSIBLE</div>
          <nav className="flex-1 p-4 space-y-4">
            <a href="/buyerdashboard" className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-[#1f1b0d]">Dashboard</a>
            <a href="/buyerprofile" className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-[#1f1b0d]">Profile</a>
            <a href="/" className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-[#1f1b0d]">Home</a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 p-8 overflow-auto">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
          </header>

          <nav className="mb-6 text-sm text-blue-600">
            <ol className="list-reset flex gap-1 items-center">
              <li><a href="/" className="hover:underline">Home</a></li>
              <li>{'>'}</li>
              <li>Profile</li>
            </ol>
          </nav>

          <section className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
            <h2 className="font-bold text-lg mb-3">Buyer Profile</h2>

            {/* Tabs */}
            <nav className="border-b border-gray-200 mb-6">
              <ul className="flex space-x-4 text-sm font-medium text-gray-600">
                <li>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`pb-1 ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-blue-600'}`}
                  >
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('edit')}
                    className={`pb-1 ${activeTab === 'edit' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-blue-600'}`}
                  >
                    Edit Profile
                  </button>
                </li>
              </ul>
            </nav>

            <div className="flex justify-center md:justify-start gap-10 items-center flex-wrap md:flex-nowrap">
              {/* Profile Image */}
              <div className="flex flex-col items-center gap-4 flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="object-cover w-32 h-32" />
                  ) : (
                    <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM12 14c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
                    </svg>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                  <label htmlFor="fileUpload" className="cursor-pointer inline-flex items-center px-3 py-1.5 border border-gray-400 rounded-md hover:bg-gray-100">
                    Choose File
                    <input type="file" accept="image/*" id="fileUpload" className="hidden" onChange={handleImageChange} />
                  </label>
                  <button
                    onClick={handleUploadImage}
                    className="border border-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-700 hover:text-white"
                    disabled={loading}
                  >
                    {loading ? 'Uploading...' : 'Upload Image'}
                  </button>
                </div>
                <div className="mt-2 text-center">
                  <p className="font-semibold">{name}</p>
                  <p className="text-sm">Buyer</p>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'profile' ? (
                <dl className="px-2 flex-1 max-w-md space-y-3 text-gray-700">
                  <div className="flex justify-between border-b border-gray-200 pb-1">
                    <dt className="font-medium">Phone :</dt>
                    <dd>{phone}</dd>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-1">
                    <dt className="font-medium">Email :</dt>
                    <dd>{email}</dd>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-1">
                    <dt className="font-medium">Role :</dt>
                    <dd>{userData?.role || 'Buyer'}</dd>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-1">
                    <dt className="font-medium">Country :</dt>
                    <dd>{userData?.country || 'Loading...'}</dd>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-1">
                    <dt className="font-medium">State :</dt>
                    <dd>{userData?.state || 'Loading...'}</dd>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-1">
                    <dt className="font-medium">Zip Code :</dt>
                    <dd>{userData?.zipCode || 'Loading...'}</dd>
                  </div>
                </dl>
              ) : (
                <form onSubmit={handleProfileUpdate} className="px-2 flex-1 max-w-md space-y-4 text-gray-700">
                  <div>
                    <label className="block font-medium mb-1">Name</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Phone</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Email</label>
                    <input type="email" className="w-full border border-gray-300 rounded px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <button type="submit" className="mt-4 bg-yellow-900 text-white px-4 py-2 rounded hover:bg-yellow-800 transition">
                    {loading ? 'Updating...' : 'Update Profile'}
                  </button>
                </form>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
