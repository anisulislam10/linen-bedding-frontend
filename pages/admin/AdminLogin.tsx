import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { login, isLoggedIn, user } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in as admin
    if (isLoggedIn && user?.role === 'admin') {
        return <Navigate to="/admin" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            const loggedInUser = await login(email, password);

            if (loggedInUser.role !== 'admin') {
                setError('Access denied. Administrative privileges required.');
                return;
            }

            navigate('/admin');
        } catch (err: any) {
            setError(err.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-[2rem] shadow-2xl shadow-indigo-500/20 mb-8 border border-white/10">
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">
                        Avenly by Huma<span className="text-indigo-500">.</span> Terminal
                    </h1>
                    <p className="text-slate-400 font-medium tracking-wide text-xs uppercase">
                        Authorized Personnel Access Only
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                                Registry ID
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@Avenly by Huma.com"
                                    className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 p-5 pl-14 rounded-2xl outline-none text-white text-sm transition-all placeholder:text-slate-600"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                                Security Key
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 p-5 pl-14 rounded-2xl outline-none text-white text-sm transition-all placeholder:text-slate-600"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-slate-950 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center space-x-3 hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-white/5 disabled:opacity-50 active:scale-95"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <span>Initialize Console</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-12 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                    System.v1.0.42 // Encrypted Connection
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
