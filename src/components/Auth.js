import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();

  console.log('Auth component rendered'); 
  
  const CLIENT_ID = process.env.REACT_GOOGLE_CLIENT_ID;  // Replace with your OAuth client ID
  const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';  // Permission to read/write to sheets
  const REDIRECT_URI = process.env.REACT_GOOGLE_REDIRECT_URL;  // Redirect URL after Google login

  console.log('buildOAuthURL start'); 
  // Build the OAuth URL
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

  console.log('buildOAuthURL end'); 

  useEffect(() => {
    // Check if access_token is in the URL
    console.log("Effect running");
    const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
    const token = hashParams.get('access_token');
    console.log("ACCESS: ", token);
    
    if (token) {
      // Save the token to localStorage (or state)
      localStorage.setItem('auth_token', token);
      
      // Redirect to the Google Sheets editor page
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
