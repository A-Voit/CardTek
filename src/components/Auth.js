import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css'; // Import CSS for styling

const Auth = () => {
  const navigate = useNavigate();

  // Environment variables for Google OAuth configuration
  const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID; // Google OAuth client ID
  const SCOPES = 'https://www.googleapis.com/auth/spreadsheets'; // Permissions for Google Sheets API
  const REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URL; // Redirect URL after successful login

  console.log('Redirect URI:', REDIRECT_URI);
  console.log('Client ID:', CLIENT_ID);

  // Build the Google OAuth URL
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

      // Redirect to the main application
      navigate('/card-filter');
    }
  }, [navigate]);

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Welcome to CardTek</h1>
        <p>Sign in with Google to access and manage your card collection.</p>
        <a href={buildOAuthURL()} className="auth-button">
          <img
            src="https://developers.google.com/identity/images/btn_google_signin_light_normal_web.png"
            alt="Sign in with Google"
          />
        </a>
      </div>
    </div>
  );
};

export default Auth;
