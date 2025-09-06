import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";  
import axios from "axios";
const countryList = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Congo (Congo-Kinshasa)",
  "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic (Czechia)", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea (North)", "Korea (South)",
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
  "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico",
  "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (Burma)", "Namibia", "Nauru",
  "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan",
  "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
  "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "São Tomé and Príncipe", "Saudi Arabia", "Senegal",
  "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea",
  "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan",
  "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela",
  "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const AuthPage = ({ isSignUp, setIsSignUp }) => {
  const navigate = useNavigate();
// email verification state

const [emailVerified, setEmailVerified] = useState(false);
const [verificationCode, setVerificationCode] = useState(""); // code sent to email
const [userCode, setUserCode] = useState(""); // code user enters
const [isVerifying, setIsVerifying] = useState(false)
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [referenceName, setReferenceName] = useState("");
  const [subProducts, setSubProducts] = useState([]);
const [heardFrom, setHeardFrom] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedSubProduct, setSelectedSubProduct] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [phoneCode, setPhoneCode] = useState("");

  const [formData, setFormData] = useState({
    Name: "",
    email: "",
    password: "",
    phoneNumber: "",
    country: "",
    city: "",
    categoryId: "",
    productId: "",
    subproductId: "",
    zipCode: "",
    experience: "",
    details: "",
    heardFrom: "", 
    referenceName: "",
  });
  // input states
  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [experience, setExperience] = useState("");
  const [details, setDetails] = useState("");

  // Fetch categories
  useEffect(() => {
    fetch("https://asap-nine-pi.vercel.app/Category")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch products
  useEffect(() => {
    if (!selectedCategory) return;
    fetch(`https://asap-nine-pi.vercel.app/product?categoryId=${selectedCategory}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch((err) => console.error(err));
  }, [selectedCategory]);

  // Fetch subproducts
  useEffect(() => {
    if (!selectedCategory || !selectedProduct) return;
    fetch(
      `https://asap-nine-pi.vercel.app/subProduct?categoryId=${selectedCategory}&productId=${selectedProduct}`
    )
      .then((res) => res.json())
      .then((data) => setSubProducts(data.subproducts || []))
      .catch((err) => console.error(err));
  }, [selectedCategory, selectedProduct]);
  

  // Country change handler
 const handleCountryChange = (e) => {
  const countryName = e.target.value;
  setSelectedCountry(countryName);
  const selected = countryList.find((c) => c.name === countryName);
  setPhoneCode(selected ? selected.code : "");
};

  // handleChange function
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


// ✅ Signup
// ✅ Signup
const handleSignUp = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("https://asap-nine-pi.vercel.app/seller-signup", {
      Name,
      email,
      password,
      phoneNumber,
      country: selectedCountry,
      city,
      categoryId: selectedCategory,
      productId: selectedProduct,
      subproductId: selectedSubProduct,
      zipCode,
      experience,
      details,
      heardFrom,
      referenceName,
    });

    console.log("Signup Response:", res.data);
    alert(res.data.message || "Signup successful!");
    setIsSignUp(false);
  } catch (err) {
    console.error("Signup Error:", err.response ? err.response.data : err.message);
    alert(err.response?.data?.message || "Signup failed!");
  }
};


// ✅ Login
const handleSignIn = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("https://asap-nine-pi.vercel.app/seller-login", {
      email,
      password,
    });

    console.log("Login Response:", res.data);

    if (res.data.sellerId) {
      localStorage.setItem("userId", res.data.sellerId);
      localStorage.setItem("role", "seller");      // ✅ role stored
      localStorage.setItem("name", res.data.name); // ✅ name stored
    }

    alert(res.data.message || "Login successful!");
    navigate("/"); // ✅ redirect to seller dashboard
  } catch (err) {
    console.error("Login Error:", err.response ? err.response.data : err.message);
    alert(err.response?.data?.message || "Login failed!");
  }
};





  return (
    <div className="h-screen w-screen flex flex-col md:flex-row">
      {/* Left Panel */}
<div className="bg-[#3c3007] rounded-br-[40%] rounded-tl-[40%] text-white flex flex-col justify-center items-center md:w-1/3 w-full p-6">
        <h1 className="text-3xl font-bold mb-4 text-center">
          {isSignUp ? "Welcome!" : "Welcome Back!"}
        </h1>
        <p className="text-center mb-4">
          {isSignUp
            ? "Create an account to get started."
            : "Sign in to continue."}
        </p>
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="border-2 border-white px-6 py-3 rounded-full hover:bg-white hover:text-[#3c3007] transition"
        >
          {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center pt-96  overflow-auto">
        <div className=" rounded-br-[20%] rounded-tl-[20%] p-6 rounded-lg shadow-md w-full md:w-[80%]">
          <h1 className="text-[#3c3007] text-2xl font-bold text-center mb-6">
            {isSignUp ? "Create Account as Seller" : "Sign In"}
          </h1>

          {isSignUp ? (
            <form className="flex flex-col gap-4" onSubmit={handleSignUp}>
              <input type="text" placeholder="Full Name" className="p-3 bg-[#eae7e7] rounded-md" value={Name} onChange={(e) => setName(e.target.value)} required />
             

<input
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="p-3 bg-[#eae7e7] rounded-md"
  disabled={emailVerified} // disable after verified
/>


<button
  type="button"
  onClick={async () => {
    setIsVerifying(true);
    try {
      // send email to backend to generate verification code
      const res = await axios.post("https://asap-nine-pi.vercel.app/send-verification-code", { email });
      setVerificationCode(res.data.code); // optional, for frontend testing
      alert("Verification code sent to your email!");
    } catch (err) {
      console.error(err);
      alert("Failed to send verification code");
    }
    setIsVerifying(false);
  }}
  disabled={emailVerified || isVerifying}
>
  {isVerifying ? "Sending..." : "Verify Email"}
</button>
{/* Input for code */}
<input
  type="text"
  placeholder="Enter verification code"
  value={userCode}
  onChange={(e) => setUserCode(e.target.value)}
  className="p-3 bg-[#eae7e7] rounded-md"
  disabled={emailVerified}
/>


<button
  type="button"
  onClick={() => {
    if (userCode === verificationCode) { // compare with backend-generated
      setEmailVerified(true);
      alert("Email verified successfully!");
    } else {
      alert("Invalid code");
    }
  }}
  disabled={emailVerified}
>
  Verify Code
</button>

             


{/* Password Input */}
<input
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="p-3 bg-[#eae7e7] rounded-md"
  disabled={!emailVerified} // disable until email verified
/>

{/* Country & Phone */}
<select
  value={selectedCountry}
  onChange={(e) => setSelectedCountry(e.target.value)}
  className="p-3 bg-[#eae7e7] rounded-md w-1/2"
  required
  disabled={!emailVerified}
>
  <option value="">Select Country</option>
  {countryList.map((country, i) => (
    <option key={i} value={country}>{country}</option>
  ))}
</select>

<input
  type="tel"
  placeholder="Phone Number"
  value={phoneNumber}
  onChange={(e) => setPhoneNumber(e.target.value)}
  className="p-3 bg-[#eae7e7] rounded-md flex-1"
  required
  disabled={!emailVerified}
/>

<input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required className="p-3 bg-[#eae7e7] rounded-md" disabled={!emailVerified} />

<input type="text" placeholder="Zip Code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required className="p-3 bg-[#eae7e7] rounded-md" disabled={!emailVerified} />

{/* Category / Product / SubProduct */}
<select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="p-3 bg-[#eae7e7] rounded-md" required disabled={!emailVerified}>
  <option value="">Select Category</option>
  {categories.map((cat) => (
    <option key={cat._id} value={cat._id}>{cat.Title || cat.name}</option>
  ))}
</select>

<select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="p-3 bg-[#eae7e7] rounded-md" required disabled={!emailVerified}>
  <option value="">Select Product</option>
  {products.map((prod) => (
    <option key={prod._id} value={prod._id}>{prod.Title || prod.name}</option>
  ))}
</select>

<select value={selectedSubProduct} onChange={(e) => setSelectedSubProduct(e.target.value)} className="p-3 bg-[#eae7e7] rounded-md" required disabled={!emailVerified}>
  <option value="">Select SubProduct</option>
  {subProducts.map((sub) => (
    <option key={sub._id} value={sub._id}>{sub.Title || sub.name}</option>
  ))}
</select>

<select value={heardFrom} onChange={(e) => setHeardFrom(e.target.value)} className="p-3 bg-[#eae7e7] rounded-md" required disabled={!emailVerified}>
  <option value="">How did you hear about us?</option>
  <option value="Facebook">Facebook</option>
  <option value="Instagram">Instagram</option>
  <option value="YouTube">YouTube</option>
  <option value="TikTok">TikTok</option>
  <option value="Influencers">Influencers</option>
  <option value="Other">Other</option>
</select>

<input type="number" placeholder="Experience (Years)" value={experience} onChange={(e) => setExperience(e.target.value)} required className="p-3 bg-[#eae7e7] rounded-md" disabled={!emailVerified} />

<textarea placeholder="Details" value={details} onChange={(e) => setDetails(e.target.value)} required className="p-3 bg-[#eae7e7] rounded-md" disabled={!emailVerified}></textarea>
<input
  type="text"
  placeholder="Reference Name"
  value={referenceName}
  onChange={(e) => setReferenceName(e.target.value)}
  className="p-3 bg-[#eae7e7] rounded-md"
  disabled={!emailVerified}
/>

              <button type="submit" className="bg-[#3c3007] text-white py-4 rounded-full font-bold hover:opacity-90 transition">
                Sign Up
              </button>
            </form>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSignIn}>
              <input type="email" placeholder="Email" className="p-3 bg-[#eae7e7] rounded-md" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" className="p-3 bg-[#eae7e7] rounded-md" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit" className="bg-[#3c3007] text-white py-4 rounded-full font-bold hover:opacity-90 transition">
                Sign In
              </button>
                {/* ✅ Forgot Password link */}
    <div className="text-center mt-2">
      <Link
        to="/forgot-password"
        className="text-[#3c3007] font-medium hover:underline"
      >
        Forgot Password?
      </Link>
    </div>
              
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
