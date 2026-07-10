import { useEffect, useState } from 'react';
import { footerAPI } from '../api/footerAPI';

export const useFooterData = () => {
  const [footerData, setFooterData] = useState(null);
  const [siteInfo, setSiteInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        setLoading(true);
        const [contentRes, siteRes] = await Promise.all([
          footerAPI.getFooterContent(),
          footerAPI.getSiteInfo(),
        ]);

        setFooterData(contentRes.data.data.footerContent);
        setSiteInfo(siteRes.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching footer data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  return { footerData, siteInfo, loading, error };
};

export const useNewsletterSubscribe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const subscribe = async (email, firstName = '', lastName = '', category = 'all') => {
    try {
      setLoading(true);
      setError(null);
      const response = await footerAPI.subscribeNewsletter({
        email,
        firstName,
        lastName,
        category,
      });
      setSuccess(true);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to subscribe');
      setSuccess(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { subscribe, loading, error, success };
};

export default useFooterData;