// src/utils/navigation.js
export const getPageTitle = (pathname) => {
  const routes = {
    '/dashboard': 'Dashboard',
    '/stores': 'Stores',
    '/token-usage': 'Token Usage',
    '/chat-history': 'Chat History',
    '/users': 'Users',
    '/settings': 'Settings',
    '/login': 'Login',
  };

  for (const route in routes) {
    if (pathname === route || pathname.startsWith(`${route}/`)) {
      return routes[route];
    }
  }

  return 'Dashboard'; // default title
};
