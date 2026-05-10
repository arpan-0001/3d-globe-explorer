// src/SidebarSkeleton.jsx
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './CountryInfoSidebar.css'; // for consistent layout

const SidebarSkeleton = ({ countryName }) => {
  return (
    <div className="info-content">
      <h3>{countryName || <Skeleton height={28} width="60%" />}</h3>

      <Skeleton
        height={100}
        width="100%"
        style={{ borderRadius: '8px', marginBottom: '12px' }}
      />

      <div className="skeleton-line"><Skeleton height={16} width="80%" /></div>
      <div className="skeleton-line"><Skeleton height={16} width="70%" /></div>
      <div className="skeleton-line"><Skeleton height={16} width="85%" /></div>
      <div className="skeleton-line"><Skeleton height={16} width="60%" /></div>
      <div className="skeleton-line"><Skeleton height={16} width="90%" /></div>
      <div className="skeleton-line"><Skeleton height={16} width="75%" /></div>
      <div className="skeleton-line"><Skeleton height={16} width="75%" /></div>
    </div>
  );
};

export default SidebarSkeleton;
