import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white rounded-3xl p-8 shadow-luxury border-2 border-gold-400 space-y-4">
            <div className="w-16 h-16 rounded-full bg-gold-100 text-burgundy-950 flex items-center justify-center mx-auto text-2xl font-bold">
              🌸
            </div>
            <h2 className="font-serif text-2xl font-bold text-burgundy-950">
              रीना शर्मा बुटीक
            </h2>
            <p className="text-xs text-charcoal-muted">
              पेज लोड करने में कोई अस्थायी समस्या आई। कृपया नीचे दिए बटन से रिफ्रेश करें।
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.href = '/';
                }}
                className="bg-burgundy-900 text-gold-200 font-bold px-6 py-2.5 rounded-full text-xs shadow hover:bg-burgundy-950"
              >
                होमपेज पर जाएं (Go Home)
              </button>
              <button
                onClick={() => window.location.reload()}
                className="border border-gold-400 text-burgundy-950 font-bold px-5 py-2.5 rounded-full text-xs hover:bg-gold-50"
              >
                रिफ्रेश करें (Reload)
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
