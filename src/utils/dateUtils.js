export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    
    if (includeTime) {
      options.hour = 'numeric';
      options.minute = 'numeric';
      options.hour12 = true;
    }
    
    return date.toLocaleString('en-US', options);
  } catch (error) {
    return 'Invalid Date';
  }
};