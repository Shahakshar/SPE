import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../utils/slices/authSlice";
import { useNavigate } from "react-router-dom";

const LoginRegister = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("");
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setRole("");
    setForm({});
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://gateway.local/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      dispatch(login({ token: data.data.token, user: data.data.user }));
      if (data.status === "200") navigate("/dashboard");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      age: Number(form.age),
      gender: form.gender,
      address: form.address,
      role,
      dr_description: role === "DOCTOR" ? form.dr_description : "",
      imageUrl: role === "DOCTOR" ? form.imageUrl : "",
      expertise: role === "DOCTOR" ? form.expertise : "N/A",
      available: role === "DOCTOR" ? form.available === "true" : false,
      hourlyRate: role === "DOCTOR" ? Number(form.hourlyRate) : 0,
      password: form.password,
    };

    try {
      const response = await fetch("http://gateway.local/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(await response.text());
      await response.json();
      setIsLogin(true);
      setForm({});
      setRole("");
    } catch (error) {
      alert("Registration failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-3xl p-10 border border-gray-200 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-700">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isLogin ? "Login to continue" : "Please fill the form to register"}
          </p>
          <button onClick={handleToggle} className="mt-4 text-indigo-600 hover:underline">
            {isLogin ? "Need an account? Register" : "Already have an account? Login"}
          </button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-6 max-w-md mx-auto">
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="input"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="input"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition"
            >
              Log In
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            {!role ? (
              <div className="text-center">
                <p className="mb-4 font-medium text-gray-600">Register as:</p>
                <div className="flex justify-center gap-6">
                  <button
                    onClick={() => setRole("DOCTOR")}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                  >
                    Doctor
                  </button>
                  <button
                    onClick={() => setRole("PATIENT")}
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
                  >
                    Patient
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <input name="name" placeholder="Full Name" onChange={handleChange} className="input" />
                  <input name="email" type="email" placeholder="Email" onChange={handleChange} className="input" />
                  <input name="phone" placeholder="Phone" onChange={handleChange} className="input" />
                  <input name="age" type="number" placeholder="Age" onChange={handleChange} className="input" />
                  <input name="address" placeholder="Address" onChange={handleChange} className="input" />
                  <select name="gender" onChange={handleChange} className="input">
                    <option value="">Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>

                  {role === "DOCTOR" && (
                    <>
                      <input name="dr_description" placeholder="Description" onChange={handleChange} className="input" />
                      <input name="expertise" placeholder="Expertise" onChange={handleChange} className="input" />
                      <input name="hourlyRate" type="number" placeholder="Hourly Rate" onChange={handleChange} className="input" />
                      <select name="available" onChange={handleChange} className="input">
                        <option value="">Availability</option>
                        <option value="true">Available</option>
                        <option value="false">Not Available</option>
                      </select>
                      <input name="imageUrl" placeholder="Image URL" onChange={handleChange} className="input" />
                    </>
                  )}

                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
                >
                  Register
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Input styles */}
      <style>{`
        .input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.75rem;
          font-size: 1rem;
          outline: none;
          transition: all 0.2s;
          background-color: #fff;
        }
        .input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }
      `}</style>
    </div>
  );
};

export default LoginRegister;
