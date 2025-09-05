// Панорамные фоны Саратова для конструктора маршрутов
export interface SaratovBackgroundData {
  id: string;
  name: string;
  description: string;
  timeOfDay: 'night' | 'evening' | 'day';
  imageUrl: string;
  gradient: string; // CSS градиент как fallback
}

export const saratovBackgrounds: SaratovBackgroundData[] = [
  {
    id: 'night-panorama-1',
    name: 'Ночная панорама с мостом',
    description: 'Потрясающий вид на освещенный мост через Волгу',
    timeOfDay: 'night',
    imageUrl: '/images/saratov-panoramas/night-bridge-panorama.jpg',
    gradient: `
      linear-gradient(180deg, 
        rgba(25, 35, 85, 0.95) 0%,
        rgba(45, 55, 105, 0.85) 20%,
        rgba(65, 75, 125, 0.75) 40%,
        rgba(85, 95, 145, 0.65) 60%,
        rgba(105, 115, 165, 0.55) 80%,
        rgba(125, 135, 185, 0.45) 100%
      ),
      radial-gradient(ellipse at center bottom, 
        rgba(255, 180, 50, 0.15) 0%,
        rgba(255, 200, 80, 0.1) 30%,
        rgba(255, 220, 120, 0.05) 50%,
        transparent 70%
      ),
      radial-gradient(circle at 80% 40%, 
        rgba(255, 165, 0, 0.08) 0%,
        rgba(255, 140, 0, 0.04) 40%,
        transparent 60%
      ),
      radial-gradient(circle at 20% 60%, 
        rgba(100, 150, 255, 0.06) 0%,
        transparent 50%
      )
    `
  },
  {
    id: 'evening-panorama-1',
    name: 'Вечерняя панорама',
    description: 'Золотой час над Саратовом',
    timeOfDay: 'evening',
    imageUrl: '', // Пока используем только градиенты
    gradient: `
      linear-gradient(180deg, 
        rgba(30, 58, 138, 0.9) 0%,
        rgba(59, 130, 246, 0.8) 30%,
        rgba(147, 197, 253, 0.7) 60%,
        rgba(191, 219, 254, 0.6) 100%
      ),
      radial-gradient(ellipse at center, 
        rgba(251, 191, 36, 0.2) 0%,
        rgba(245, 158, 11, 0.1) 40%,
        transparent 70%
      )
    `
  },
  {
    id: 'evening-panorama-2',
    name: 'Вечерний мост',
    description: 'Освещенный мост в сумерках',
    timeOfDay: 'evening',
    imageUrl: '', // Пока используем только градиенты
    gradient: `
      linear-gradient(180deg, 
        rgba(30, 58, 138, 0.85) 0%,
        rgba(59, 130, 246, 0.75) 30%,
        rgba(147, 197, 253, 0.65) 60%,
        rgba(191, 219, 254, 0.55) 100%
      ),
      radial-gradient(ellipse at bottom center, 
        rgba(251, 191, 36, 0.15) 0%,
        rgba(245, 158, 11, 0.08) 40%,
        transparent 70%
      ),
      linear-gradient(45deg,
        rgba(99, 102, 241, 0.1) 0%,
        transparent 50%
      )
    `
  },
  {
    id: 'night-panorama-2',
    name: 'Ночные огни Саратова',
    description: 'Городская иллюминация и отражения в Волге',
    timeOfDay: 'night',
    imageUrl: '',
    gradient: `
      linear-gradient(180deg, 
        rgba(20, 30, 70, 0.9) 0%,
        rgba(35, 45, 90, 0.8) 25%,
        rgba(50, 60, 110, 0.7) 50%,
        rgba(65, 75, 130, 0.6) 75%,
        rgba(80, 90, 150, 0.5) 100%
      ),
      radial-gradient(ellipse at 30% 70%, 
        rgba(255, 170, 0, 0.12) 0%,
        rgba(255, 190, 30, 0.08) 30%,
        transparent 60%
      ),
      radial-gradient(ellipse at 70% 80%, 
        rgba(255, 140, 0, 0.1) 0%,
        rgba(255, 160, 20, 0.06) 35%,
        transparent 65%
      ),
      radial-gradient(circle at 50% 90%, 
        rgba(80, 150, 255, 0.08) 0%,
        rgba(120, 180, 255, 0.04) 40%,
        transparent 70%
      )
    `
  },
  {
    id: 'day-panorama-1',
    name: 'Дневная панорама',
    description: 'Светлый день над городом',
    timeOfDay: 'day',
    imageUrl: '',
    gradient: `
      linear-gradient(180deg, 
        rgba(59, 130, 246, 0.8) 0%,
        rgba(147, 197, 253, 0.7) 30%,
        rgba(191, 219, 254, 0.6) 60%,
        rgba(219, 234, 254, 0.5) 100%
      ),
      radial-gradient(ellipse at top, 
        rgba(255, 255, 255, 0.3) 0%,
        rgba(255, 255, 255, 0.1) 40%,
        transparent 70%
      )
    `
  }
];

// Функция для получения случайного фона
export const getRandomBackground = (): SaratovBackgroundData => {
  const randomIndex = Math.floor(Math.random() * saratovBackgrounds.length);
  return saratovBackgrounds[randomIndex];
};

// Функция для получения фона по времени суток
export const getBackgroundByTime = (timeOfDay: 'night' | 'evening' | 'day'): SaratovBackgroundData => {
  const filtered = saratovBackgrounds.filter(bg => bg.timeOfDay === timeOfDay);
  if (filtered.length === 0) return saratovBackgrounds[0];
  
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
};

// Функция для получения текущего времени суток
export const getCurrentTimeOfDay = (): 'night' | 'evening' | 'day' => {
  const hour = new Date().getHours();
  
  if (hour >= 22 || hour < 6) {
    return 'night';
  } else if (hour >= 17 && hour < 22) {
    return 'evening';
  } else {
    return 'day';
  }
};
