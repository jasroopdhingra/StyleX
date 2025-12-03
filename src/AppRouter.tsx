import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';

class RootErrorBoundary extends React.Component<React.PropsWithChildren> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('Root render failed', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 text-center">
          <div className="max-w-lg space-y-3">
            <p className="text-2xl font-semibold">Something went wrong.</p>
            <p className="text-slate-300">Refresh the page to try again. If the issue continues, restart with <code>npm run dev</code> and <code>npm run server</code>.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function AppRouter() {
  return (
    <HashRouter>
      <RootErrorBoundary>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="*" element={<App />} />
        </Routes>
      </RootErrorBoundary>
    </HashRouter>
  );
}
