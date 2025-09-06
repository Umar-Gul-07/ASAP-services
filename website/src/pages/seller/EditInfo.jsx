import React, { useState, useEffect } from "react";

const EditInfo = ({ userId }) => {
  const [formData, setFormData] = useState({
    personal: { name: "", email: "", contact: "", address: "", profileImage: null, profilePreview: null },
    education: [{ degree: "", university: "" }],
    skills: [{ skill: "" }],
    hobbies: [{ hobby: "" }],
    experience: [{ experience: "" }],
    about: { description: "" },
    ads: [],
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`https://asap-nine-pi.vercel.app/api/sellerdetails?userId=${userId}`);
      const data = await res.json();
      if (data.length > 0) {
        const user = data[0];
        setFormData({
          personal: {
            name: user.personal.name,
            email: user.personal.email,
            contact: user.personal.contact || "",
            address: user.personal.address || "",
            profileImage: null,
            profilePreview: user.personal.profileImage ? `https://asap-nine-pi.vercel.app/uploads/${user.personal.profileImage}` : null,
          },
          education: user.education.length ? user.education : [{ degree: "", university: "" }],
          skills: user.skills.length ? user.skills : [{ skill: "" }],
          hobbies: user.hobbies.length ? user.hobbies : [{ hobby: "" }],
          experience: user.experience.length ? user.experience : [{ experience: "" }],
          about: user.about,
          ads: user.ads.map(ad => ({ description: ad.description, image: null, preview: ad.image ? `https://asap-nine-pi.vercel.app/uploads/${ad.image}` : null })),
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (tab, field, value, index = null) => {
    setFormData(prev => {
      const updated = { ...prev };
      if (index !== null) updated[tab][index][field] = value;
      else updated[tab][field] = value;
      return updated;
    });
  };

  const handleAdChange = (index, field, value) => {
    const updatedAds = [...formData.ads];
    updatedAds[index][field] = value;
    setFormData(prev => ({ ...prev, ads: updatedAds }));
  };

  const handleImageUpload = (tab, e, isAd = false, index = null) => {
    const file = e.target.files[0];
    if (!file) return;
    if (isAd) {
      const updatedAds = [...formData.ads];
      updatedAds[index].image = file;
      updatedAds[index].preview = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, ads: updatedAds }));
    } else {
      handleChange(tab, "profileImage", file);
      handleChange(tab, "profilePreview", URL.createObjectURL(file));
    }
  };

  const handleAddItem = (tab, itemTemplate) => setFormData(prev => ({ ...prev, [tab]: [...prev[tab], itemTemplate] }));
  const handleRemoveItem = (tab, index) => { const updated = [...formData[tab]]; updated.splice(index, 1); setFormData(prev => ({ ...prev, [tab]: updated })); };

  const handleSubmit = async () => {
    try {
      const form = new FormData();
      form.append("personal", JSON.stringify(formData.personal));
      form.append("education", JSON.stringify(formData.education));
      form.append("skills", JSON.stringify(formData.skills));
      form.append("hobbies", JSON.stringify(formData.hobbies));
      form.append("experience", JSON.stringify(formData.experience));
      form.append("about", JSON.stringify(formData.about));
      form.append("ads", JSON.stringify(formData.ads.map(a => ({ description: a.description }))));

      if (formData.personal.profileImage) form.append("profileImage", formData.personal.profileImage);
      formData.ads.forEach(ad => ad.image && form.append("adsImages", ad.image));

      const res = await fetch(`https://asap-nine-pi.vercel.app/api/sellerdetails/${userId}`, {
        method: "PUT",
        body: form,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Profile updated successfully!");
        fetchUserProfile();
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 shadow rounded mt-10 space-y-6">
      <h1 className="text-2xl font-bold">Edit Your Profile</h1>

      {/* Personal Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Name" value={formData.personal.name} onChange={e => handleChange("personal", "name", e.target.value)} className="w-full p-2 border rounded"/>
        <input type="email" placeholder="Email" value={formData.personal.email} onChange={e => handleChange("personal", "email", e.target.value)} className="w-full p-2 border rounded"/>
        <input type="text" placeholder="Contact" value={formData.personal.contact} onChange={e => handleChange("personal", "contact", e.target.value)} className="w-full p-2 border rounded"/>
        <input type="text" placeholder="Address" value={formData.personal.address} onChange={e => handleChange("personal", "address", e.target.value)} className="w-full p-2 border rounded"/>
        <div className="md:col-span-2">
          <label className="block mb-2">Upload Profile Image</label>
          <input type="file" onChange={e => handleImageUpload("personal", e)} className="w-full"/>
          {formData.personal.profilePreview && <img src={formData.personal.profilePreview} alt="Profile" className="mt-2 w-32 h-32 object-cover rounded-full border"/>}
        </div>
      </div>

      {/* About Me */}
      <div>
        <label className="block mb-2">About Me</label>
        <textarea value={formData.about.description} onChange={e => handleChange("about", "description", e.target.value)} className="w-full p-2 border rounded"/>
      </div>

      {/* Previous Ads */}
      <div>
        <label className="block mb-2">Previous Ads</label>
        {formData.ads.map((ad, idx) => (
          <div key={idx} className="flex gap-2 items-center mb-2">
            <input type="file" onChange={e => handleImageUpload("ads", e, true, idx)} className="w-1/3"/>
            {ad.preview && <img src={ad.preview} alt="Ad" className="w-24 h-24 object-cover rounded"/>}
            <input type="text" placeholder="Ad Description" value={ad.description} onChange={e => handleAdChange(idx, "description", e.target.value)} className="w-1/3 p-2 border rounded"/>
            <button onClick={() => handleRemoveItem("ads", idx)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
          </div>
        ))}
        <button onClick={() => handleAddItem("ads", { image: null, preview: null, description: "" })} className="px-4 py-2 bg-blue-500 text-white rounded mt-2">Add Ad</button>
      </div>

      <div className="flex justify-end mt-4">
        <button onClick={handleSubmit} className="px-4 py-2 bg-green-500 text-white rounded">Update Profile</button>
      </div>
    </div>
  );
};

export default EditInfo;
