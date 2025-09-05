import React, { useState, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import InteractiveMap from './components/InteractiveMap';
import QRScanner from './components/QRScanner';
import PDFExporter from './components/PDFExporter';
// import RouteConstructor from './components/RouteConstructor'; // Не используется
import { Tag, Route, Place, UserStats, CollectionItem, TabCategory, Quest, UserLevel, LeaderboardEntry, Event } from './types';
import { achievements, predefinedRoutes } from './data/saratovData';
import { userLevels, sampleQuests, sampleLeaderboard, sampleEvents, getUserLevel } from './data/gameData';
import { placesApi, tagsApi } from './services/api';
import PersonalCabinet from './components/PersonalCabinet';
import EventsMap from './components/EventsMap';
import SaratovBackground from './components/SaratovBackground';
import './index.css';

const App: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [activeTab, setActiveTab] = useState<string>('constructor');
  const [activeCabinetTab, setActiveCabinetTab] = useState<'profile' | 'collection' | 'quests' | 'leaderboard' | 'settings'>('profile');
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [tabCategories, setTabCategories] = useState<TabCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // const [showSearch, setShowSearch] = useState<boolean>(false); // Не используется
  const [panelExpanded, setPanelExpanded] = useState<boolean>(false);
  const [showCollection, setShowCollection] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  
  const [userStats, setUserStats] = useState<UserStats>({
    totalScanned: 0,
    routesCompleted: 0,
    distanceWalked: 0,
    achievements: achievements.map(a => ({ ...a })),
    coupons: []
  });
  
  const [completedQuests] = useState<Quest[]>([]);
  const [allQuests] = useState<Quest[]>(sampleQuests);
  const [currentUserLevel, setCurrentUserLevel] = useState<UserLevel>(userLevels[0]);
  const [leaderboard] = useState<LeaderboardEntry[]>(sampleLeaderboard);
  const [events] = useState<Event[]>(sampleEvents);
  const [userId] = useState<string>(() => {
    let id = localStorage.getItem('saratov-user-id');
    if (!id) {
      id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('saratov-user-id', id);
    }
    return id;
  });

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showMenu && !target.closest('.menu-dropdown') && !target.closest('.menu-btn')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  // Сброс выбранного места при смене вкладки
  useEffect(() => {
    if (activeTab !== 'places' && selectedPlace) {
      setSelectedPlace(null);
    }
  }, [activeTab, selectedPlace]);

  // Инициализация темы при запуске приложения
  useEffect(() => {
    const savedTheme = localStorage.getItem('saratov-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Загружаем данные при запуске
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Загружаем места и теги из API
        const [placesData, tagsData] = await Promise.all([
          placesApi.getPlaces(),
          tagsApi.getTags()
        ]);

        setPlaces(placesData);
        setAllTags(tagsData);

        // Создаем категории для вкладок
        const categories: TabCategory[] = [
          { id: 'gastronomy', name: 'Гастрономия', icon: '🍽️' },
          { id: 'attractions', name: 'Достопримечательности', icon: '🏛️' },
          { id: 'culture', name: 'Культура', icon: '🎭' },
          { id: 'nature', name: 'Природа', icon: '🌳' }
        ];
        setTabCategories(categories);

      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        // Используем fallback данные из saratovData.ts
        const { places: fallbackPlaces, tags: fallbackTags } = await import('./data/saratovData');
        setPlaces(fallbackPlaces);
        setAllTags(fallbackTags);
        
        const categories: TabCategory[] = [
          { id: 'gastronomy', name: 'Гастрономия', icon: '🍽️' },
          { id: 'attractions', name: 'Достопримечательности', icon: '🏛️' },
          { id: 'culture', name: 'Культура', icon: '🎭' },
          { id: 'nature', name: 'Природа', icon: '🌳' }
        ];
        setTabCategories(categories);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Загружаем сохраненные данные из localStorage
  useEffect(() => {
    const savedCollection = localStorage.getItem('saratov-collection');
    if (savedCollection) {
      try {
        setCollection(JSON.parse(savedCollection));
      } catch (error) {
        console.error('Ошибка загрузки коллекции:', error);
      }
    }

    const savedStats = localStorage.getItem('saratov-user-stats');
    if (savedStats) {
      try {
        setUserStats(JSON.parse(savedStats));
      } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
      }
    }

    const savedQuests = localStorage.getItem('saratov-completed-quests');
    if (savedQuests) {
      try {
        // Здесь можно загрузить квесты если нужно
      } catch (error) {
        console.error('Ошибка загрузки квестов:', error);
      }
    }
  }, []);

  // Обновляем уровень пользователя
  useEffect(() => {
    const totalPoints = userStats.totalScanned * 10 + 
                       userStats.routesCompleted * 50 + 
                       Math.floor(userStats.distanceWalked) * 2 +
                       completedQuests.length * 25;
    
    const newLevel = getUserLevel(totalPoints);
    setCurrentUserLevel(newLevel);
  }, [userStats, completedQuests]);

  // Сохраняем данные в localStorage
  useEffect(() => {
    localStorage.setItem('saratov-collection', JSON.stringify(collection));
  }, [collection]);

  useEffect(() => {
    localStorage.setItem('saratov-user-stats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('saratov-completed-quests', JSON.stringify(completedQuests));
  }, [completedQuests]);

  // Простая оптимизация маршрута (алгоритм ближайшего соседа)
  const optimizeRoute = useCallback((places: Place[]): Place[] => {
    if (places.length <= 1) return places;

    const optimized: Place[] = [places[0]];
    const remaining = [...places.slice(1)];

    while (remaining.length > 0) {
      const current = optimized[optimized.length - 1];
      let nearestIndex = 0;
      let nearestDistance = getDistance(current.coordinates, remaining[0].coordinates);

      for (let i = 1; i < remaining.length; i++) {
        const distance = getDistance(current.coordinates, remaining[i].coordinates);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }

      optimized.push(remaining[nearestIndex]);
      remaining.splice(nearestIndex, 1);
    }

    return optimized;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Расчет расстояния между двумя точками
  const getDistance = useCallback((coord1: [number, number], coord2: [number, number]): number => {
    const R = 6371; // Радиус Земли в км
    const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
    const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  // Расчет общего расстояния маршрута
  const calculateRouteDistance = useCallback((places: Place[]): number => {
    if (places.length <= 1) return 0;
    
    let totalDistance = 0;
    for (let i = 0; i < places.length - 1; i++) {
      totalDistance += getDistance(places[i].coordinates, places[i + 1].coordinates);
    }
    return totalDistance;
  }, [getDistance]);

  // Расчет времени прохождения маршрута
  const calculateRouteDuration = useCallback((distance: number, format?: string): number => {
    const baseSpeed = format === 'active' ? 5 : format === 'leisurely' ? 3 : 4; // км/ч
    const walkingTime = (distance / baseSpeed) * 60; // минуты
    const sightseeingTime = currentRoute ? currentRoute.places.length * 20 : 0; // 20 мин на место
    return walkingTime + sightseeingTime;
  }, [currentRoute]);

  // Генерация маршрута на основе выбранных тегов
  const generateRoute = useCallback((tags?: Tag[]) => {
    const tagsToUse = tags || selectedTags;
    if (tagsToUse.length === 0) return;

    // Фильтруем места по тегам
    const matchingPlaces = places.filter(place => 
      tagsToUse.some(tag => place.tags.includes(tag.id))
    );

    if (matchingPlaces.length === 0) {
      alert('Не найдено мест, соответствующих выбранным критериям');
      return;
    }

    // Берем до 8 мест для оптимального маршрута
    const routePlaces = matchingPlaces.slice(0, 8);
    
    // Оптимизируем порядок посещения
    const optimizedPlaces = optimizeRoute(routePlaces);
    
    // Рассчитываем параметры маршрута
    const distance = calculateRouteDistance(optimizedPlaces);
    const formatTag = selectedTags.find(tag => tag.category === 'formats');
    const duration = calculateRouteDuration(distance, formatTag?.id);
    
    // Определяем сложность
    let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
    if (distance < 2) difficulty = 'easy';
    else if (distance > 5) difficulty = 'hard';

    const route: Route = {
      id: `route-${Date.now()}`,
      name: `Маршрут "${tagsToUse.map(t => t.name).join(', ')}"`,
      places: optimizedPlaces,
      distance,
      duration,
      difficulty,
      tags: tagsToUse.map(t => t.id),
      description: `Персонализированный маршрут по ${optimizedPlaces.length} местам`
    };

    setCurrentRoute(route);
    setActiveTab('constructor');

    // Обновляем статистику
    const newStats = { ...userStats };
    newStats.routesCompleted += 1;
    setUserStats(newStats);
  }, [selectedTags, userStats, places, optimizeRoute, calculateRouteDistance, calculateRouteDuration]);

  // Обработка выбора тегов
  const handleTagSelect = (tag: Tag) => {
    setSelectedTags(prev => {
      const isSelected = prev.some(t => t.id === tag.id);
      if (isSelected) {
        return prev.filter(t => t.id !== tag.id);
      } else {
        return [...prev, tag];
      }
    });
  };

  // Очистка маршрута
  const clearRoute = () => {
    setCurrentRoute(null);
    setSelectedTags([]);
  };

  // Функция для показа готового маршрута на карте
  const showPredefinedRoute = useCallback((predefinedRoute: typeof predefinedRoutes[0]) => {
    const route: Route = {
      id: predefinedRoute.id,
      name: predefinedRoute.name,
      places: predefinedRoute.places,
      distance: calculateRouteDistance(predefinedRoute.places),
      duration: predefinedRoute.duration,
      difficulty: predefinedRoute.difficulty,
      tags: predefinedRoute.tags,
      description: predefinedRoute.description,
      createdAt: new Date()
    };
    
    setCurrentRoute(route);
    setSelectedPlace(null); // Сбрасываем выбранное место
    
    // Переключаемся на вкладку конструктор для показа маршрута на карте
    setActiveTab('constructor');
  }, [calculateRouteDistance]);

  // Функция для показа места на карте (без переключения вкладки)
  const showPlaceOnMap = useCallback((place: Place) => {
    // Если выбираем то же место - сбрасываем выбор
    if (selectedPlace?.id === place.id) {
      setSelectedPlace(null);
    } else {
      setSelectedPlace(place);
    }
    setCurrentRoute(null); // Сбрасываем текущий маршрут
    // НЕ переключаем вкладку - остаемся во вкладке "Места"
  }, [selectedPlace]);

  // Фильтрация мест по категории
  const getPlacesByCategory = (category: string): Place[] => {
    return places.filter(place => place.category === category);
  };

  // Получение тегов по категории
  const getTagsByCategory = (category: string): Tag[] => {
    return allTags.filter(tag => tag.category === category);
  };

  if (loading) {
    return (
      <div className="app">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div className="loading-spinner"></div>
          <p style={{ color: '#bdc3c7', fontSize: '1.125rem' }}>
            Загружаем данные о Саратове...
          </p>
        </div>
      </div>
    );
  }

  return (
    <SaratovBackground activeTab={activeTab}>
      <DndProvider backend={HTML5Backend}>
        <div className="app">
        {/* Header */}
        <header className="header">
          <div className="header-logo">
            <img 
              src="/images/saratov-coat-of-arms.svg" 
              alt="Герб Саратова" 
              className="coat-of-arms"
            />
            <h1 className="header-title">Собери свой Саратов</h1>
          </div>
          <button 
            className="menu-btn" 
            onClick={() => setShowMenu(!showMenu)}
            title="Меню"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
            </svg>
          </button>
        </header>

        {/* Search Panel removed - not needed */}

        {/* Menu Dropdown */}
        <div 
          className={`menu-dropdown ${showMenu ? 'active' : ''}`}
          style={{
            display: showMenu ? 'block' : 'none',
            position: 'absolute',
            top: '60px',
            right: '0',
            width: '320px',
            background: '#1a1f35',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '0 0 16px 16px',
            zIndex: 1000
          }}
        >
          <div className="menu-content">
            <div className="menu-header">
              <div className="user-info">
                <div className="user-avatar">
                  <span>{currentUserLevel.icon}</span>
                </div>
                <div className="user-details">
                  <h3>Исследователь</h3>
                  <p>{currentUserLevel.name}</p>
                </div>
              </div>
              <button 
                className="menu-close"
                onClick={() => setShowMenu(false)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                </svg>
              </button>
            </div>
            
            <div className="menu-items">
              <button 
                className={`menu-item ${activeTab === 'cabinet' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('cabinet');
                  setShowMenu(false);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H9V3H13V7H21V9M4 7V9H2V7H4M2 11V13H4V11H2M4 15V17H2V15H4M6 21V19H4V21H6M8 21V19H6V21H8M10 21V19H8V21H10M12 21V19H10V21H12Z"></path>
                </svg>
                <span>Кабинет</span>
                <div className="menu-badge">{currentUserLevel.level}</div>
              </button>
              
              <button 
                className={`menu-item ${activeTab === 'events' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('events');
                  setShowMenu(false);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"></path>
                </svg>
                <span>События</span>
                <div className="menu-badge">{events.length}</div>
              </button>
              
              <div className="menu-divider"></div>
              
              <button 
                className="menu-item"
                onClick={() => {
                  setActiveTab('cabinet');
                  setActiveCabinetTab('collection');
                  setShowMenu(false);
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <span>Моя коллекция</span>
                <div className="menu-badge">{collection.length}</div>
              </button>
              
              <button 
                className="menu-item"
                onClick={() => {
                  setActiveTab('cabinet');
                  setActiveCabinetTab('settings');
                  setShowMenu(false);
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"></path>
                </svg>
                <span>Настройки</span>
              </button>
            </div>
            
            <div className="menu-stats">
              <div className="stat-item">
                <span className="stat-label">Места</span>
                <span className="stat-value">{userStats.totalScanned}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Маршруты</span>
                <span className="stat-value">{userStats.routesCompleted}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Расстояние</span>
                <span className="stat-value">{userStats.distanceWalked.toFixed(1)}км</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="main-layout">
          {/* Map Container */}
          <div className="map-container">
                      <InteractiveMap
            places={places}
            currentRoute={currentRoute}
            selectedPlace={selectedPlace}
            activeTab={activeTab}
          />
            
            {/* Map Controls */}
            <div className="map-controls">
              <button className="control-btn" title="Слои">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"></path>
                </svg>
              </button>
              <button className="control-btn" title="Моё местоположение">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"></path>
                </svg>
              </button>
              <button className="control-btn" title="Полный экран">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Bottom Panel (Mobile) / Side Panel (Desktop) */}
          <div className={`bottom-panel ${panelExpanded ? 'expanded' : ''}`}>
            <div 
              className="panel-handle"
              onClick={() => setPanelExpanded(!panelExpanded)}
            ></div>
            
            <div className="panel-header">
              <h2 className="panel-title">
                {activeTab === 'constructor' ? 'Конструктор маршрутов' : 
                 activeTab === 'places' ? 'Места' :
                 activeTab === 'routes' ? 'Готовые маршруты' :
                 activeTab === 'cabinet' ? 'Личный кабинет' : 
                 activeTab === 'events' ? 'События' : 'Места'}
              </h2>
              <p className="panel-subtitle">
                {activeTab === 'constructor' ? 'Создайте уникальный маршрут' : 
                 activeTab === 'places' ? 'Интересные места Саратова' :
                 activeTab === 'routes' ? 'Готовые маршруты для прогулок' :
                 activeTab === 'cabinet' ? 'Ваша статистика и коллекция' :
                 activeTab === 'events' ? 'События в городе' : 'Исследуйте город'}
              </p>
            </div>

            <div className="panel-content">
              {/* Tab Navigation */}
              <div className="tab-nav">
                <button 
                  className={`tab-btn ${activeTab === 'constructor' ? 'active' : ''}`}
                  onClick={() => setActiveTab('constructor')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  Конструктор
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'places' ? 'active' : ''}`}
                  onClick={() => setActiveTab('places')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
                  </svg>
                  Места
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'routes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('routes')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 15l-6 6-1.42-1.42L15.17 16H4V4h2v10h9.17l-3.59-3.58L13 9l6 6z"></path>
                  </svg>
                  Маршруты
                </button>
              </div>

              {/* Constructor Tab */}
              <div className={`tab-content ${activeTab === 'constructor' ? 'active' : ''}`}>
                {/* Selected Tags */}
                <div className="selected-tags">
                  {selectedTags.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
                      Выберите теги для создания маршрута
                    </p>
                  ) : (
                    selectedTags.map(tag => (
                      <div key={tag.id} className="selected-tag">
                        <span>{tag.icon}</span>
                        <span>{tag.name}</span>
                        <button 
                          className="remove-btn"
                          onClick={() => handleTagSelect(tag)}
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Categories */}
                <div className="category-section">
                  <div className="category-header">
                    <h3 className="category-title">
                      <span className="category-icon">👥</span>
                      Персоналии
                    </h3>
                  </div>
                  <div className="tags-grid">
                    {getTagsByCategory('personalities').map(tag => (
                      <div 
                        key={tag.id}
                        className={`tag-card ${selectedTags.some(t => t.id === tag.id) ? 'selected' : ''}`}
                        onClick={() => handleTagSelect(tag)}
                      >
                        <div className="tag-icon">{tag.icon}</div>
                        <div className="tag-text">{tag.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="category-section">
                  <div className="category-header">
                    <h3 className="category-title">
                      <span className="category-icon">🎯</span>
                      Темы
                    </h3>
                  </div>
                  <div className="tags-grid">
                    {getTagsByCategory('themes').map(tag => (
                      <div 
                        key={tag.id}
                        className={`tag-card ${selectedTags.some(t => t.id === tag.id) ? 'selected' : ''}`}
                        onClick={() => handleTagSelect(tag)}
                      >
                        <div className="tag-icon">{tag.icon}</div>
                        <div className="tag-text">{tag.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="category-section">
                  <div className="category-header">
                    <h3 className="category-title">
                      <span className="category-icon">🚶</span>
                      Формат
                    </h3>
                  </div>
                  <div className="tags-grid">
                    {getTagsByCategory('formats').map(tag => (
                      <div 
                        key={tag.id}
                        className={`tag-card ${selectedTags.some(t => t.id === tag.id) ? 'selected' : ''}`}
                        onClick={() => handleTagSelect(tag)}
                      >
                        <div className="tag-icon">{tag.icon}</div>
                        <div className="tag-text">{tag.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                  <button className="btn btn-secondary" onClick={clearRoute}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
                    </svg>
                    Очистить
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => generateRoute()}
                    disabled={selectedTags.length === 0}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    Создать маршрут
                  </button>
                </div>

                {currentRoute && (
                  <div className="route-created">
                    <div className="route-success">
                      <h3 className="route-title">🗺️ Маршрут создан!</h3>
                      <div className="route-info-grid">
                        <div className="route-info-item">
                          <span className="route-info-icon">📍</span>
                          <div>
                            <div className="route-info-value">{currentRoute.places.length}</div>
                            <div className="route-info-label">мест</div>
                          </div>
                        </div>
                        <div className="route-info-item">
                          <span className="route-info-icon">📏</span>
                          <div>
                            <div className="route-info-value">{currentRoute.distance.toFixed(1)} км</div>
                            <div className="route-info-label">расстояние</div>
                          </div>
                        </div>
                        <div className="route-info-item">
                          <span className="route-info-icon">⏱️</span>
                          <div>
                            <div className="route-info-value">{Math.round(currentRoute.duration)} мин</div>
                            <div className="route-info-label">время</div>
                          </div>
                        </div>
                        <div className="route-info-item">
                          <span className="route-info-icon">
                            {currentRoute.difficulty === 'easy' ? '😌' : 
                             currentRoute.difficulty === 'medium' ? '🚶' : '🏃'}
                          </span>
                          <div>
                            <div className="route-info-value">
                              {currentRoute.difficulty === 'easy' ? 'Легкий' : 
                               currentRoute.difficulty === 'medium' ? 'Средний' : 'Сложный'}
                            </div>
                            <div className="route-info-label">сложность</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="route-places-preview">
                        <h4 className="preview-title">Места в маршруте:</h4>
                        <div className="places-preview-list">
                          {currentRoute.places.map((place, index) => (
                            <div key={place.id} className="place-preview-item">
                              <span className="place-number">{index + 1}</span>
                              <div className="place-preview-info">
                                <div className="place-preview-name">{place.name}</div>
                                <div className="place-preview-rating">
                                  ⭐ {place.rating}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="action-buttons">
                      <PDFExporter 
                        route={currentRoute} 
                        onExport={() => console.log('Маршрут экспортирован')} 
                      />
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => setCurrentRoute(null)}
                        style={{ marginLeft: 'var(--space-2)' }}
                      >
                        Создать новый
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Places Tab */}
              <div className={`tab-content ${activeTab === 'places' ? 'active' : ''}`}>
                {tabCategories.map(category => (
                  <div key={category.id} className="category-section">
                    <div className="category-header">
                      <h3 className="category-title">
                        <span className="category-icon">{category.icon}</span>
                        {category.name}
                      </h3>
                      <button type="button" className="show-all-btn">Показать все</button>
                    </div>
                    <div className="places-list">
                      {getPlacesByCategory(category.id).slice(0, 3).map(place => (
                        <div 
                          key={place.id} 
                          className={`place-card ${selectedPlace?.id === place.id ? 'place-selected' : ''}`}
                          onClick={() => showPlaceOnMap(place)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="place-header">
                            <div className="place-name">{place.name}</div>
                            <div className="place-rating">
                              <span>⭐</span>
                              <span>{place.rating}</span>
                            </div>
                          </div>
                          <div className="place-category">{category.name}</div>
                          <div className="place-description">{place.description}</div>
                          <div className="place-address">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
                            </svg>
                            <span>Саратов</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Routes Tab */}
              <div className={`tab-content ${activeTab === 'routes' ? 'active' : ''}`}>
                <div className="category-section">
                  <div className="category-header">
                    <h3 className="category-title">
                      <span className="category-icon">🗺️</span>
                      Готовые маршруты
                    </h3>
                  </div>
                  <div className="places-list">
                    {predefinedRoutes.map(route => (
                      <div 
                        key={route.id} 
                        className="place-card route-card"
                        onClick={() => showPredefinedRoute(route)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="place-header">
                          <div className="place-name">{route.name}</div>
                          <div className="place-rating">
                            <span>⭐</span>
                            <span>{route.rating}</span>
                          </div>
                        </div>
                        <div className="place-category">{route.category}</div>
                        <div className="place-description">{route.description}</div>
                        <div className="place-address">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
                          </svg>
                          <span>{route.places.length} мест • {Math.round(route.duration / 60)} ч</span>
                        </div>
                        <div className="route-difficulty">
                          <span className={`difficulty-badge ${route.difficulty}`}>
                            {route.difficulty === 'easy' ? 'Легкий' : 
                             route.difficulty === 'medium' ? 'Средний' : 'Сложный'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cabinet Tab */}
              <div className={`tab-content ${activeTab === 'cabinet' ? 'active' : ''}`}>
                <PersonalCabinet
                  userStats={userStats}
                  collection={collection}
                  userLevel={currentUserLevel}
                  completedQuests={completedQuests}
                  activeQuests={allQuests.filter(quest => quest.isActive)}
                  leaderboard={leaderboard}
                  userId={userId}
                  initialActiveTab={activeCabinetTab}
                />
              </div>

              {/* Events Tab */}
              <div className={`tab-content ${activeTab === 'events' ? 'active' : ''}`}>
                <EventsMap events={events} />
              </div>
            </div>
          </div>
        </div>

        {/* QR Scanner */}
        <QRScanner
          userStats={userStats}
          onStatsUpdate={setUserStats}
          collection={collection}
          onCollectionUpdate={setCollection}
          places={places}
          showCollection={showCollection}
          onCollectionToggle={setShowCollection}
        />
              </div>
      </DndProvider>
    </SaratovBackground>
  );
};

export default App;