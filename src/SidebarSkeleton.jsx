import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useMediaQuery } from "react-responsive";
import "./CountryInfoSidebar.css";

const SidebarSkeleton = ({ countryName }) => {
  const isMobile = useMediaQuery({ maxWidth: 600 });

  return (
    <SkeletonTheme
      baseColor="#2a2a2a"
      highlightColor="#3a3a3a"
    >
      {isMobile ? (
        // ===== MOBILE =====
        <div className="bottom-sheet-content">
          <div className="sheet-handle" />

          <h2>{countryName || <Skeleton width={180} />}</h2>

          <Skeleton
            height={120}
            borderRadius={10}
            style={{ marginBottom: 20 }}
          />

          <div className="info-row">
            <span>🏛 Capital</span>
            <Skeleton inline width={120} />
          </div>

          <div className="info-row">
            <span>🌍 Region</span>
            <Skeleton inline width={110} />
          </div>

          <div className="info-row">
            <span>👥 Population</span>
            <Skeleton inline width={140} />
          </div>

          <div className="info-row">
            <span>🗣 Languages</span>
            <Skeleton inline width={120} />
          </div>

          <div className="info-row">
            <span>🕒 Timezone</span>
            <Skeleton inline width={140} />
          </div>

          <div className="info-row">
            <span>📅 Date</span>
            <Skeleton inline width={100} />
          </div>

          <div className="info-row">
            <span>⏰ Local Time</span>
            <Skeleton inline width={90} />
          </div>

          <div className="info-row">
            <span>☀ Weather</span>
            <Skeleton inline width={130} />
          </div>
        </div>
      ) : (
        // ===== DESKTOP =====
        <div className="info-content">
          <h3>{countryName || <Skeleton width={180} />}</h3>

          <Skeleton
            height={100}
            borderRadius={8}
            style={{ marginBottom: 18 }}
          />

          <p><strong>Capital:</strong> <Skeleton inline width={120} /></p>
          <p><strong>Region:</strong> <Skeleton inline width={120} /></p>
          <p><strong>Population:</strong> <Skeleton inline width={140} /></p>
          <p><strong>Languages:</strong> <Skeleton inline width={120} /></p>
          <p><strong>Timezone:</strong> <Skeleton inline width={150} /></p>
          <p><strong>Date:</strong> <Skeleton inline width={110} /></p>
          <p><strong>Local Time:</strong> <Skeleton inline width={90} /></p>
          <p><strong>Weather:</strong> <Skeleton inline width={130} /></p>
        </div>
      )}
    </SkeletonTheme>
  );
};

export default SidebarSkeleton;