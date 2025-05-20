import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useRegisterUserMutation } from '../redux/features/auth/authApi';
import bgCeramic from '../assets/bgCeramic.png';

// ✅ Local email validation
const isValidEmail = (value) => {
    const emailRegex = /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    const allowedDomains = ["gmail.com"];
    const domain = value.split("@")[1]?.toLowerCase();
    return emailRegex.test(value) && allowedDomains.includes(domain);
};

// Password Strength Meter Component
const PasswordStrengthMeter = ({ password }) => {
    const getStrength = (pass) => {
        if (!pass) return 0;
        let strength = 0;
        if (pass.length >= 8) strength += 1;
        if (/[a-z]/.test(pass)) strength += 1;
        if (/[A-Z]/.test(pass)) strength += 1;
        if (/\d/.test(pass)) strength += 1;
        if (/[@$!%*?&]/.test(pass)) strength += 1;
        return strength;
    };

    const strength = getStrength(password);
    const strengthPercentage = (strength / 5) * 100;

    const getMessage = () => {
        if (password.length === 0) return '';
        const messages = [
            "Very weak - try adding more characters",
            "Weak - try adding lowercase letters",
            "Moderate - try adding uppercase letters",
            "Good - try adding numbers",
            "Strong - try adding special characters",
            "Very strong! Great password"
        ];
        return messages[Math.min(strength, 5)];
    };

    const getColor = () => {
        const colors = [
            "bg-red-500",
            "bg-orange-500",
            "bg-yellow-500",
            "bg-blue-500",
            "bg-green-500",
            "bg-green-600"
        ];
        return colors[Math.min(strength, 5)];
    };

    return (
        <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                    className={`h-2 rounded-full ${getColor()}`} 
                    style={{ width: `${strengthPercentage}%` }}
                ></div>
            </div>
            <p className={`mt-1 text-xs ${strength < 3 ? 'text-red-600' : strength < 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                {getMessage()}
            </p>
            <div className="grid grid-cols-5 gap-1 mt-1 text-[10px] text-gray-500">
                <span className={password.length >= 8 ? 'text-green-600 font-bold' : ''}>8+ chars</span>
                <span className={/[a-z]/.test(password) ? 'text-green-600 font-bold' : ''}>a-z</span>
                <span className={/[A-Z]/.test(password) ? 'text-green-600 font-bold' : ''}>A-Z</span>
                <span className={/\d/.test(password) ? 'text-green-600 font-bold' : ''}>0-9</span>
                <span className={/[@$!%*?&]/.test(password) ? 'text-green-600 font-bold' : ''}>special</span>
            </div>
        </div>
    );
};

const Register = () => {
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState({});
    const [registerUser, { isLoading }] = useRegisterUserMutation();
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!username) {
            newErrors.username = "Please fill this field";
          } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
            newErrors.username = "Username must be 3–20 characters, only letters, numbers, and underscores";
          }
          
        if (!email) {
            newErrors.email = "Please fill this field";
        } else if (!isValidEmail(email)) {
            newErrors.email = "Invalid email. Use only gmail.com (no !, * etc)";
        }

        if (!password) {
            newErrors.password = "Please fill this field";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])/.test(password)) {
            newErrors.password = "Password needs a lowercase letter";
        } else if (!/(?=.*[A-Z])/.test(password)) {
            newErrors.password = "Password needs an uppercase letter";
        } else if (!/(?=.*\d)/.test(password)) {
            newErrors.password = "Password needs a number";
        } else if (!/(?=.*[@$!%*?&])/.test(password)) {
            newErrors.password = "Password needs a special character (@$!%*?&)";
        }

        if (!confirm) {
            newErrors.confirm = "Please fill this field";
        } else if (password !== confirm) {
            newErrors.confirm = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        const data = { username, email, password, confirm };

        try {
            await registerUser(data).unwrap();
            setShowModal(true);
        } catch (error) {
            if (error?.data?.errorType === "EMAIL_EXISTS") {
                setMessage(
                    <span>
                        Email already exists. 
                        <Link to="/login" className="text-[#d4a017] underline ml-1">
                            Please login here
                        </Link>
                    </span>
                );
            } else if (error?.data?.errorType === "WEAK_PASSWORD") {
                setMessage(error?.data?.message || "Password is not strong enough");
            } else {
                setMessage(error?.data?.message || "Registration failed. Please try again.");
            }
        }
    };

    const handleInputChange = (setter, field) => (e) => {
        setter(e.target.value);
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
        if (message) setMessage('');
    };

    const handleModalClose = () => {
        setShowModal(false);
        navigate('/login');
    };


    return (
        <section
            className="min-h-screen w-full relative flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8 bg-center bg-no-repeat"
            style={{
                backgroundImage: `url(${bgCeramic})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            <div className="absolute inset-0 bg-[#683a3a]/70"></div>
            <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-[#4e2929]/80 to-transparent" />
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#4e2929]/80 to-transparent" />

            <div className="relative w-full max-w-md z-10 bg-[#f8f1e5] text-[#4e2929] shadow-2xl p-8 sm:p-10 rounded-xl border-2 border-[#a78a7a]/30">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-normal text-[#4e2929] font-serif tracking-tight mb-2">
                        Create Account
                    </h2>
                    <div className="flex justify-center">
                        <div className="w-16 h-1 bg-[#d4a017] rounded-full"></div>
                    </div>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    {/* Username */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium mb-1 font-sans">
                            Username
                        </label>
                        <input
  type="text"
  id="username"
  value={username}
  onChange={(e) => {
    const cleaned = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
    setUsername(cleaned);
    if (errors.username) {
      setErrors(prev => ({ ...prev, username: '' }));
    }
    if (message) setMessage('');
  }}
  placeholder="Choose a username"
  required
  className={`w-full bg-white/90 text-[#4e2929] rounded-lg px-5 py-3 focus:outline-none border ${errors.username ? 'border-red-500' : 'border-[#a78a7a]/30'}`}
/>

                        {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1 font-sans">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleInputChange(setEmail, 'email')}
                            placeholder="your@email.com"
                            required
                            className={`w-full bg-white/90 text-[#4e2929] rounded-lg px-5 py-3 focus:outline-none border ${errors.email ? 'border-red-500' : 'border-[#a78a7a]/30'}`}
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-1 font-sans">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={handleInputChange(setPassword, 'password')}
                                placeholder="••••••••"
                                required
                                className={`w-full bg-white/90 text-[#4e2929] rounded-lg px-5 py-3 focus:outline-none border ${errors.password ? 'border-red-500' : 'border-[#a78a7a]/30'}`}
                            />
                            <div
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </div>
                        </div>
                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        {password && !errors.password && <PasswordStrengthMeter password={password} />}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirm" className="block text-sm font-medium mb-1 font-sans">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                id="confirm"
                                value={confirm}
                                onChange={handleInputChange(setConfirm, 'confirm')}
                                placeholder="••••••••"
                                required
                                className={`w-full bg-white/90 text-[#4e2929] rounded-lg px-5 py-3 focus:outline-none border ${errors.confirm ? 'border-red-500' : 'border-[#a78a7a]/30'}`}
                            />
                            <div
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                                onClick={() => setShowConfirm(!showConfirm)}
                            >
                                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                            </div>
                        </div>
                        {errors.confirm && <p className="mt-1 text-sm text-red-600">{errors.confirm}</p>}
                    </div>

                    {/* Error Message */}
                    {message && (
                        <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                            {message}
                        </p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#d4a017] hover:bg-[#b78a14] transition-all text-[#4e2929] font-semibold py-3 rounded-lg"
                    >
                        {isLoading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-[#d4a017] hover:text-[#b78a14] underline">
                        Login here
                    </Link>
                </p>
            </div>

            {/* Success Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-[#f8f1e5] p-8 rounded-xl shadow-xl border-2 border-[#a78a7a]/30 w-80 text-center">
                        <h2 className="text-2xl font-bold text-[#4e2929] mb-2">
                            Registration Successful!
                        </h2>
                        <p className="text-[#4e2929] mb-6">
                        Your account has been created. Please check your email.
                        </p>
                        <button 
                            onClick={handleModalClose}
                            className="bg-[#d4a017] hover:bg-[#b78a14] text-[#4e2929] font-semibold py-2 px-4 rounded-md"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Register;
