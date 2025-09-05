import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Event } from '../types';

interface EventsMapProps {
  events: Event[];
}

const EventsMap: React.FC<EventsMapProps> = ({ events }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [, setMap] = useState<L.Map | null>(null);

  // Центр Саратова
  const saratovCenter: [number, number] = [51.533562, 46.034266];

  // Создаем кастомные иконки для разных категорий событий
  const createEventIcon = (category: string) => {
    const icons: { [key: string]: { emoji: string; color: string } } = {
      culture: { emoji: '🎭', color: '#9b59b6' },
      food: { emoji: '🍽️', color: '#e74c3c' },
      entertainment: { emoji: '🎉', color: '#f39c12' },
      sport: { emoji: '🏃', color: '#27ae60' },
      education: { emoji: '📚', color: '#3498db' }
    };

    const iconData = icons[category] || { emoji: '📅', color: '#95a5a6' };

    return L.divIcon({
      html: `
        <div style="
          background: ${iconData.color};
          color: white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          border: 3px solid white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          animation: pulse 2s infinite;
        ">
          ${iconData.emoji}
        </div>
        <style>
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        </style>
      `,
      className: 'custom-event-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });
  };

  // Фильтруем события по категории
  const filteredEvents = selectedCategory === 'all' 
    ? events.filter(e => e.isActive)
    : events.filter(e => e.isActive && e.category === selectedCategory);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return 'Уточняется';
    return price === 0 ? 'Бесплатно' : `${price} ₽`;
  };

  const getEventStatus = (event: Event) => {
    const now = new Date();
    if (now < event.startDate) {
      return { status: 'upcoming', text: 'Скоро', color: '#3498db' };
    } else if (now >= event.startDate && now <= event.endDate) {
      return { status: 'ongoing', text: 'Идет сейчас', color: '#27ae60' };
    } else {
      return { status: 'ended', text: 'Завершено', color: '#95a5a6' };
    }
  };

  const categories = [
    { id: 'all', name: 'Все события', icon: '📅' },
    { id: 'culture', name: 'Культура', icon: '🎭' },
    { id: 'food', name: 'Еда', icon: '🍽️' },
    { id: 'entertainment', name: 'Развлечения', icon: '🎉' },
    { id: 'sport', name: 'Спорт', icon: '🏃' },
    { id: 'education', name: 'Образование', icon: '📚' }
  ];

  return (
    <div className="events-container">
      {/* Заголовок и статистика */}
      <div className="events-header">
        <div className="header-content">
          <h2 className="events-title">🎪 События Саратова</h2>
          <p className="events-subtitle">
            Актуальные мероприятия города
          </p>
        </div>
        <div className="events-stats">
          <div className="stat-item">
            <span className="stat-number">{events.filter(e => e.isActive).length}</span>
            <span className="stat-label">Всего событий</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{events.filter(e => e.isActive && getEventStatus(e).status === 'ongoing').length}</span>
            <span className="stat-label">Идут сейчас</span>
          </div>
        </div>
      </div>

      {/* Фильтры категорий */}
      <div className="category-filters">
        <div className="filters-header">
          <h3>🏷️ Категории</h3>
          <span className="active-filter-count">
            {selectedCategory === 'all' ? 'Все' : categories.find(c => c.id === selectedCategory)?.name}
          </span>
        </div>
        <div className="filters-grid">
          {categories.map(category => {
            const count = category.id === 'all' 
              ? events.filter(e => e.isActive).length
              : events.filter(e => e.isActive && e.category === category.id).length;
            
            return (
              <button
                key={category.id}
                className={`category-filter ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="filter-icon">{category.icon}</div>
                <div className="filter-content">
                  <span className="filter-name">{category.name}</span>
                  <span className="filter-count">{count}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Карта */}
      <div className="events-map">
        <MapContainer
          center={saratovCenter}
          zoom={13}
          style={{ height: '500px', width: '100%' }}
          ref={setMap}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={19}
          />
          
          {filteredEvents.map((event) => {
            const eventStatus = getEventStatus(event);
            
            return (
              <Marker
                key={event.id}
                position={event.location.coordinates}
                icon={createEventIcon(event.category)}
              >
                <Popup maxWidth={350}>
                  <div className="event-popup">
                    <div className="event-popup-header">
                      <h3>{event.title}</h3>
                      <span 
                        className="event-status" 
                        style={{ backgroundColor: eventStatus.color }}
                      >
                        {eventStatus.text}
                      </span>
                    </div>
                    
                    <div className="event-popup-info">
                      <p><strong>📍 Место:</strong> {event.location.name}</p>
                      <p><strong>📅 Начало:</strong> {formatDate(event.startDate)}</p>
                      <p><strong>⏰ Окончание:</strong> {formatDate(event.endDate)}</p>
                      <p><strong>🎫 Цена:</strong> {formatPrice(event.price)}</p>
                      <p><strong>👥 Участники:</strong> {event.currentParticipants}/{event.maxParticipants || '∞'}</p>
                      <p><strong>🏢 Организатор:</strong> {event.organizer}</p>
                    </div>
                    
                    <div className="event-popup-description">
                      <p>{event.description}</p>
                    </div>
                    
                    <div className="event-popup-actions">
                      <button className="participate-btn">
                        Участвовать
                      </button>
                      <button className="share-btn">
                        Поделиться
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Список событий */}
      <div className="events-list">
        <h3>📋 Список событий</h3>
        <div className="events-grid">
          {filteredEvents.map(event => {
            const eventStatus = getEventStatus(event);
            
            return (
              <div key={event.id} className="event-card">
                <div className="event-card-header">
                  <div className="event-category">
                    {categories.find(c => c.id === event.category)?.icon}
                  </div>
                  <span 
                    className="event-status-badge" 
                    style={{ backgroundColor: eventStatus.color }}
                  >
                    {eventStatus.text}
                  </span>
                </div>
                
                <h4>{event.title}</h4>
                <p className="event-location">📍 {event.location.name}</p>
                <p className="event-date">📅 {formatDate(event.startDate)}</p>
                <p className="event-price">🎫 {formatPrice(event.price)}</p>
                
                <div className="event-participants">
                  <div className="participants-bar">
                    <div 
                      className="participants-fill"
                      style={{
                        width: event.maxParticipants 
                          ? `${(event.currentParticipants / event.maxParticipants) * 100}%`
                          : '0%'
                      }}
                    ></div>
                  </div>
                  <span className="participants-text">
                    {event.currentParticipants}/{event.maxParticipants || '∞'} участников
                  </span>
                </div>
                
                <div className="event-card-actions">
                  <button className="btn-primary">Подробнее</button>
                  <button className="btn-secondary">В избранное</button>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredEvents.length === 0 && (
          <div className="no-events">
            <p>В выбранной категории пока нет активных событий.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsMap;
