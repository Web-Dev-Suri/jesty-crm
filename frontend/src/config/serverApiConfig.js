export const API_BASE_URL =
  import.meta.env.PROD || import.meta.env.VITE_DEV_REMOTE == 'remote'
    ? import.meta.env.VITE_BACKEND_SERVER + 'api/'
    : 'https://web.jestycrm.com/api/';
export const BASE_URL =
  import.meta.env.PROD || import.meta.env.VITE_DEV_REMOTE
    ? import.meta.env.VITE_BACKEND_SERVER
    : 'https://web.jestycrm.com/';

export const WEBSITE_URL = import.meta.env.PROD
  ? 'https://jestycrm.com/'
  : 'https://web.jestycrm.com/';
export const DOWNLOAD_BASE_URL =
  import.meta.env.PROD || import.meta.env.VITE_DEV_REMOTE
    ? import.meta.env.VITE_BACKEND_SERVER + 'download/'
    : 'https://web.jestycrm.com/download/';
export const ACCESS_TOKEN_NAME = 'x-auth-token';

export const FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL;
