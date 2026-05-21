import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Loader2,

} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      // Mapping 'username' field to 'email' for Supabase Auth
      const { error } = await signIn({
        email: formData.username,
        password: formData.password,
      });

      if (error) throw error;

      toast.success('Signed in successfully');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10 relative overflow-hidden bg-[#050A14] font-sans">

      {/* ── Ambient background glows ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* top-left violet blob */}
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-violet-700/20 blur-[120px]" />
        {/* top-right teal blob */}
        <div className="absolute -top-20 right-0 w-[360px] h-[360px] rounded-full bg-teal-500/15 blur-[100px]" />
        {/* bottom-center green blob */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      {/* ── Glass card ── */}
      <div className="relative w-full max-w-[440px]">

        {/* Top glowing edge highlight */}
        <div className="absolute -top-px left-1/2 -translate-x-1/2 w-3/4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent blur-[2px]" />

        <div
          className="relative rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl shadow-[0_32px_64px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.07)] p-8 sm:p-10"
        >

          {/* ── Header ── */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-1">
              Welcome back
            </h1>
            <p className="text-slate-400 text-sm">
              Sign in to your account
            </p>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors duration-200">
                  <User size={17} />
                </div>
                <input
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full h-[50px] pl-11 pr-4 rounded-full text-sm text-white placeholder:text-slate-600 bg-white/[0.05] border outline-none transition-all duration-200
                    ${errors.username
                      ? 'border-red-500/60 focus:ring-2 focus:ring-red-500/20'
                      : 'border-white/[0.08] focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15'
                    }`}
                />
              </div>
              {errors.username && (
                <p className="text-xs text-red-400 font-medium pl-4">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-slate-500 hover:text-emerald-400 transition-colors duration-200"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors duration-200">
                  <Lock size={17} />
                </div>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full h-[50px] pl-11 pr-12 rounded-full text-sm text-white placeholder:text-slate-600 bg-white/[0.05] border outline-none transition-all duration-200
                    ${errors.password
                      ? 'border-red-500/60 focus:ring-2 focus:ring-red-500/20'
                      : 'border-white/[0.08] focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-emerald-400 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 font-medium pl-4">{errors.password}</p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[50px] rounded-full font-bold text-sm tracking-wide text-white
                bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500
                hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400
                shadow-[0_0_24px_rgba(16,185,129,0.35)]
                hover:shadow-[0_0_32px_rgba(16,185,129,0.55)]
                transition-all duration-300 ease-out
                active:scale-[0.97]
                disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>



        </div>

        {/* Bottom copyright */}
        <p className="mt-6 text-center text-slate-700 text-xs">
          © 2026 Enterprise Solutions. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
