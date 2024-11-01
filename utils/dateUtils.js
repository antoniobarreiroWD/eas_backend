const formatDateToRequiredFormat = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = '23';
    const minutes = '59';
  
    return `${year}${month}${day}${hours}${minutes}`;
  };
  
  module.exports = {
    formatDateToRequiredFormat,
  };
  