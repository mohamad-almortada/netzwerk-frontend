import React, { Component } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from 'react-leaflet';
import MiniDrawer from './MiniDrawer';
import '../App.css';
import 'leaflet/dist/leaflet.css';
import DirectionsTransitFilledIcon from '@mui/icons-material/DirectionsTransitFilled';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import L from 'leaflet';
import { useRef, useMemo, useCallback } from 'react';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon.png';
import { renderToStaticMarkup } from 'react-dom/server';
import { useState, useEffect } from 'react';
import apiClient from '../services/httpService';

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';

const createCustomIcon = (ReactIconComponent, backgroundColor) => {
  const iconHTML = renderToStaticMarkup(
    <div
      style={{
        backgroundColor,
        borderRadius: '50%',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ReactIconComponent style={{ color: 'white' }} />
    </div>,
  );

  return L.divIcon({
    html: iconHTML,
    className: 'custom-div-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

const homeIcon = createCustomIcon(DirectionsTransitFilledIcon, '#ffcccb');
const workIcon = createCustomIcon(WorkIcon, '#d3f8e2');
const schoolIcon = createCustomIcon(SchoolIcon, '#add8e6');

const MainMap = () => {
  const [markers, setMarkers] = useState([]);
  const [toDisplayData, setToDisplayData] = useState({});
  const center = {
    lat: 51.505,
    lng: -0.09,
  };

  const [draggable, setDraggable] = useState(false);
  const [position, setPosition] = useState(center);
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    [],
  );
  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d);
  }, []);

  useEffect(() => {
    const getAddresses = async () => {
      try {
        const res = await apiClient.get(
          'http://localhost:5094/api/GeoLocation',
        );
        setMarkers(res.data);
      } catch (err) {
        console.error('Error fetching addresses:', err.message);
      }
    };

    getAddresses();
  }, []);

  // Handle marker click
  const handleMarkerClick = (marker) => {
    apiClient
      .get(`User/${marker.latitude}/${marker.longitude}`)
      .then((res) => {
        const newToDisplayData = {
          typ: marker.typ,
          address: marker.addressName,
          users: Array.isArray(res.data) ? res.data : null,
        };
        setToDisplayData(newToDisplayData);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        padding: '0',
        margin: '0',
        position: 'relative',
      }}
    >
      <MiniDrawer />

      <CssBaseline />
      <Container
        maxWidth="xl"
        style={{
          height: '100%',
          width: 'calc(100vw-20px)',
          padding: '0',
          margin: '0',
        }}
      >
        <MapContainer
          className=""
          center={[51.2562, 7.15]}
          zoom={6}
          attributionControl={false}
          zoomControl={false}
          style={{ height: '100%', width: '100vw', padding: '0', margin: '0' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <div className="my-zoom-control">
            <ZoomControl position="topright" />
          </div>
          {markers &&
            markers.map((marker, index) => (
              <Marker
                position={[marker.latitude, marker.longitude]}
                key={index}
                icon={homeIcon}
                eventHandlers={{
                  click: () => handleMarkerClick(marker),
                }}
              >
                <Popup>
                  {toDisplayData.address && (
                    <div>
                      <h3>{toDisplayData.address}</h3>
                      <p>{toDisplayData.typ}</p>
                      {toDisplayData.users && toDisplayData.users.length > 0 ? (
                        <ul>
                          {toDisplayData.users.map((user, i) => (
                            <li key={i}>{user.name}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>No users found</p>
                      )}
                    </div>
                  )}
                </Popup>
              </Marker>
            ))}
          <Marker
            draggable={draggable}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
          >
            <Popup minWidth={90}>
              <span onClick={toggleDraggable}>
                {draggable
                  ? 'Marker is draggable'
                  : 'Click here to make marker draggable'}
              </span>
            </Popup>
          </Marker>
        </MapContainer>
      </Container>
    </div>
  );
};

export default MainMap;
