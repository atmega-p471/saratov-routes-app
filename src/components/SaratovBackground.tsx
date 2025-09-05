import React, { useState, useEffect, useCallback } from 'react';
import { saratovBackgrounds, getCurrentTimeOfDay, getBackgroundByTime, SaratovBackgroundData } from '../data/saratovBackgrounds';

interface SaratovBackgroundProps {
  children: React.ReactNode;
  activeTab?: string;
}

const SaratovBackground: React.FC<SaratovBackgroundProps> = ({ children, activeTab }) => {
  const [currentBackground, setCurrentBackground] = useState<SaratovBackgroundData>(() => {
    // Инициализация фона в зависимости от времени суток
    const timeOfDay = getCurrentTimeOfDay();
    return getBackgroundByTime(timeOfDay);
  });
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);

  // Предзагрузка изображений
  useEffect(() => {
    const preloadImages = () => {
      saratovBackgrounds.forEach(bg => {
        const img = new Image();
        img.src = bg.imageUrl;
      });
    };
    
    preloadImages();
  }, []);

  // Загрузка текущего изображения
  useEffect(() => {
    setImageLoaded(false);
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(false); // Используем градиент как fallback
    img.src = currentBackground.imageUrl;
  }, [currentBackground]);

  // Смена фона каждые 30 секунд (только в конструкторе)
  useEffect(() => {
    if (activeTab !== 'constructor') return;
    
    const interval = setInterval(() => {
      const timeOfDay = getCurrentTimeOfDay();
      const newBackground = getBackgroundByTime(timeOfDay);
      if (newBackground.id !== currentBackground.id) {
        setCurrentBackground(newBackground);
      }
    }, 30000); // 30 секунд

    return () => clearInterval(interval);
  }, [activeTab, currentBackground]);

  const handleBackgroundChange = useCallback((background: SaratovBackgroundData) => {
    setCurrentBackground(background);
    setShowBackgroundSelector(false);
  }, []);

  // Показываем селектор фонов только в конструкторе
  const showSelector = activeTab === 'constructor';

  return (
    <div className="saratov-background">
      {/* Фоновое изображение или градиент */}
      <div 
        className={`background-layer ${imageLoaded ? 'image-loaded' : 'gradient-fallback'} ${
          currentBackground.timeOfDay === 'night' ? 'night-panorama' : ''
        }`}
        style={{
          backgroundImage: imageLoaded 
            ? `url(${currentBackground.imageUrl})` 
            : currentBackground.gradient,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Оверлей для лучшей читаемости */}
      <div className="background-overlay" />
      
      {/* Селектор фонов (только в конструкторе) */}
      {showSelector && (
        <div className="background-controls">
          <button 
            className="background-toggle-btn"
            onClick={() => setShowBackgroundSelector(!showBackgroundSelector)}
            title="Изменить панорамный фон Саратова"
          >
            🏙️
          </button>
          
          {showBackgroundSelector && (
            <div className="background-selector">
              <h4 className="selector-title">Панорамы Саратова</h4>
              <p className="selector-description">
                Красивые виды города для вашего конструктора
              </p>
              {currentBackground.id === 'night-panorama-1' && (
                <div className="special-panorama-note">
                  ✨ Реальная ночная панорама с мостом через Волгу
                </div>
              )}
              <div className="background-options">
                {saratovBackgrounds.map(bg => (
                  <div
                    key={bg.id}
                    className={`background-option ${currentBackground.id === bg.id ? 'active' : ''}`}
                    onClick={() => handleBackgroundChange(bg)}
                    style={{
                      backgroundImage: `url(${bg.imageUrl}), ${bg.gradient}`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="option-overlay">
                      <div className="option-info">
                        <span className="option-name">{bg.name}</span>
                        <span className="option-time">
                          {bg.timeOfDay === 'night' ? '🌙' : 
                           bg.timeOfDay === 'evening' ? '🌆' : '☀️'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Контент приложения */}
      <div className="app-content">
        {children}
      </div>
    </div>
  );
};

export default SaratovBackground;
