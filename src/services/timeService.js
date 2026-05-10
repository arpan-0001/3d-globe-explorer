import axios from 'axios';
import { TIMEZONEDB_API_KEY } from '../config';

export const getTime = async (lat, lng) => {
  if (!lat || !lng) throw new Error("Invalid lat/lng");

  const url = `https://api.timezonedb.com/v2.1/get-time-zone?key=${TIMEZONEDB_API_KEY}&format=json&by=position&lat=${lat}&lng=${lng}`;
  console.log("🌍 Time API URL:", url); // ✅ debug the exact call

  const response = await axios.get(url);

  if (response.data.status !== 'OK') {
    console.error('❌ Time API failed:', response.data);
    throw new Error('Failed to fetch time from TimeZoneDB');
  }

  return {
    datetime: response.data.formatted,
    zoneName: response.data.zoneName,
    gmtOffset: response.data.gmtOffset
  };
};
