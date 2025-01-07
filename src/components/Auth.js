import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();

  const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID; // Replace with your OAuth client ID
  const SCOPES = 'https://www.googleapis.com/auth/spreadsheets'; // Permission for Sheets
  const REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URL; // Redirect URL after login

  console.log("Redirect: ", REDIRECT_URI);

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
    <div>
      <h1>Authenticate with Google</h1>
      <a href={buildOAuthURL()} className="login-button">
        Sign in with Google
      </a>
    </div>
  );
};

export default Auth;