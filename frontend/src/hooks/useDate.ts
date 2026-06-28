import moment from 'moment';

export const useDate = () => {
  const formatDate = (dateString: string, format: string = 'MMMM DD, YYYY') => {
    if (!dateString) return '';
    return moment(dateString).format(format);
  };

  const toISO = (dateString: string) => {
    if (!dateString) return '';
    return moment(dateString).toISOString();
  };

  return {
    formatDate,
    toISO,
    moment
  };
};
