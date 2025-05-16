import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../utils/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginRegister = () => {

    const dispatch = useDispatch();
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState('');
    const [form, setForm] = useState({});
    const navigate = useNavigate();

    const handleToggle = () => {
        setIsLogin(!isLogin);
        setRole('');
        setForm({});
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const payload = {
            email: form.email,
            password: form.password,
        }

        try {
            
            const response = await fetch('http://gateway.local/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }
            const data = await response.json();
            console.log('Login successful:', data);
            dispatch(login({ token: data.data.token, user: data.data.user}));
            if (data.status === '200') {
                navigate('/dashboard');
            }
        } catch (error) {   
            console.error('Login failed:', error.message);
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
            gender: form.gender === 'Male' ? 'Male' : 'Female',
            address: form.address,
            role: role,
            dr_description: role === 'DOCTOR' ? form.dr_description : '',
            imageUrl: role === 'DOCTOR' ? form.imageUrl : '',
            expertise: role === 'DOCTOR' ? form.expertise : 'N/A',
            available: role === 'DOCTOR' ? (form.available === 'true' || form.available === true) : false,
            hourlyRate: role === 'DOCTOR' ? Number(form.hourlyRate) : 0,
            password: form.password
        }
        
        
        console.log("Final Payload:", payload);
        
        try {
            const response = await fetch('http://gateway.local/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
    
            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }
    
            const data = await response.json();
            console.log('Registration successful:', data);
    
            // Toggle to login screen
            setIsLogin(true);
            setForm({});
            setRole('');
        } catch (error) {
            console.error('Registration failed:', error.message);
            alert("Registration failed: " + error.message);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {isLogin ? 'Login' : 'Register'}
                </h2>

                {isLogin ? (
                    <form onSubmit={handleLogin}>
                        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full mb-3 p-2 border rounded" />
                        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="w-full mb-3 p-2 border rounded" />
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
                    </form>
                ) : (
                    <>
                        {!role && (
                            <div className="mb-4 text-center">
                                <p className="mb-2">Register as:</p>
                                <button onClick={() => setRole('DOCTOR')} className="mr-2 px-4 py-2 bg-green-600 text-white rounded">Doctor</button>
                                <button onClick={() => setRole('PATIENT')} className="px-4 py-2 bg-purple-600 text-white rounded">Patient</button>
                            </div>
                        )}
                        {role && (
                            <form onSubmit={handleRegister}>
                                <div className="mb-2">
                                    <label className="block text-sm">Name</label>
                                    <input name="name" onChange={handleChange} className="w-full p-2 border rounded" />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm">Email</label>
                                    <input name="email" type="email" onChange={handleChange} className="w-full p-2 border rounded" />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm">Phone</label>
                                    <input name="phone" onChange={handleChange} className="w-full p-2 border rounded" />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm">Age</label>
                                    <input name="age" type="number" onChange={handleChange} className="w-full p-2 border rounded" />
                                </div>
                                <div className="mb-2">
                                            <label className="block text-sm">Address</label>
                                            <input name="address" onChange={handleChange} className="w-full p-2 border rounded" />
                                        </div>
                                <div className="mb-2">
                                    <label className="block text-sm">Gender</label>
                                    <select name="gender" onChange={handleChange} className="w-full p-2 border rounded">
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                                {role === "DOCTOR" && (
                                    <>
                                        <div className="mb-2">
                                            <label className="block text-sm">Description</label>
                                            <input name="dr_description" onChange={handleChange} className="w-full p-2 border rounded" />
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-sm">Image URL</label>
                                            <input name="imageUrl" onChange={handleChange} className="w-full p-2 border rounded" />
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-sm">Expertise</label>
                                            <input name="expertise" onChange={handleChange} className="w-full p-2 border rounded" />
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-sm">Hourly Rate</label>
                                            <input name="hourlyRate" type="number" onChange={handleChange} className="w-full p-2 border rounded" />
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-sm">Available</label>
                                            <select name="available" onChange={handleChange} className="w-full p-2 border rounded">
                                                <option value="">Select</option>
                                                <option value="true">Yes</option>
                                                <option value="false">No</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                                <div className="mb-2">
                                    <label className="block text-sm">Password</label>
                                    <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="w-full mb-3 p-2 border rounded" />
                                </div>
                                
                                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Register</button>
                            </form>
                        )}
                    </>
                )}

                <div className="mt-4 text-center">
                    <p>
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                        <button onClick={handleToggle} className="text-blue-600 underline">
                            {isLogin ? 'Register' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginRegister;
