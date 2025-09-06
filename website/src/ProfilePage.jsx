import React, { useState, useEffect } from "react";

const ProfilePage = () => {
  const [file, setFile] = useState(null);
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Fetch User Profile Data
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("No userId found in localStorage");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `https://asap-nine-pi.vercel.app/users/${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error("Failed to fetch user profile");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // ✅ Handle Profile Image Selection (Preview Only)
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // ✅ Save Edited Profile Data
  const handleSaveProfile = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    setSaving(true);

    try {
      const response = await fetch(
        `https://asap-nine-pi.vercel.app/users/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Name: userData.Name,
            phoneNumber: userData.phoneNumber,
            city: userData.city,
            country: userData.country,
            zipCode: userData.zipCode,
            experience: userData.experience,
            details: userData.details,
          }),
        }
      );

      if (response.ok) {
        alert("Profile updated successfully!");
        setEditMode(false);
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  // ✅ Upload Profile Image
  const handleImageUpload = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId || !file) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const response = await fetch(
        `https://asap-nine-pi.vercel.app/users/upload-profile-image/${userId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        alert("Image uploaded successfully!");
      } else {
        alert("Image upload failed!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading Profile...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-red-500">
          Failed to load profile. Please login again.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="flex flex-col md:flex-row justify-between">
        {/* ✅ Left Side: Profile Picture */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Seller Profile</h2>
          <div className="flex items-center mb-4">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl overflow-hidden">
              {file ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Profile"
                  className="w-24 h-24 object-cover rounded-full"
                />
              ) : (
                "👤"
              )}
            </div>
            <div className="ml-4">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
              />
              <label
                htmlFor="fileInput"
                className="cursor-pointer text-blue-500 underline"
              >
                Choose File
              </label>
              {file && <span className="ml-2 text-sm">File chosen</span>}
            </div>
          </div>
          <button
            onClick={handleImageUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:opacity-90"
          >
            Upload Image
          </button>
        </div>

        {/* ✅ Right Side: Profile Details */}
        <div className="ml-0 md:ml-6 mt-6 md:mt-0 space-y-2">
          {editMode ? (
            <>
              <input
                type="text"
                value={userData.Name}
                onChange={(e) =>
                  setUserData({ ...userData, Name: e.target.value })
                }
                className="border p-2 w-full rounded"
              />
              <input
                type="text"
                value={userData.phoneNumber}
                onChange={(e) =>
                  setUserData({ ...userData, phoneNumber: e.target.value })
                }
                className="border p-2 w-full rounded"
              />
              <input
                type="text"
                value={userData.city}
                onChange={(e) =>
                  setUserData({ ...userData, city: e.target.value })
                }
                className="border p-2 w-full rounded"
              />
              <input
                type="text"
                value={userData.country}
                onChange={(e) =>
                  setUserData({ ...userData, country: e.target.value })
                }
                className="border p-2 w-full rounded"
              />
              <input
                type="text"
                value={userData.zipCode}
                onChange={(e) =>
                  setUserData({ ...userData, zipCode: e.target.value })
                }
                className="border p-2 w-full rounded"
              />
              <input
                type="text"
                value={userData.experience}
                onChange={(e) =>
                  setUserData({ ...userData, experience: e.target.value })
                }
                className="border p-2 w-full rounded"
              />
              <textarea
                value={userData.details}
                onChange={(e) =>
                  setUserData({ ...userData, details: e.target.value })
                }
                className="border p-2 w-full rounded"
              ></textarea>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-green-500 text-white px-4 py-2 rounded hover:opacity-90"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <>
              <p>
                <strong>Full Name:</strong> {userData.Name}
              </p>
              <p>
                <strong>Phone:</strong> {userData.phoneNumber}
              </p>
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
              <p>
                <strong>Address:</strong> {userData.city}, {userData.country}
              </p>
              <p>
                <strong>Experience:</strong> {userData.experience}
              </p>
              <p>
                <strong>Zip Code:</strong> {userData.zipCode}
              </p>
              <p>
                <strong>Description:</strong> {userData.details || "No details"}
              </p>
              <button
                onClick={() => setEditMode(true)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:opacity-90"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

      {/* ✅ Service Details */}
      <div className="mt-6">
        <p>
          <strong>Service Category:</strong>{" "}
          {userData.categoryId?.Title || "N/A"}
        </p>
        <p>
          <strong>Service Product:</strong>{" "}
          {userData.productId?.name || "N/A"}
        </p>
        <p>
          <strong>Sub Product:</strong>{" "}
          {userData.subproductId?.name || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
