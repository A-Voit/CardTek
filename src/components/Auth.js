import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css'; // Import CSS for styling

const Auth = () => {
  const navigate = useNavigate();

  const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID; // Replace with your OAuth client ID
  const SCOPES = 'https://www.googleapis.com/auth/spreadsheets'; // Permission for Sheets
  const REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URL; // Redirect URL after login

  console.log('Redirect URI:', REDIRECT_URI);

  const buildOAuthURL = () => {
    const oauth2Url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    oauth2Url.searchParams.append('client_id', CLIENT_ID);
    oauth2Url.searchParams.append('redirect_uri', REDIRECT_URI);
    oauth2Url.searchParams.append('response_type', 'token');
    oauth2Url.searchParams.append('scope', SCOPES);
    oauth2Url.searchParams.append('include_granted_scopes', 'true');
    oauth2Url.searchParams.append('state', 'state_parameter_passthrough_value');
    return oauth2Url.toString();
  };

  useEffect(() => {
    // Extract the access token from the URL hash
    const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
    const token = hashParams.get('access_token');

    if (token) {
      // Save the token to localStorage
      localStorage.setItem('auth_token', token);

      // Redirect to another page
      navigate('/card-filter');
    }
  }, [navigate]);

  return (
    <div className="auth-container">
      <h1>Welcome to CardTek</h1>
      <p>Please sign in with Google to access your collection.</p>
      <a href={buildOAuthURL()} className="auth-button">
        <img
          src="https://developers.google.com/identity/images/btn_google_signin_light_normal_web.png"
          alt="Sign in with Google"
        />
      </a>
    </div>
  );
};

export default Auth;
