document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');
  const loginButton = document.getElementById('login-button');
  const loadingIndicator = document.getElementById('loading-indicator');
  const passwordInput = document.getElementById('password');
  const togglePassword = document.getElementById('toggle-password');
  const toggleIcon = togglePassword.querySelector('.eye-icon');
  
  // Username and password state
  let username = '';
  let password = '';
  
  // Update username state when input changes
  document.getElementById('username').addEventListener('input', function(e) {
    username = e.target.value;
  });
  
  // Update password state when input changes
  passwordInput.addEventListener('input', function(e) {
    password = e.target.value;
  });
  
  // Toggle password visibility
  togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Toggle icon
    if (type === 'text') {
      toggleIcon.classList.remove('eye-closed');
      toggleIcon.classList.add('eye-open');
    } else {
      toggleIcon.classList.remove('eye-open');
      toggleIcon.classList.add('eye-closed');
    }
  });
  
  // Handle form submission
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Show loading state
    loginButton.disabled = true;
    loginButton.textContent = 'Signing in...';
    errorMessage.style.display = 'none';
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch('https://mavexa.autsync.info/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.access_token) {
        // Store token in cookie (expires in 1 day)
        document.cookie = `auth_token=${data.access_token}; max-age=${60*60*24}; path=/`;
        
        // Store user data in localStorage
        const userData = {
          username,
          token: data.access_token,
          tokenType: data.token_type
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Redirect to dashboard or previous page
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get('redirect') || '/dashboard';
        window.location.href = redirectUrl;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (err) {
      // Show error message
      errorMessage.textContent = 'Invalid username or password';
      errorMessage.style.display = 'block';
      console.error('Login error:', err);
    } finally {
      // Reset loading state
      loginButton.disabled = false;
      loginButton.textContent = 'Sign In';
    }
  });
});