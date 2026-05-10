// src/services/countryService.js
import axios from 'axios';

export async function getCountryInfo(name) {
  const res = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`);
  const data = res.data[0];
  return {
    name: data.name.common,
    capital: data.capital?.[0] || 'Unknown',
    population: data.population,
    region: data.region,
    languages: Object.values(data.languages || {}).join(', '),
    flag: data.flags?.svg
  };
}
