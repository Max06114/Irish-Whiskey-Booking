// Simple analytics tracking
const API = process.env.REACT_APP_BACKEND_URL;

export const trackPageView = async () => {
  try {
    await fetch(`${API}/api/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Silently fail - analytics should not break the app
    console.log('Analytics tracking failed');
  }
};
