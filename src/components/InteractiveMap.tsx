import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Place, Route } from '../types';

// Исправляем иконки маркеров для Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface InteractiveMapProps {
  places: Place[];
  currentRoute?: Route | null;
  selectedPlace?: Place | null;
  activeTab: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ places, currentRoute, selectedPlace, activeTab }) => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  // Центр Саратова
  const saratovCenter: [number, number] = [51.533562, 46.034266];

  // Создаем кастомные иконки для разных категорий
  const createCustomIcon = (category: string, color: string = '#667eea', isSelected: boolean = false) => {
    const icons: { [key: string]: string } = {
      gastronomy: '🍽️',
      attractions: '🏛️',
      culture: '🎭',
      nature: '🌳',
      interesting: '⭐'
    };

    const size = isSelected ? 45 : 35;
    const selectedColor = isSelected ? '#e74c3c' : color;

    return L.divIcon({
      html: `
        <div style="
          background: ${selectedColor};
          color: white;
          border-radius: 50%;
          width: ${size}px;
          height: ${size}px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${isSelected ? 20 : 16}px;
          border: ${isSelected ? 4 : 3}px solid white;
          box-shadow: 0 ${isSelected ? 4 : 2}px ${isSelected ? 12 : 8}px rgba(0,0,0,${isSelected ? 0.4 : 0.3});
          z-index: ${isSelected ? 1000 : 100};
          ${isSelected ? 'animation: pulse 2s infinite;' : ''}
        ">
          ${icons[category] || '📍'}
        </div>
        ${isSelected ? `
        <style>
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        </style>
        ` : ''}
      `,
      className: `custom-div-icon ${isSelected ? 'selected' : ''}`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
      popupAnchor: [0, -size]
    });
  };

  // Цвета для разных категорий
  const categoryColors: { [key: string]: string } = {
    gastronomy: '#e74c3c',
    attractions: '#3498db',
    culture: '#9b59b6',
    nature: '#27ae60',
    interesting: '#f39c12'
  };

  // Фильтруем места в зависимости от активной вкладки
  const getFilteredPlaces = () => {
    if (activeTab === 'constructor') {
      return currentRoute ? currentRoute.places : [];
    }
    
    const categoryMap: { [key: string]: string } = {
      'gastronomy': 'gastronomy',
      'attractions': 'attractions',
      'culture': 'culture',
      'nature': 'nature'
    };

    const targetCategory = categoryMap[activeTab];
    return targetCategory ? places.filter(p => p.category === targetCategory) : places;
  };

  const filteredPlaces = getFilteredPlaces();

  // Создаем линию маршрута, если есть активный маршрут
  const routeCoordinates = currentRoute ? currentRoute.places.map(p => p.coordinates) : [];

  useEffect(() => {
    if (map && filteredPlaces.length > 0) {
      // Подгоняем карту под все маркеры
      const group = new L.FeatureGroup(
        filteredPlaces.map(place => L.marker(place.coordinates))
      );
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [map, filteredPlaces]);

  // Центрирование карты на выбранном месте (только во вкладке "Места")
  useEffect(() => {
    if (map && selectedPlace && activeTab === 'places') {
      map.setView(selectedPlace.coordinates, 16, {
        animate: true,
        duration: 1
      });
    }
  }, [map, selectedPlace, activeTab]);

  // Отслеживание изменения темы
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'light';
      setCurrentTheme(theme);
    };

    // Проверяем тему при загрузке
    checkTheme();

    // Создаем наблюдатель за изменениями атрибута data-theme
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  // Ресайз карты при изменении размеров окна
  useEffect(() => {
    if (map) {
      const handleResize = () => {
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      };

      window.addEventListener('resize', handleResize);
      // Также вызываем при первом рендере
      handleResize();

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [map]);

  const getRatingStars = (rating: number) => {
    return '⭐'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '⭐' : '');
  };

  return (
    <div className="map-container">
      {currentRoute && (
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          marginBottom: '24px', 
          color: '#f8fafc',
          textAlign: 'center'
        }}>
          🗺️ {currentRoute.name || 'Ваш маршрут'}
        </h2>
      )}
      
      {selectedPlace && !currentRoute && activeTab === 'places' && (
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          marginBottom: '24px', 
          color: '#f8fafc',
          textAlign: 'center'
        }}>
          📍 {selectedPlace.name}
        </h2>
      )}
      
      <MapContainer
        center={saratovCenter}
        zoom={13}
        style={{ height: '500px', width: '100%' }}
        ref={setMap}
      >
                  <TileLayer
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            url={currentTheme === 'dark' 
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            }
            subdomains="abcd"
            maxZoom={19}
            key={currentTheme} // Принудительное обновление при смене темы
          />
        
        {/* Отображаем места или маршрут */}
        {currentRoute ? (
          // Красивая визуализация маршрута
          currentRoute.places.map((place, index) => (
            <React.Fragment key={place.id}>
              {/* Светящийся круг вокруг точки */}
              <Circle
                center={place.coordinates}
                radius={80}
                color={index === 0 ? "#10b981" : index === currentRoute.places.length - 1 ? "#ef4444" : "#3b82f6"}
                fillColor={index === 0 ? "#10b981" : index === currentRoute.places.length - 1 ? "#ef4444" : "#3b82f6"}
                fillOpacity={0.1}
                weight={0}
              />
              
              {/* Основная точка */}
              <Circle
                center={place.coordinates}
                radius={20}
                color="#ffffff"
                fillColor={index === 0 ? "#10b981" : index === currentRoute.places.length - 1 ? "#ef4444" : "#3b82f6"}
                fillOpacity={1}
                weight={4}
              />
              
              {/* Номер точки */}
              <Marker 
                position={place.coordinates}
                icon={L.divIcon({
                  html: `<div style="
                    background: ${index === 0 ? "#10b981" : index === currentRoute.places.length - 1 ? "#ef4444" : "#3b82f6"};
                    color: white;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 16px;
                    border: 4px solid white;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    font-family: 'Inter', sans-serif;
                  ">${index + 1}</div>`,
                  className: 'custom-route-marker',
                  iconSize: [36, 36],
                  iconAnchor: [18, 18]
                })}
              >
                <Popup maxWidth={300}>
                  <div style={{ minWidth: '250px', color: '#1e293b', fontSize: '14px' }}>
                    <h3 style={{ margin: '0 0 12px 0', color: '#1e293b', fontSize: '18px' }}>{place.name}</h3>
                    
                    <div style={{ marginBottom: '12px' }}>
                      {getRatingStars(place.rating)} ({place.rating}/5)
                    </div>
                    
                    <p style={{ margin: '0 0 12px 0', color: '#64748b', lineHeight: '1.4' }}>
                      {place.description}
                    </p>
                    
                    <div style={{ 
                      background: index === 0 ? "#10b981" : index === currentRoute.places.length - 1 ? "#ef4444" : "#3b82f6",
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      display: 'inline-block',
                      marginBottom: '8px'
                    }}>
                      {index === 0 ? '🚀 Старт' : index === currentRoute.places.length - 1 ? '🏁 Финиш' : `Точка ${index + 1}`}
                    </div>

                    {place.businessInfo && (
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
                        {place.businessInfo.phone && (
                          <div style={{ margin: '4px 0' }}>📞 {place.businessInfo.phone}</div>
                        )}
                        {place.businessInfo.workingHours && (
                          <div style={{ margin: '4px 0' }}>🕒 {place.businessInfo.workingHours}</div>
                        )}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))
        ) : (
          // Обычные места
          filteredPlaces.map((place, index) => {
            const isSelected = selectedPlace?.id === place.id && activeTab === 'places';
            return (
              <React.Fragment key={place.id}>
                {/* Светящийся круг для выбранного места (только во вкладке "Места") */}
                {isSelected && (
                  <Circle
                    center={place.coordinates}
                    radius={100}
                    color="#e74c3c"
                    fillColor="#e74c3c"
                    fillOpacity={0.1}
                    weight={2}
                    opacity={0.6}
                  />
                )}
                <Marker
                  position={place.coordinates}
                  icon={createCustomIcon(place.category, categoryColors[place.category], isSelected)}
                >
              <Popup maxWidth={300}>
                <div style={{ minWidth: '250px' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                    {place.name}
                  </h3>
                  
                  <div style={{ marginBottom: '10px' }}>
                    {getRatingStars(place.rating)} ({place.rating}/5)
                  </div>
                  
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem' }}>
                    {place.description}
                  </p>
                  
                  {place.businessInfo && (
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      {place.businessInfo.phone && (
                        <div>📞 {place.businessInfo.phone}</div>
                      )}
                      {place.businessInfo.workingHours && (
                        <div>🕒 {place.businessInfo.workingHours}</div>
                      )}
                      {place.businessInfo.website && (
                        <div>
                          🌐 <a 
                            href={place.businessInfo.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#667eea' }}
                          >
                            Сайт
                          </a>
                        </div>
                      )}
                      {place.businessInfo.isPremium && (
                        <div style={{ 
                          color: '#f39c12', 
                          fontWeight: 'bold',
                          marginTop: '5px' 
                        }}>
                          ⭐ Премиум-партнер
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
            );
          })
        )}
        
        {/* Красивая пунктирная линия маршрута */}
        {routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            color="#3b82f6"
            weight={4}
            opacity={0.7}
            dashArray="15, 10"
            lineCap="round"
            lineJoin="round"
          />
        )}
      </MapContainer>
      
      {currentRoute && (
        <div className="route-info">
          <div className="route-stat">
            <div className="route-stat-value">{currentRoute.distance.toFixed(1)} км</div>
            <div className="route-stat-label">Расстояние</div>
          </div>
          <div className="route-stat">
            <div className="route-stat-value">{Math.round(currentRoute.duration)} мин</div>
            <div className="route-stat-label">Время</div>
          </div>
          <div className="route-stat">
            <div className="route-stat-value">
              {currentRoute.difficulty === 'easy' ? 'Легкий' : 
               currentRoute.difficulty === 'medium' ? 'Средний' : 'Сложный'}
            </div>
            <div className="route-stat-label">Сложность</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
