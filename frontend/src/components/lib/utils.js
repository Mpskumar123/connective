export const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };
  
  export const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  