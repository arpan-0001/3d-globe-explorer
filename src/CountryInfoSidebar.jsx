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
            <div
              className="multi-slide-container"
              ref={scrollRef}
              onScroll={handleScroll}
            >
              <div className="slide-panel">
                <h3>{data.name}</h3>
                {data.flag && (
                  <img src={data.flag} alt="flag" className="flag-img" />
                )}
              </div>

              <div className="slide-panel">
                <p><strong>Capital:</strong> {data.capital}</p>
                <p><strong>Region:</strong> {data.region}</p>
                <p><strong>Population:</strong> {data.population.toLocaleString()}</p>
                <p><strong>Languages:</strong> {data.languages}</p>
              </div>

              <div className="slide-panel">
                <p><strong>Timezone:</strong> {data.timezone}</p>
                <p><strong>Date:</strong> {data.date}</p>
                <p><strong>Local Time:</strong> {data.time}</p>
                {data.weather ? (
                  <p><strong>Weather:</strong> {data.weather.temp}°C, {data.weather.desc}</p>
                ) : (
                  <p><em>Weather unavailable</em></p>
                )}
              </div>
            </div>

            {/* Arrows */}
            <button
              className="arrow-btn arrow-left"
              onClick={() => scrollToSlide(Math.max(activeSlide - 1, 0))}
            >
              ‹
            </button>
            <button
              className="arrow-btn arrow-right"
              onClick={() => scrollToSlide(Math.min(activeSlide + 1, 2))}
            >
              ›
            </button>

            {/* Dots */}
            <div className="dots">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`dot ${activeSlide === i ? 'active' : ''}`}
                  onClick={() => scrollToSlide(i)}
                />
              ))}
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
