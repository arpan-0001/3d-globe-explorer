

import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import * as topojson from 'topojson-client';
import * as THREE from 'three';
import { geoCentroid } from 'd3-geo';

import TutorialScreen from './views/TutorialScreen';
import './GlobeViewer.css';
import worldData from './data/countries-110m.json';
import CountryInfoSidebar from './CountryInfoSidebar';

const GlobeViewer = () => {
  const globeEl = useRef();
  const cloudMeshRef = useRef();

  const [countryPolygons, setCountryPolygons] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showPolygons, setShowPolygons] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMode, setCurrentMode] = useState('Show Borders');

  const [isTextureLoaded, setIsTextureLoaded] = useState(false);
  const [isCloudLoaded, setIsCloudLoaded] = useState(false);
  const [minDelayPassed, setMinDelayPassed] = useState(false);
  const [isReadyToRender, setIsReadyToRender] = useState(false);

  const allModes = ['Show Borders', 'Hide Borders', 'Start Rotation', 'Stop Rotation'];

  useEffect(() => {
    const timer = setTimeout(() => setMinDelayPassed(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isTextureLoaded && isCloudLoaded && minDelayPassed) {
      setIsReadyToRender(true);
    }
  }, [isTextureLoaded, isCloudLoaded, minDelayPassed]);

  useEffect(() => {
    const earthLoader = new THREE.TextureLoader();
    earthLoader.load('/earth_daymap.png',
      () => setIsTextureLoaded(true),
      undefined,
      (err) => {
        console.warn('Earth texture failed to load:', err);
        setIsTextureLoaded(true);
      }
    );

    const cloudLoader = new THREE.TextureLoader();
    cloudLoader.load('/clouds1.png',
      (cloudTexture) => {
        const cloudGeometry = new THREE.SphereGeometry(100.5, 75, 75);
        const cloudMaterial = new THREE.MeshPhongMaterial({
          map: cloudTexture,
          transparent: true,
          opacity: 0.35,
          side: THREE.DoubleSide,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
        cloudMeshRef.current = cloudMesh;
        setIsCloudLoaded(true);
      },
      undefined,
      (err) => {
        console.warn('Cloud texture failed to load:', err);
        setIsCloudLoaded(true);
      }
    );
  }, []);

  useEffect(() => {
    if (!isReadyToRender) return;

    const globe = globeEl.current;
    const geoJson = topojson.feature(worldData, worldData.objects.countries).features;
    setCountryPolygons(geoJson);

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.4;
    globe.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 1000);

    if (cloudMeshRef.current && !globe.scene().children.includes(cloudMeshRef.current)) {
      globe.scene().add(cloudMeshRef.current);
    }

    const loader = new THREE.TextureLoader();
    const bumpMap = loader.load('/earth_bump.jpg');
    const specularMap = loader.load('/earth_specular.jpg');

    // Wait a moment before applying material
    setTimeout(() => {
      const globeMaterial = globe.globeMaterial?.();
      if (globeMaterial) {
        globeMaterial.bumpMap = bumpMap;
        globeMaterial.bumpScale = 0.3;
        globeMaterial.specularMap = specularMap;
        globeMaterial.specular = new THREE.Color('grey');
        globeMaterial.shininess = 10;
        globeMaterial.needsUpdate = true;
      }
    }, 300);

    // Lighting setup
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 3, 5);
    globe.scene().add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x222222);
    globe.scene().add(ambientLight);

    const animate = () => {
      requestAnimationFrame(animate);
      if (cloudMeshRef.current) {
        cloudMeshRef.current.rotation.y += 0.0004;
      }
    };
    animate();
  }, [isReadyToRender]);

  const handleCountryClick = (country) => {
    const name = country?.properties?.name;
    if (!name) return;
    const [lng, lat] = geoCentroid(country);
    globeEl.current.controls().autoRotate = false;
    globeEl.current.pointOfView({ lat, lng, altitude: 1.5 }, 1500);
    setSelectedCountry({ name, lat, lng });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const match = countryPolygons.find(
      (c) => c.properties.name.toLowerCase() === searchQuery.toLowerCase()
    );
    if (match) {
      const [lng, lat] = geoCentroid(match);
      globeEl.current.controls().autoRotate = false;
      globeEl.current.pointOfView({ lat, lng, altitude: 1.5 }, 1500);
      setSelectedCountry({ name: match.properties.name, lat, lng });
    } else {
      alert('Country not found.');
    }
  };

  const handleCloseSidebar = () => {
    setSelectedCountry(null);
    globeEl.current.controls().autoRotate = true;
    globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 1500);
  };

  const handleModeChange = (e) => {
    const mode = e.target.value;
    setCurrentMode(mode);
    switch (mode) {
      case 'Hide Borders':
        setShowPolygons(false);
        break;
      case 'Show Borders':
        setShowPolygons(true);
        break;
      case 'Start Rotation':
        globeEl.current.controls().autoRotate = true;
        break;
      case 'Stop Rotation':
        globeEl.current.controls().autoRotate = false;
        break;
      default:
        break;
    }
  };

  const filteredModes = allModes.filter((m) => m !== currentMode);

  return (
    <div className="globe-viewer-container">
      {!isReadyToRender && (
        <div className="tutorial-overlay">
          <TutorialScreen />
        </div>
      )}

      <div className="top-controls">
        <div className="left-controls" />
        <div className="right-controls">
          <select className="dropdown-toggle" onChange={handleModeChange} value="">
            <option value="" disabled hidden>{currentMode}</option>
            {filteredModes.map((mode) => (
              <option key={mode} value={mode}>{mode}</option>
            ))}
          </select>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">Go</button>
          </form>
        </div>
      </div>

      {isReadyToRender && (
        <div className="globe-canvas-wrapper">
          <Globe
            ref={globeEl}
            globeImageUrl="/earth_daymap.png"
            backgroundImageUrl="/night-sky.png"
            polygonsData={showPolygons ? countryPolygons : []}
            polygonCapColor={({ properties }) =>
              selectedCountry?.name === properties.name
                ? 'rgba(255,255,255,0.4)'
                : 'rgba(255,255,255,0.02)'
            }
            polygonSideColor={() => 'rgba(255,255,255,0.01)'}
            polygonStrokeColor={({ properties }) =>
              selectedCountry?.name === properties.name
                ? '#ffcc00'
                : 'rgba(255,255,255,0.1)'
            }
            polygonLabel={({ properties: d }) => `Country: ${d.name}`}
            onPolygonClick={showPolygons ? handleCountryClick : undefined}
          />
        </div>
      )}

      {selectedCountry && (
        <CountryInfoSidebar country={selectedCountry} onClose={handleCloseSidebar} />
      )}
    </div>
  );
};

export default GlobeViewer;
