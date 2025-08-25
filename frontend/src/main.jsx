import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';

import RootApp from './RootApp';

const root = createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="664598724570-t0km4iftsn3c030lme5bo515i6ifgp3b.apps.googleusercontent.com">
    <RootApp />
  </GoogleOAuthProvider>
);
