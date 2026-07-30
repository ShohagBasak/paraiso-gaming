import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080d13] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-[#0d1117] border border-cyan-500/30 rounded-2xl p-8 shadow-2xl space-y-4">
            <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto text-cyan-400 font-bold text-2xl">
              !
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide uppercase">Application Error</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Something went wrong while displaying this page. Please try refreshing or clear your browser cache.
            </p>
            {this.state.error?.message && (
              <div className="bg-[#080d13] border border-slate-800 rounded-xl p-3 text-amber-400 text-xs font-mono text-left overflow-x-auto max-h-28">
                {this.state.error.message}
              </div>
            )}
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={this.handleReload}
                className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-cyan-500/20 active:scale-95 cursor-pointer"
              >
                Reload Application
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
