import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const SellerInformation = ({ userId }) => {
  const summaryRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    personal: { name: "", email: "", contact: "", address: "", profileImage: null, profilePreview: null },
    education: [{ degree: "", university: "" }],
    skills: [{ skill: "" }],
    hobbies: [{ hobby: "" }],
    experience: [{ experience: "" }],
    about: { description: "" },
    ads: [],
  });

  const tabs = ["Personal Details", "Education", "Skills", "Hobbies", "Experience", "About Me", "Previous Ads", "Summary"];
 const fetchSeller = useCallback(async () => {
  try {
    const res  = await fetch(`https://asap-nine-pi.vercel.app/api/sellerdetailsprofile?userId=${Id}`);

    const data = await res.json();
    if (data.length > 0) handleEdit(data[0]);
  } catch (err) {
    console.error(err);
  }
}, [userId]); // removed handleEdit


 

  const handleChange = (tab, field, value, index = null) => {
    setFormData(prev => {
      const updated = { ...prev };
      if (index !== null) updated[tab][index][field] = value;
      else updated[tab][field] = value;
      return updated;
    });
  };

  const handleImageUpload = (tab, e, isAd = false, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    if (isAd) {
      const updatedAds = [...formData.ads];
      updatedAds[index].image = file;
      updatedAds[index].preview = previewUrl;
      setFormData(prev => ({ ...prev, ads: updatedAds }));
    } else {
      handleChange(tab, "profileImage", file);
      handleChange(tab, "profilePreview", previewUrl);
    }

    return () => URL.revokeObjectURL(previewUrl);
  };

  const handleAddItem = (tab, itemTemplate) => {
    setFormData(prev => ({ ...prev, [tab]: [...prev[tab], itemTemplate] }));
  };

  const handleRemoveItem = (tab, index) => {
    const updated = [...formData[tab]];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, [tab]: updated }));
  };

  const handleNext = () => setActiveTab(prev => prev + 1);
  const handlePrevious = () => setActiveTab(prev => prev - 1);

  const handleEdit = useCallback(seller => {
    setEditingId(seller._id);
    setFormData({
      personal: {
        name: seller.personal.name,
        email: seller.personal.email,
        contact: seller.personal.contact || "",
        address: seller.personal.address || "",
        profileImage: null,
        profilePreview: seller.personal.profileImage ? `https://asap-nine-pi.vercel.app/uploads/${seller.personal.profileImage}` : null,
      },
      education: seller.education.length ? seller.education : [{ degree: "", university: "" }],
      skills: seller.skills.length ? seller.skills : [{ skill: "" }],
      hobbies: seller.hobbies.length ? seller.hobbies : [{ hobby: "" }],
      experience: seller.experience.length ? seller.experience : [{ experience: "" }],
      about: seller.about,
      ads: seller.ads.map(ad => ({
        _id: ad._id,
        description: ad.description,
        image: null,
        preview: ad.image ? `https://asap-nine-pi.vercel.app/uploads/${ad.image}` : null,
      })),
    });
  }, []);

const handleSubmit = async () => {
  try {
    const form = new FormData();

    const personalData = {
      name: formData.personal.name,
      email: formData.personal.email,
      contact: formData.personal.contact,
      address: formData.personal.address
    };
    form.append("personal", JSON.stringify(personalData));
    form.append("education", JSON.stringify(formData.education || []));

    const skillsData = formData.skills.map(s => ({
      hobby: s.hobby || "N/A",
      skill: s.skill || "N/A",
      experience: s.experience || "N/A"
    }));
    form.append("skills", JSON.stringify(skillsData));

    form.append("about", formData.about || "");

    if (formData.personal.profileImage) {
      form.append("profileImage", formData.personal.profileImage);
    }

    formData.ads.forEach(ad => {
      if (ad.image) form.append("adsImages", ad.image);
    });

    const url = editingId
      ? `https://asap-nine-pi.vercel.app/api/sellerdetailsprofile/${editingId}`
      : "https://asap-nine-pi.vercel.app/api/sellerdetailsprofile";

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, { method, body: form });
    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      fetchSeller();
    } else {
      alert(data.error);
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong!");
  }
};

   
  const downloadPDF = async () => {
    if (!summaryRef.current) return;
    const input = summaryRef.current;
    const pdf = new jsPDF("p", "mm", "a4");
    const pageHeight = pdf.internal.pageSize.getHeight();
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = pdfHeight;
    let position = 0;
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("seller-summary.pdf");
  };

  /** --- Previous Ads Handlers --- */
  const handleAdChange = (index, field, value) => {
    const updatedAds = [...formData.ads];
    updatedAds[index][field] = value;
    setFormData(prev => ({ ...prev, ads: updatedAds }));
  };

  const handleAddAd = () => {
    setFormData(prev => ({
      ...prev,
      ads: [...prev.ads, { image: null, preview: null, description: "" }],
    }));
  };

  const handleRemoveAd = async (index, adId = null) => {
    if (adId) {
      try {
        const res = await fetch(`https://asap-nine-pi.vercel.app/api/sellerdetails/${editingId}/ads/${adId}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete ad");
      } catch (err) {
        console.error(err);
        alert("Failed to delete ad from server");
        return;
      }
    }
    const updatedAds = [...formData.ads];
    updatedAds.splice(index, 1);
    setFormData(prev => ({ ...prev, ads: updatedAds }));
  };

  const handleAdImageUpload = (e, index) => {
    handleImageUpload(null, e, true, index);
  };

  /** --- Render --- */
  return (
    <div className="mw-full mr-36 ml-36 mx-auto bg-gradient-to-r from-amber-300 to-amber-500 p-6 bg-gray-50 shadow rounded mt-10">
      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-6 overflow-x-auto">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === index ? "bg-[#292511] text-white rounded" : "text-white hover:text-[#292511]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Personal Details */}
        {activeTab === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Name" value={formData.personal.name} onChange={e => handleChange("personal", "name", e.target.value)} className="w-full p-2 border rounded"/>
            <input type="email" placeholder="Email" value={formData.personal.email} onChange={e => handleChange("personal", "email", e.target.value)} className="w-full p-2 border rounded"/>
            <input type="text" placeholder="Contact Number" value={formData.personal.contact} onChange={e => handleChange("personal", "contact", e.target.value)} className="w-full p-2 border rounded"/>
            <input type="text" placeholder="Address" value={formData.personal.address} onChange={e => handleChange("personal", "address", e.target.value)} className="w-full p-2 border rounded"/>
            <div className="md:col-span-2">
              <label className="block mb-2">Upload Profile Image</label>
              <input type="file" onChange={e => handleImageUpload("personal", e)} className="w-full"/>
              {formData.personal.profilePreview && <img src={formData.personal.profilePreview} alt="Profile" className="mt-2 w-32 h-32 object-cover rounded-full border"/>}
            </div>
          </div>
        )}

        {/* Education */}
        {activeTab === 1 && formData.education.map((edu, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <input type="text" placeholder="Degree" value={edu.degree} onChange={e => handleChange("education", "degree", e.target.value, idx)} className="w-1/2 p-2 border rounded"/>
            <input type="text" placeholder="University" value={edu.university} onChange={e => handleChange("education", "university", e.target.value, idx)} className="w-1/2 p-2 border rounded"/>
            <button onClick={() => handleRemoveItem("education", idx)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
          </div>
        ))}
        {activeTab === 1 && <button onClick={() => handleAddItem("education", { degree: "", university: "" })} className="px-4 py-2 bg-[#292511] text-white rounded mt-2">Add Education</button>}

        {/* Skills */}
        {activeTab === 2 && formData.skills.map((skill, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <input type="text" placeholder="Skill" value={skill.skill} onChange={e => handleChange("skills", "skill", e.target.value, idx)} className="w-full p-2 border rounded"/>
            <button onClick={() => handleRemoveItem("skills", idx)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
          </div>
        ))}
        {activeTab === 2 && <button onClick={() => handleAddItem("skills", { skill: "" })} className="px-4 py-2 bg-[#292511] text-white rounded mt-2">Add Skill</button>}

        {/* Hobbies */}
        {activeTab === 3 && formData.hobbies.map((hobby, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <input type="text" placeholder="Hobby" value={hobby.hobby} onChange={e => handleChange("hobbies", "hobby", e.target.value, idx)} className="w-full p-2 border rounded"/>
            <button onClick={() => handleRemoveItem("hobbies", idx)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
          </div>
        ))}
        {activeTab === 3 && <button onClick={() => handleAddItem("hobbies", { hobby: "" })} className="px-4 py-2 bg-[#292511] text-white rounded mt-2">Add Hobby</button>}

        {/* Experience */}
        {activeTab === 4 && formData.experience.map((exp, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <input type="text" placeholder="Experience" value={exp.experience} onChange={e => handleChange("experience", "experience", e.target.value, idx)} className="w-full p-2 border rounded"/>
            <button onClick={() => handleRemoveItem("experience", idx)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
          </div>
        ))}
        {activeTab === 4 && <button onClick={() => handleAddItem("experience", { experience: "" })} className="px-4 py-2 bg-[#292511] text-white rounded mt-2">Add Experience</button>}

        {/* About Me */}
        {activeTab === 5 && <textarea placeholder="About Me" value={formData.about.description} onChange={e => handleChange("about", "description", e.target.value)} className="w-full p-2 border rounded"/>}

        {/* Previous Ads */}
        {activeTab === 6 && (
          <div className="space-y-4">
            {formData.ads.map((ad, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input type="file" onChange={e => handleAdImageUpload(e, idx)} className="w-1/4"/>
                {ad.preview && <img src={ad.preview} alt="Ad" className="w-24 h-24 object-cover rounded"/>}
                <input type="text" placeholder="Ad Description" value={ad.description} onChange={e => handleAdChange(idx, "description", e.target.value)} className="w-1/2 p-2 border rounded"/>
                <button onClick={() => handleRemoveAd(idx, ad._id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
              </div>
            ))}
            <button onClick={handleAddAd} className="px-4 py-2 bg-[#292511] text-white rounded mt-2">Add Ad</button>
          </div>
        )}

        {/* Summary */}
        {activeTab === 7 && (
          <div ref={summaryRef} className="space-y-4">
            <h2 className="text-xl font-semibold">Summary</h2>
            <div className="border p-4 rounded">
              <p><strong>Name:</strong> {formData.personal.name}</p>
              <p><strong>Email:</strong> {formData.personal.email}</p>
              <p><strong>Contact:</strong> {formData.personal.contact}</p>
              <p><strong>Address:</strong> {formData.personal.address}</p>
              {formData.personal.profilePreview && <img src={formData.personal.profilePreview} alt="Profile" className="w-32 h-32 object-cover rounded-full"/>}
            </div>
            <div className="border p-4 rounded">
              <strong>Education:</strong>
              {formData.education.map((edu, i) => <p key={i}>{edu.degree} - {edu.university}</p>)}
            </div>
            <div className="border p-4 rounded">
              <strong>Skills:</strong>
              {formData.skills.map((s,i) => <p key={i}>{s.skill}</p>)}
            </div>
            <div className="border p-4 rounded">
              <strong>Hobbies:</strong>
              {formData.hobbies.map((h,i) => <p key={i}>{h.hobby}</p>)}
            </div>
            <div className="border p-4 rounded">
              <strong>Experience:</strong>
              {formData.experience.map((e,i) => <p key={i}>{e.experience}</p>)}
            </div>
            <div className="border p-4 rounded">
              <strong>About Me:</strong>
              <p>{formData.about.description}</p>
            </div>
            <div className="border p-4 rounded">
              <strong>Ads:</strong>
              {formData.ads.map((ad,i) => (
                <div key={i} className="flex items-center gap-4">
                  {ad.preview && <img src={ad.preview} alt="Ad" className="w-24 h-24 object-cover rounded"/>}
                  <p>{ad.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        {activeTab > 0 && <button onClick={handlePrevious} className="px-4 py-2 bg-gray-300 rounded">Previous</button>}
        {activeTab < tabs.length - 1 && <button onClick={handleNext} className="px-4 py-2 bg-[#292511] text-white rounded">Next</button>}
        {activeTab === tabs.length - 1 && (
          <div className="flex gap-4">
            <button onClick={handleSubmit} className="px-4 py-2 bg-green-500 text-white rounded">Submit</button>
            <button onClick={downloadPDF} className="px-4 py-2 bg-purple-500 text-white rounded">Download PDF</button>
          </div>
        )}
      </div>
      
    </div>
  );
};


export default SellerInformation;
