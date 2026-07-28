import { Link } from 'react-router';
import { MdSecurity } from 'react-icons/md';

const ForgotPassword = () => {
    return (
        <div className="bg-[#121820]/80 backdrop-blur-md p-8 rounded-2xl border border-slate-700 shadow-2xl max-w-md w-full text-center">
            {/* Header */}
            <div className="mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                    <MdSecurity size={32} />
                </div>
                <h2 className="text-white font-bold text-xl uppercase tracking-widest">Reset Password</h2>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                    Direct password resets are disabled for security.
                </p>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl text-slate-300 text-sm leading-relaxed mb-6">
                Please contact a <strong className="text-amber-400">Master Admin</strong> to request a password reset for your account. They can reset it for you from the Admin Panel.
            </div>

            {/* Back to Login */}
            <Link to="/login" className="inline-block w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-bold uppercase tracking-widest rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] active:scale-95">
                Back to Login
            </Link>
        </div>
    );
};

export default ForgotPassword;
