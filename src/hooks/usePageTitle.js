import { useEffect } from 'react';

/**
 * A custom hook for setting the page title
 * @param {string} title - The title to set for the page
 * @param {boolean} includeAppName - Whether to include "Holidaze" in the title
 */
const usePageTitle = (title, includeAppName = true) => {
  useEffect(() => {
    const appName = 'Holidaze';
    const newTitle = includeAppName ? `${title} | ${appName}` : title;
    document.title = newTitle;

    return () => {
      document.title = 'Holidaze';
    };
  }, [title, includeAppName]);
};

export default usePageTitle; 