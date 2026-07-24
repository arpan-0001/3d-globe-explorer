import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import './CountryInfoSidebar.css';

import SidebarSkeleton from './SidebarSkeleton';
import { getCountryInfo } from './services/countryService';
import { getTime } from './services/timeService';
import { getWeather } from './services/weatherService';

const CountryInfoSidebar = ({ country, onClose }) => {
  const isMobile = useMediaQuery({ maxWidth: 600 });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef();
  const cacheRef = useRef({});

  useEffect(() => {
    if (!country?.name) return;

    if (cacheRef.current[country.name]) {
      setData(cacheRef.current[country.name]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setErrorMsg('');
      setData(null);

      try {
        const info = await getCountryInfo(country.name);
        const weather = await getWeather(info.capital);

        let time = {
          datetime: new Date().toISOString(),
          zoneName: 'N/A'
        };

        try {
          time = await getTime(country.lat, country.lng);
        } catch (e) {
          console.warn('Time fallback used:', e.message);
        }

        let date = '', localTime = '';
        if (time.datetime.includes(' ')) {
          [date, localTime] = time.datetime.split(' ');
        }

        const finalData = {
          name: info.name,
          capital: info.capital,
          flag: info.flag,
          population: info.population,
          region: info.region,
          languages: info.languages,
          date,
          time: localTime,
          timezone: time.zoneName,
          weather: weather
            ? {
                temp: weather.main.temp,
                desc: weather.weather[0].description,
              }
            : null,
        };

        cacheRef.current[country.name] = finalData;
        setData(finalData);
      } catch (err) {
        console.error('Error fetching sidebar data:', err);
        setErrorMsg('Could not load data.');
      } finally {
        setLoading(false);
        setActiveSlide(0);
        if (scrollRef.current) scrollRef.current.scrollLeft = 0;
      }
    };

    fetchData();
  }, [country?.name, country?.lat, country?.lng]);

  const scrollToSlide = (index) => {
    const container = scrollRef.current;
    if (container) {
      const width = container.clientWidth;
      container.scrollTo({ left: index * width, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (container) {
      const index = Math.round(container.scrollLeft / container.clientWidth);
      setActiveSlide(index);
    }
  };

  if (!country) return null;

  return (
    <motion.div
      className="sidebar"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.4 }}
    >
      <button className="close-btn" onClick={onClose}>
        &times;
      </button>

      {loading ? (
        <SidebarSkeleton countryName={country.name} />
      ) : errorMsg ? (
        <p className="error-text">{errorMsg}</p>
      ) : data ? (
        isMobile ? (
          <>
            {/* === MOBILE: Sliding panels === */}
   <div className="bottom-sheet-content">

  <div className="sheet-handle" />

  <h2>{data.name}</h2>

  {data.flag && (
    <img
      src={data.flag}
      alt="flag"
      className="flag-img"
    />
  )}

  <div className="info-row">
    <span>🏛 Capital</span>
    <strong>{data.capital}</strong>
  </div>

  <div className="info-row">
    <span>🌎 Region</span>
    <strong>{data.region}</strong>
  </div>

  <div className="info-row">
    <span>👥 Population</span>
    <strong>{data.population.toLocaleString()}</strong>
  </div>

  <div className="info-row">
    <span>🗣 Languages</span>
    <strong>{data.languages}</strong>
  </div>

  <div className="info-row">
    <span>🕒 Timezone</span>
    <strong>{data.timezone}</strong>
  </div>

  <div className="info-row">
    <span>📅 Date</span>
    <strong>{data.date}</strong>
  </div>

  <div className="info-row">
    <span>⏰ Local Time</span>
    <strong>{data.time}</strong>
  </div>

  {data.weather && (
    <div className="info-row">
      <span>☀ Weather</span>
      <strong>
        {data.weather.temp}°C · {data.weather.desc}
      </strong>
    </div>
  )}

</div>
          </>
        ) : (
          <>
            {/* === DESKTOP: Classic stacked info === */}
            <div className="info-content">
              <h3>{data.name}</h3>
              {data.flag && (
                <img src={data.flag} alt="flag" className="flag-img" />
              )}
              <p><strong>Capital:</strong> {data.capital}</p>
              <p><strong>Region:</strong> {data.region}</p>
              <p><strong>Population:</strong> {data.population.toLocaleString()}</p>
              <p><strong>Languages:</strong> {data.languages}</p>
              <p><strong>Timezone:</strong> {data.timezone}</p>
              <p><strong>Date:</strong> {data.date}</p>
              <p><strong>Local Time:</strong> {data.time}</p>
              {data.weather ? (
                <p><strong>Weather:</strong> {data.weather.temp}°C, {data.weather.desc}</p>
              ) : (
                <p><em>Weather unavailable</em></p>
              )}
            </div>
          </>
        )
      ) : null}
    </motion.div>
  );
};

export default CountryInfoSidebar;
