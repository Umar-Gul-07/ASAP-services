import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";  
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



const BuyerLogin = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
const [referenceName, setReferenceName] = useState("");

  // Email verification states
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState(""); // code from backend
  const [userCode, setUserCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Login API
  const loginUser = async (email, password) => {
    try {
      const response = await fetch("https://asap-nine-pi.vercel.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.status === 200) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("email", email);
        localStorage.setItem("name", data.name);
        localStorage.setItem("role", "buyer");
        navigate("/");
      } else {
        alert("Login failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Signup API
  const signupUser = async (formData) => {
    try {
      const response = await fetch("https://asap-nine-pi.vercel.app/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.status === 200) {
        alert("Signup successful!");
        setIsSignUp(false);
      } else {
        alert("Signup failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Form handlers
  const handleSignIn = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    loginUser(email, password);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    const formData = {
      Name: e.target.fullName.value,
      email: e.target.email.value,
      password: e.target.password.value,
      phoneNumber: e.target.phoneNumber.value,
      country: e.target.country.value,
      city: e.target.city.value,
      zipCode: e.target.zipCode.value,
      heardFrom: e.target.heardFrom.value,
      referenceName:e.target.referenceName.value,
    };
    signupUser(formData);
  };

  const sendVerificationCode = async (email) => {
    setIsVerifying(true);
    try {
      const res = await fetch("https://asap-nine-pi.vercel.app/send-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setVerificationCode(data.code); // for testing, remove in production
      alert("Verification code sent to your email!");
    } catch (err) {
      console.error(err);
      alert("Failed to send verification code");
    }
    setIsVerifying(false);
  };

  const verifyCode = () => {
    if (userCode === verificationCode) {
      setEmailVerified(true);
      alert("Email verified successfully!");
    } else {
      alert("Invalid code");
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row">
      {/* Left Panel */}
      <div className="bg-[#3c3007] rounded-r-[40%] text-white flex flex-col justify-center items-center md:w-1/3 w-full p-6">
        <h1 className="text-3xl font-bold mb-4 text-center">
          {isSignUp ? "Welcome!" : "Welcome Back!"}
        </h1>
        <p className="text-center mb-4">
          {isSignUp
            ? "Create an account to get started."
            : "Sign in to continue or create a new account."}
        </p>
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="border-2 border-white px-6 py-3 rounded-full hover:bg-white hover:text-[#3c3007] transition"
        >
          {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-[80%]">
          <h1 className="text-[#3c3007] text-2xl font-bold text-center mb-6">
            {isSignUp ? "Create Account as Buyer" : "Sign In"}
          </h1>

          {isSignUp ? (
            <form className="flex flex-col gap-4" onSubmit={handleSignUp}>
              <input type="text" name="fullName" placeholder="Full Name" className="p-3 bg-[#eae7e7] rounded-md" required />

              <input
                type="email"
                name="email"
                placeholder="Email"
                className="p-3 bg-[#eae7e7] rounded-md"
                disabled={emailVerified} // disable after verified
                required
              />

              <button
                type="button"
                onClick={() => sendVerificationCode(document.querySelector('input[name="email"]').value)}
                disabled={emailVerified || isVerifying}
              >
                {isVerifying ? "Sending..." : "Verify Email"}
              </button>

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
                onClick={verifyCode}
                disabled={emailVerified}
              >
                Verify Code
              </button>

              {/* Other fields disabled until email verified */}
              <input type="password" name="password" placeholder="Password" className="p-3 bg-[#eae7e7] rounded-md" required disabled={!emailVerified} />
              <input type="text" name="phoneNumber" placeholder="Phone Number" className="p-3 bg-[#eae7e7] rounded-md" required disabled={!emailVerified} />

              <select name="country" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className="p-3 bg-[#eae7e7] rounded-md" required disabled={!emailVerified}>
                <option value="">Select Country</option>
                {countryList.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>

              <input type="text" name="city" placeholder="City" className="p-3 bg-[#eae7e7] rounded-md" required disabled={!emailVerified} />

              <select name="heardFrom" className="p-3 bg-[#eae7e7] rounded-md" required disabled={!emailVerified}>
                <option value="">-- How did you hear about us? --</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
                <option value="TikTok">TikTok</option>
                <option value="Influencers">Influencers</option>
                <option value="Other">Other</option>
              </select>

              <input type="text" name="zipCode" placeholder="Zip Code" className="p-3 bg-[#eae7e7] rounded-md" required disabled={!emailVerified} />
<input
  type="text"
  name="referenceNumber"
  placeholder="Reference Name"
  value={referenceName}
  className="p-3 bg-[#eae7e7] rounded-md"
  disabled={!emailVerified}
/>

              <button type="submit" className="bg-[#3c3007] text-white py-4 rounded-full font-bold hover:opacity-90 transition" disabled={!emailVerified}>
                Sign Up
              </button>
            </form>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSignIn}>
              <input type="email" name="email" placeholder="Email" className="p-3 bg-[#eae7e7] rounded-md" required />
              <input type="password" name="password" placeholder="Password" className="p-3 bg-[#eae7e7] rounded-md" required />
              <button type="submit" className="bg-[#3c3007] text-white py-4 rounded-full font-bold hover:opacity-90 transition">
                Sign In
              </button>
              <div className="text-center mt-2">
                <Link to="/forgot-password" className="text-[#3c3007] font-medium hover:underline">
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

export default BuyerLogin;
