import { useState } from 'react';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const LoginPage = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    
    if (!validate()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Login successful!');
      if (onLoginSuccess) onLoginSuccess(formData);
    } catch (error) {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600 via-blue-500 to-indigo-700 p-4 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="w-full max-w-[400px] animate-in fade-in zoom-in duration-500">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-[2rem] shadow-2xl border border-white/20">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl text-white mb-4 shadow-lg shadow-blue-500/30 transform hover:rotate-6 transition-transform duration-300">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Portal Access</h1>
            <p className="text-slate-500 mt-2 font-medium">Welcome back! Please login to your account.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 rounded-2xl outline-none transition-all duration-200 
                    ${errors.username ? 'border-red-500 focus:ring-red-100' : 'border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100'}`}
                />
              </div>
              {errors.username && <p className="text-xs text-red-500 font-medium ml-1">{errors.username}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className={`w-full pl-11 pr-12 py-3.5 bg-slate-50 border-2 rounded-2xl outline-none transition-all duration-200 
                    ${errors.password ? 'border-red-500 focus:ring-red-100' : 'border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 font-medium ml-1">{errors.password}</p>}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
              <label className="flex items-center gap-2 cursor-pointer hover:text-slate-700 transition-colors">
                <input type="checkbox" className="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500" />
                Remember me
              </label>
              <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/40 transform active:scale-[0.98] transition-all duration-200 overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={22} />
                    Processing...
                  </>
                ) : (
                  <>
                    Login to Account
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-medium">
              New to our platform?{' '}
              <a href="#" className="text-blue-600 font-bold hover:underline">Create Account</a>
            </p>
          </div>
        </div>
        
        {/* Trust Badge */}
        <p className="mt-8 text-center text-blue-100/60 text-sm font-medium flex items-center justify-center gap-1.5">
          <ShieldCheck size={16} /> Secure end-to-end encryption active
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
