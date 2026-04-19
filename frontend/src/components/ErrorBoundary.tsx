import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('DeCo error boundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-12 h-12 bg-black flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-xl">!</span>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Something went wrong</div>
              <h2 className="text-2xl font-bold tracking-tighter mb-3">Unexpected Error</h2>
              <p className="text-zinc-500 text-sm leading-relaxed mb-2">
                An unexpected error occurred. This has been logged.
              </p>
              {this.state.error && (
                <p className="text-xs font-mono text-zinc-400 bg-zinc-50 p-3 text-left break-all">
                  {this.state.error.message}
                </p>
              )}
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="btn btn-primary px-6 py-2"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-outline px-6 py-2"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
