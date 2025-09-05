import React, { useState, useEffect } from 'react';
import { UserStats, CollectionItem, Quest, UserLevel, LeaderboardEntry } from '../types';

interface PersonalCabinetProps {
  userStats: UserStats;
  collection: CollectionItem[];
  userLevel: UserLevel;
  completedQuests: Quest[];
  activeQuests?: Quest[];
  leaderboard: LeaderboardEntry[];
  userId: string;
  initialActiveTab?: 'profile' | 'collection' | 'quests' | 'leaderboard' | 'settings';
}

const PersonalCabinet: React.FC<PersonalCabinetProps> = ({
  userStats,
  collection,
  userLevel,
  completedQuests,
  activeQuests = [],
  leaderboard,
  userId,
  initialActiveTab = 'profile'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'collection' | 'quests' | 'leaderboard' | 'settings'>(initialActiveTab);
  const [achievementsExpanded, setAchievementsExpanded] = useState<boolean>(false);

  // Обновляем активную вкладку при изменении пропса
  useEffect(() => {
    setActiveSubTab(initialActiveTab);
  }, [initialActiveTab]);

  // Получаем текущую тему из localStorage или устанавливаем светлую по умолчанию
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('saratov-theme') as 'light' | 'dark';
    return savedTheme || 'light';
  });

  // Применяем тему при загрузке компонента
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  // Функция переключения темы
  const handleThemeChange = (theme: 'light' | 'dark') => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('saratov-theme', theme);
  };

  const getUserRank = () => {
    const userIndex = leaderboard.findIndex(entry => entry.userId === userId);
    return userIndex !== -1 ? userIndex + 1 : null;
  };

  const getProgressToNextLevel = () => {
    const currentPoints = userStats.achievements.reduce((sum, a) => sum + (a.unlockedAt ? 100 : 0), 0) + 
                         userStats.totalScanned * 10 + 
                         userStats.routesCompleted * 50;
    
    const progress = ((currentPoints - userLevel.minPoints) / (userLevel.maxPoints - userLevel.minPoints)) * 100;
    return Math.min(progress, 100);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'gastronomy': '🍽️',
      'culture': '🎭',
      'attractions': '🏛️',
      'nature': '🌳',
      'architecture': '🏗️'
    };
    return icons[category] || '📍';
  };

  const subTabs = [
    { id: 'profile', name: 'Профиль', icon: '👤' },
    { id: 'collection', name: 'Коллекция', icon: '🏆' },
    { id: 'quests', name: 'Квесты', icon: '🎯' },
    { id: 'leaderboard', name: 'Рейтинг', icon: '🏅' },
    { id: 'settings', name: 'Настройки', icon: '⚙️' }
  ];

  return (
    <div className="personal-cabinet">
      {/* Tabs */}
      <div className="cabinet-tabs">
        {subTabs.map(tab => (
          <button
            key={tab.id}
            className={`cabinet-tab ${activeSubTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveSubTab(tab.id as any)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-name">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="cabinet-content">
        {activeSubTab === 'profile' && (
          <div className="profile-section">
            {/* User Card */}
            <div className="user-card">
              <div className="user-avatar">
                <span className="avatar-icon" style={{ backgroundColor: userLevel.color }}>
                  {userLevel.badge}
                </span>
              </div>
              <div className="user-info">
                <h2 className="user-name">Исследователь #{getUserRank() || '?'}</h2>
                <p className="user-level">{userLevel.name} • Уровень {userLevel.level}</p>
                <div className="level-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${getProgressToNextLevel()}%`,
                        backgroundColor: userLevel.color
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {Math.round(getProgressToNextLevel())}% до следующего уровня
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📍</div>
                <div className="stat-content">
                  <h3 className="stat-number">{userStats.totalScanned}</h3>
                  <p className="stat-label">Мест посещено</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🗺️</div>
                <div className="stat-content">
                  <h3 className="stat-number">{userStats.routesCompleted}</h3>
                  <p className="stat-label">Маршрутов</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🚶</div>
                <div className="stat-content">
                  <h3 className="stat-number">{userStats.distanceWalked.toFixed(1)} км</h3>
                  <p className="stat-label">Пройдено</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-content">
                  <h3 className="stat-number">{userStats.achievements.filter(a => a.unlockedAt).length}</h3>
                  <p className="stat-label">Достижений</p>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="section">
              <div 
                className="achievements-header"
                onClick={() => setAchievementsExpanded(!achievementsExpanded)}
              >
                <h3 className="section-title">🏆 Достижения</h3>
                <div className="achievements-summary">
                  <span className="achievements-count">
                    {userStats.achievements.filter(a => a.unlockedAt).length}/{userStats.achievements.length}
                  </span>
                  <button className="expand-btn">
                    {achievementsExpanded ? '▲' : '▼'}
                  </button>
                </div>
              </div>
              
              {achievementsExpanded && (
                <div className="achievements-dropdown">
                  <div className="achievements-grid">
                    {userStats.achievements.map(achievement => (
                      <div 
                        key={achievement.id} 
                        className={`achievement-card ${achievement.unlockedAt ? 'unlocked' : 'locked'}`}
                      >
                        <div className="achievement-icon">{achievement.icon}</div>
                        <div className="achievement-info">
                          <h4 className="achievement-name">{achievement.name}</h4>
                          <p className="achievement-desc">{achievement.description}</p>
                          {achievement.unlockedAt && (
                            <span className="achievement-date">
                              {formatDate(achievement.unlockedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Coupons */}
            <div className="section">
              <h3 className="section-title">🎫 Мои купоны</h3>
              {userStats.coupons.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🎫</div>
                  <h4>Пока нет купонов</h4>
                  <p>Исследуйте город и собирайте коллекцию, чтобы получить скидки!</p>
                </div>
              ) : (
                <div className="coupons-grid">
                  {userStats.coupons.map(coupon => (
                    <div key={coupon.id} className="coupon-card">
                      <div className="coupon-discount">{coupon.discount}%</div>
                      <div className="coupon-content">
                        <h4 className="coupon-title">{coupon.businessName}</h4>
                        <p className="coupon-desc">{coupon.description}</p>
                        <span className="coupon-expires">
                          До {formatDate(coupon.validUntil)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeSubTab === 'collection' && (
          <div className="collection-section">
            {/* Collection Header */}
            <div className="collection-header">
              <div className="collection-stats">
                <div className="collection-stat">
                  <span className="stat-number">{collection.length}</span>
                  <span className="stat-label">Всего мест</span>
                </div>
                <div className="collection-stat">
                  <span className="stat-number">{new Set(collection.map(c => c.category)).size}</span>
                  <span className="stat-label">Категорий</span>
                </div>
              </div>
            </div>

            {/* Collection Grid */}
            {collection.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🏛️</div>
                <h4>Коллекция пуста</h4>
                <p>Сканируйте QR-коды в интересных местах города, чтобы добавить их в свою коллекцию!</p>
              </div>
            ) : (
              <div className="collection-grid">
                {collection.map(item => (
                  <div key={item.id} className="collection-item">
                    <div className="item-header">
                      <div className="item-icon">{getCategoryIcon(item.category)}</div>
                      <div className="item-date">{formatDate(item.scannedAt)}</div>
                    </div>
                    <div className="item-content">
                      <h4 className="item-name">{item.name}</h4>
                      <p className="item-category">{item.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'quests' && (
          <div className="quests-section">
            <div className="section">
              <h3 className="section-title">🎯 Активные квесты</h3>
              {activeQuests.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🎯</div>
                  <h4>Нет активных квестов</h4>
                  <p>Скоро здесь появятся интересные задания от местных заведений!</p>
                </div>
              ) : (
                <div className="quests-grid">
                  {activeQuests
                    .sort((a, b) => {
                      // Сначала срочные квесты (isPush или urgency === 'high')
                      const aUrgent = a.isPush || a.urgency === 'high';
                      const bUrgent = b.isPush || b.urgency === 'high';
                      
                      if (aUrgent && !bUrgent) return -1;
                      if (!aUrgent && bUrgent) return 1;
                      
                      // Затем по срочности
                      const urgencyOrder = { 'high': 3, 'medium': 2, 'low': 1 };
                      const aUrgencyValue = urgencyOrder[a.urgency || 'low'];
                      const bUrgencyValue = urgencyOrder[b.urgency || 'low'];
                      
                      return bUrgencyValue - aUrgencyValue;
                    })
                    .map(quest => (
                    <div 
                      key={quest.id} 
                      className={`quest-card ${quest.isPush ? 'quest-push' : ''} ${quest.requiresGeolocation ? 'quest-geo' : ''}`}
                      data-urgency={quest.urgency}
                    >
                      {/* Уведомление о пуш-квесте */}
                      {quest.isPush && (
                        <div className="quest-notification">
                          <span className="notification-icon">🔔</span>
                          <span className="notification-text">Срочно!</span>
                        </div>
                      )}
                      
                      <div className="quest-header">
                        <div className="quest-icon">
                          {quest.type === 'visit' ? '🏛️' : 
                           quest.type === 'route' ? '🗺️' : 
                           quest.type === 'route_with_geo' ? '🧭' :
                           quest.type === 'scan' ? '📱' : '👥'}
                        </div>
                        <div className="quest-reward">+{quest.rewards.points} очков</div>
                        {quest.urgency === 'high' && (
                          <div className="quest-urgency">⚡</div>
                        )}
                      </div>
                      
                      <div className="quest-content">
                        <h4 className="quest-title">{quest.title}</h4>
                        <p className="quest-desc">{quest.description}</p>
                        
                        <div className="quest-details">
                          <div className="quest-business">
                            <span>🏢 {quest.businessName}</span>
                          </div>
                          
                          {quest.estimatedDuration && (
                            <div className="quest-duration">
                              <span>⏱️ {Math.floor(quest.estimatedDuration / 60)}ч {quest.estimatedDuration % 60}мин</span>
                            </div>
                          )}
                          
                          {quest.difficulty && (
                            <div className={`quest-difficulty difficulty-${quest.difficulty}`}>
                              {quest.difficulty === 'easy' ? '🟢 Легко' : 
                               quest.difficulty === 'medium' ? '🟡 Средне' : '🔴 Сложно'}
                            </div>
                          )}
                          
                          {quest.requiresGeolocation && (
                            <div className="quest-geo-badge">
                              <span>📍 Требуется геолокация</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="quest-reward-details">
                          {quest.rewards.badge && (
                            <div className="quest-badge-reward">
                              <span>🏆 {quest.rewards.badge}</span>
                            </div>
                          )}
                          
                          {quest.rewards.coupon && (
                            <div className="quest-coupon-preview">
                              {quest.rewards.coupon.promoCode ? (
                                <span>🎟️ Промокод: {quest.rewards.coupon.description}</span>
                              ) : (
                                <span>🎫 Скидка {quest.rewards.coupon.discount}%</span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="quest-actions">
                          <button className={`quest-btn ${quest.isPush ? 'btn-urgent' : 'btn-primary'}`}>
                            {quest.type === 'route_with_geo' ? 'Начать маршрут' : 
                             quest.isPush ? 'Получить скидку' : 'Принять квест'}
                          </button>
                          
                          <div className="quest-expires">
                            <span>⏰ До {formatDate(quest.validUntil)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Секция завершенных квестов */}
            {completedQuests.length > 0 && (
              <div className="section">
                <h3 className="section-title">✅ Завершенные квесты</h3>
                <div className="quests-grid">
                  {completedQuests.slice(0, 3).map(quest => (
                    <div key={quest.id} className="quest-card quest-completed">
                      <div className="quest-header">
                        <div className="quest-icon">✅</div>
                        <div className="quest-reward">+{quest.rewards.points} очков</div>
                      </div>
                      <div className="quest-content">
                        <h4 className="quest-title">{quest.title}</h4>
                        <div className="quest-business">
                          <span>🏢 {quest.businessName}</span>
                        </div>
                        <div className="quest-status">
                          <span className="status-completed">✅ Завершен</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'leaderboard' && (
          <div className="leaderboard-section">
            <div className="section">
              <h3 className="section-title">🏅 Рейтинг исследователей</h3>
              <div className="leaderboard-list">
                {leaderboard.map((entry, index) => (
                  <div 
                    key={entry.userId} 
                    className={`leaderboard-item ${entry.userId === userId ? 'current-user' : ''}`}
                  >
                    <div className="rank">
                      {index < 3 ? ['🥇', '🥈', '🥉'][index] : `#${index + 1}`}
                    </div>
                    <div className="user-info">
                      <h4 className="username">{entry.username}</h4>
                      <p className="user-level">{entry.level.name}</p>
                    </div>
                    <div className="user-score">
                      <span className="score">{entry.points}</span>
                      <span className="score-label">очков</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'settings' && (
          <div className="settings-section">
            <h3 className="section-title">⚙️ Настройки</h3>
            
            {/* Тема приложения */}
            <div className="settings-group">
              <h4 className="settings-group-title">🎨 Внешний вид</h4>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Тема приложения</span>
                  <span className="setting-description">Выберите светлую или темную тему</span>
                </div>
                <div className="theme-selector">
                  <button 
                    className={`theme-btn ${currentTheme === 'dark' ? 'active' : ''}`} 
                    onClick={() => handleThemeChange('dark')}
                  >
                    <span className="theme-icon">🌙</span>
                    <span className="theme-name">Темная</span>
                  </button>
                  <button 
                    className={`theme-btn ${currentTheme === 'light' ? 'active' : ''}`}
                    onClick={() => handleThemeChange('light')}
                  >
                    <span className="theme-icon">☀️</span>
                    <span className="theme-name">Светлая</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Безопасность */}
            <div className="settings-group">
              <h4 className="settings-group-title">🔒 Безопасность</h4>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Пароль</span>
                  <span className="setting-description">Изменить пароль учетной записи</span>
                </div>
                <button className="setting-btn">
                  <span>Изменить</span>
                  <span className="btn-arrow">→</span>
                </button>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Двухфакторная аутентификация</span>
                  <span className="setting-description">Дополнительная защита аккаунта</span>
                </div>
                <div className="toggle-switch">
                  <input type="checkbox" id="two-factor" className="toggle-input" />
                  <label htmlFor="two-factor" className="toggle-label">
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Уведомления */}
            <div className="settings-group">
              <h4 className="settings-group-title">🔔 Уведомления</h4>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Push-уведомления</span>
                  <span className="setting-description">Получать уведомления о новых событиях</span>
                </div>
                <div className="toggle-switch">
                  <input type="checkbox" id="push-notifications" className="toggle-input" defaultChecked />
                  <label htmlFor="push-notifications" className="toggle-label">
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Email-уведомления</span>
                  <span className="setting-description">Еженедельная сводка активности</span>
                </div>
                <div className="toggle-switch">
                  <input type="checkbox" id="email-notifications" className="toggle-input" defaultChecked />
                  <label htmlFor="email-notifications" className="toggle-label">
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Звук уведомлений</span>
                  <span className="setting-description">Звуковые сигналы для уведомлений</span>
                </div>
                <div className="toggle-switch">
                  <input type="checkbox" id="sound-notifications" className="toggle-input" />
                  <label htmlFor="sound-notifications" className="toggle-label">
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Приватность */}
            <div className="settings-group">
              <h4 className="settings-group-title">🛡️ Приватность</h4>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Публичный профиль</span>
                  <span className="setting-description">Показывать профиль в рейтинге</span>
                </div>
                <div className="toggle-switch">
                  <input type="checkbox" id="public-profile" className="toggle-input" defaultChecked />
                  <label htmlFor="public-profile" className="toggle-label">
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Геолокация</span>
                  <span className="setting-description">Разрешить доступ к местоположению</span>
                </div>
                <div className="toggle-switch">
                  <input type="checkbox" id="geolocation" className="toggle-input" defaultChecked />
                  <label htmlFor="geolocation" className="toggle-label">
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Аналитика</span>
                  <span className="setting-description">Помочь улучшить приложение</span>
                </div>
                <div className="toggle-switch">
                  <input type="checkbox" id="analytics" className="toggle-input" defaultChecked />
                  <label htmlFor="analytics" className="toggle-label">
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Данные */}
            <div className="settings-group">
              <h4 className="settings-group-title">💾 Данные</h4>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Экспорт данных</span>
                  <span className="setting-description">Скачать копию ваших данных</span>
                </div>
                <button className="setting-btn">
                  <span>Экспорт</span>
                  <span className="btn-arrow">↓</span>
                </button>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Очистить кэш</span>
                  <span className="setting-description">Освободить место на устройстве</span>
                </div>
                <button className="setting-btn secondary">
                  <span>Очистить</span>
                  <span className="btn-arrow">🗑️</span>
                </button>
              </div>
              <div className="setting-item danger">
                <div className="setting-info">
                  <span className="setting-label">Удалить аккаунт</span>
                  <span className="setting-description">Безвозвратно удалить все данные</span>
                </div>
                <button className="setting-btn danger">
                  <span>Удалить</span>
                  <span className="btn-arrow">⚠️</span>
                </button>
              </div>
            </div>

            {/* О приложении */}
            <div className="settings-group">
              <h4 className="settings-group-title">ℹ️ О приложении</h4>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Версия</span>
                  <span className="setting-description">Собери свой Саратов v1.0.0</span>
                </div>
                <span className="version-badge">Актуальная</span>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Обратная связь</span>
                  <span className="setting-description">Сообщить о проблеме или предложить идею</span>
                </div>
                <button className="setting-btn">
                  <span>Написать</span>
                  <span className="btn-arrow">📧</span>
                </button>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Политика конфиденциальности</span>
                  <span className="setting-description">Как мы обрабатываем ваши данные</span>
                </div>
                <button className="setting-btn">
                  <span>Читать</span>
                  <span className="btn-arrow">→</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalCabinet;