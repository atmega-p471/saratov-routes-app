import React, { useState, useRef, useCallback } from 'react';
import { CollectionItem, UserStats, Achievement } from '../types';

interface QRScannerProps {
  userStats: UserStats;
  onStatsUpdate: (stats: UserStats) => void;
  collection: CollectionItem[];
  onCollectionUpdate: (collection: CollectionItem[]) => void;
  places: any[];
  showCollection: boolean;
  onCollectionToggle: (show: boolean) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({
  userStats,
  onStatsUpdate,
  collection,
  onCollectionUpdate,
  places,
  showCollection,
  onCollectionToggle
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Симуляция сканирования QR-кода (в реальном приложении здесь был бы настоящий QR-сканер)
  const simulateScan = useCallback(() => {
    // Выбираем случайное место для демонстрации
    const randomPlace = places[Math.floor(Math.random() * places.length)];
    
    // Проверяем, не отсканировано ли уже это место
    if (collection.find(item => item.placeId === randomPlace.id)) {
      alert('Это место уже есть в вашей коллекции!');
      return;
    }

    // Добавляем в коллекцию
    const newItem: CollectionItem = {
      id: `${randomPlace.id}-${Date.now()}`,
      placeId: randomPlace.id,
      name: randomPlace.name,
      category: randomPlace.category,
      scannedAt: new Date()
    };

    const newCollection = [...collection, newItem];
    onCollectionUpdate(newCollection);

    // Обновляем статистику
    const newStats = { ...userStats };
    newStats.totalScanned += 1;

    // Проверяем достижения
    const updatedAchievements = [...newStats.achievements];
    
    // Первое сканирование
    const firstScanAchievement = updatedAchievements.find(a => a.id === 'first-scan');
    if (firstScanAchievement && !firstScanAchievement.unlockedAt) {
      firstScanAchievement.progress = 1;
      firstScanAchievement.unlockedAt = new Date();
    }

    // Культурные места
    const cultureCount = newCollection.filter(item => {
      const place = places.find(p => p.id === item.placeId);
      return place?.category === 'culture';
    }).length;
    
    const cultureAchievement = updatedAchievements.find(a => a.id === 'culture-lover');
    if (cultureAchievement) {
      cultureAchievement.progress = cultureCount;
      if (cultureCount >= 5 && !cultureAchievement.unlockedAt) {
        cultureAchievement.unlockedAt = new Date();
      }
    }

    // Гастрономические места
    const gastroCount = newCollection.filter(item => {
      const place = places.find(p => p.id === item.placeId);
      return place?.category === 'gastronomy';
    }).length;
    
    const gastroAchievement = updatedAchievements.find(a => a.id === 'gastronomy-expert');
    if (gastroAchievement) {
      gastroAchievement.progress = gastroCount;
      if (gastroCount >= 10 && !gastroAchievement.unlockedAt) {
        gastroAchievement.unlockedAt = new Date();
      }
    }

    newStats.achievements = updatedAchievements;

    // Генерируем купоны за достижения
    const newCoupons = [...newStats.coupons];
    
    // Купон за первое сканирование
    if (newStats.totalScanned === 1) {
      newCoupons.push({
        id: `coupon-first-${Date.now()}`,
        businessName: 'Кофейня "Волжские зерна"',
        discount: 10,
        description: 'Скидка 10% на первый кофе',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 дней
        qrCode: 'FIRST_SCAN_BONUS',
        isUsed: false
      });
    }

    // Купон за каждые 5 сканирований
    if (newStats.totalScanned % 5 === 0) {
      const restaurants = ['Ресторан "Пушкинъ"', 'Кафе "Саратов"', 'Пиццерия "Волга"'];
      const randomRestaurant = restaurants[Math.floor(Math.random() * restaurants.length)];
      
      newCoupons.push({
        id: `coupon-5scans-${Date.now()}`,
        businessName: randomRestaurant,
        discount: 15,
        description: 'Скидка 15% на основное блюдо',
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 дней
        qrCode: `SCAN5_${newStats.totalScanned}`,
        isUsed: false
      });
    }

    newStats.coupons = newCoupons;
    onStatsUpdate(newStats);

    alert(`🎉 Место "${randomPlace.name}" добавлено в коллекцию!`);
    setIsScanning(false);
  }, [collection, onCollectionUpdate, userStats, onStatsUpdate, places]);

  const startScanning = async () => {
    setIsScanning(true);
    
    // В демо версии просто симулируем сканирование через 2 секунды
    setTimeout(() => {
      simulateScan();
    }, 2000);

    // В реальном приложении здесь был бы код для запуска камеры:
    /*
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Ошибка доступа к камере:', error);
      setIsScanning(false);
    }
    */
  };

  const stopScanning = () => {
    setIsScanning(false);
    // Остановка камеры
    /*
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    */
    // Убираем класс для мобильного отображения
    const scanner = document.querySelector('.qr-scanner');
    if (scanner) {
      scanner.classList.remove('mobile-active');
    }
  };

  const getAchievementProgress = (achievement: Achievement) => {
    return Math.round((achievement.progress / achievement.maxProgress) * 100);
  };

  return (
    <>
      {/* QR Scanner Modal */}
      <div className={`qr-scanner ${isScanning ? 'active' : ''}`}>
        <div className="scanner-content">
          <h2 className="scanner-title">📱 Сканирование QR-кода</h2>
          <p className="scanner-description">
            Наведите камеру на QR-код рядом с достопримечательностью
          </p>
          
          {isScanning ? (
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <div className="loading-spinner"></div>
              <p style={{ marginTop: '16px', color: '#cbd5e1' }}>
                Сканируем окрестности...
              </p>
            </div>
          ) : null}
          
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="scanner-btn" onClick={simulateScan}>
              🎯 Начать сканирование
            </button>
            <button className="scanner-btn cancel" onClick={stopScanning}>
              ❌ Отмена
            </button>
          </div>
        </div>
      </div>

      {/* Collection Panel */}
      <div 
        className="collection-panel"
        style={{ display: showCollection ? 'block' : 'none' }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '15px' 
        }}>
          <h3>🏆 Коллекция</h3>
          <button 
            onClick={() => onCollectionToggle(false)}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '1.2rem',
              cursor: 'pointer' 
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: '15px', fontSize: '0.9rem' }}>
          📊 Отсканировано: {userStats.totalScanned} мест
        </div>

        {/* Последние добавленные */}
        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ fontSize: '0.9rem', marginBottom: '10px' }}>🆕 Последние:</h4>
          {collection.slice(-3).reverse().map(item => (
            <div key={item.id} className="collection-item">
              <span style={{ fontSize: '1.2rem' }}>
                {item.category === 'gastronomy' ? '🍽️' :
                 item.category === 'culture' ? '🎭' :
                 item.category === 'attractions' ? '🏛️' : '🌳'}
              </span>
              <div>
                <div style={{ fontWeight: '500', fontSize: '0.8rem' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#666' }}>
                  {item.scannedAt.toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Достижения */}
        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ fontSize: '0.9rem', marginBottom: '10px' }}>🏅 Достижения:</h4>
          {userStats.achievements.slice(0, 3).map(achievement => (
            <div 
              key={achievement.id} 
              style={{ 
                marginBottom: '8px',
                padding: '8px',
                background: achievement.unlockedAt ? '#d4edda' : '#f8f9fa',
                borderRadius: '5px',
                fontSize: '0.8rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span>{achievement.icon}</span>
                <span style={{ fontWeight: '500' }}>{achievement.name}</span>
                {achievement.unlockedAt && <span>✅</span>}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '2px' }}>
                {achievement.progress}/{achievement.maxProgress} ({getAchievementProgress(achievement)}%)
              </div>
            </div>
          ))}
        </div>

        {/* Купоны */}
        {userStats.coupons.filter(c => !c.isUsed).length > 0 && (
          <div>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '10px' }}>🎟️ Купоны:</h4>
            {userStats.coupons.filter(c => !c.isUsed).slice(0, 2).map(coupon => (
              <div 
                key={coupon.id}
                style={{
                  padding: '10px',
                  background: 'linear-gradient(135deg, #ff6b6b, #feca57)',
                  color: 'white',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  fontSize: '0.8rem'
                }}
              >
                <div style={{ fontWeight: '500' }}>{coupon.businessName}</div>
                <div>{coupon.description}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.9 }}>
                  До {coupon.validUntil.toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Scanning Modal */}
      {isScanning && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '30px',
            textAlign: 'center',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3>📱 Сканирование QR-кода</h3>
            <div style={{
              width: '200px',
              height: '200px',
              border: '3px dashed #667eea',
              borderRadius: '10px',
              margin: '20px auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f8f9fa'
            }}>
              <div style={{ animation: 'pulse 2s infinite' }}>
                📷 Поиск QR-кода...
              </div>
            </div>
            <p style={{ marginBottom: '20px', color: '#666' }}>
              Наведите камеру на QR-код рядом с достопримечательностью
            </p>
            <button
              onClick={stopScanning}
              style={{
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Hidden video element for camera (would be used in real implementation) */}
      <video ref={videoRef} style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </>
  );
};

export default QRScanner;
