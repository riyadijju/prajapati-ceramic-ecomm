import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useLoginUserMutation } from '../redux/features/auth/authApi';
import { setUser } from '../redux/features/auth/authSlice';
import bgCeramic from '../assets/bgCeramic.png';

const Login = () => {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const [loginUser, { isLoading: loginLoading }] = useLoginUserMutation();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = { email, password };

    try {
      const response = await loginUser(data).unwrap();
      const { user } = response;
      dispatch(setUser({ user }));
      alert("Login successful");
      navigate("/");
    } catch (error) {
      setMessage("Please provide a valid email and password");
    }
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
      {/* Darker overlay for better contrast */}
      <div className="absolute inset-0 bg-[#683a3a]/70"></div>
      
      {/* Blur overlays */}
      <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-[#4e2929]/80 to-transparent" />
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#4e2929]/80 to-transparent" />

      {/* Form Box - Ceramic-themed styling */}
      <div className="relative w-full max-w-md z-10 bg-[#f8f1e5] text-[#4e2929] shadow-2xl p-8 sm:p-10 rounded-xl border-2 border-[#a78a7a]/30">
        {/* Enhanced Welcome Back heading with ceramic styling */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-normal text-[#4e2929] font-serif tracking-tight mb-2">
            Welcome Back
          </h2>
          <div className="flex justify-center">
            <div className="w-16 h-1 bg-[#d4a017] rounded-full"></div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* [Keep all your existing form elements] */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#4e2929]/80 mb-1 font-sans">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full bg-white/90 text-[#4e2929] placeholder-[#a78a7a]/70 rounded-lg px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#d4a017]/50 border border-[#a78a7a]/30 transition-all duration-200 font-sans"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#4e2929]/80 mb-1 font-sans">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white/90 text-[#4e2929] placeholder-[#a78a7a]/70 rounded-lg px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#d4a017]/50 border border-[#a78a7a]/30 transition-all duration-200 font-sans"
              />
              <div
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-[#a78a7a] hover:text-[#4e2929] transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </div>

          {message && (
            <p className="text-red-600 text-sm font-medium bg-red-50 px-3 py-2 rounded-lg font-sans">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full bg-[#d4a017] hover:bg-[#b78a14] transition-all text-[#4e2929] font-semibold py-3 rounded-lg shadow-md hover:shadow-lg focus:ring-2 focus:ring-[#d4a017]/50 focus:ring-offset-2 transform hover:-translate-y-0.5 duration-200 font-sans"
          >
            {loginLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#4e2929]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : 'Login'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[#4e2929]/80 font-sans">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="font-medium text-[#d4a017] hover:text-[#b78a14] underline underline-offset-4 transition-colors"
          >
            Create one now
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;