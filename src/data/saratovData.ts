import { Tag, Place, TabCategory, Achievement } from '../types';

export const tags: Tag[] = [
  // Персоналии
  { id: 'gagarin', name: 'Гагарин', category: 'personalities', icon: '🚀' },
  { id: 'tabakov', name: 'Табаков', category: 'personalities', icon: '🎭' },
  { id: 'yankovsky', name: 'Янковский', category: 'personalities', icon: '🎬' },
  { id: 'chernyshevsky', name: 'Чернышевский', category: 'personalities', icon: '📚' },
  { id: 'stolypin', name: 'Столыпин', category: 'personalities', icon: '⚖️' },
  { id: 'radishchev', name: 'Радищев', category: 'personalities', icon: '✍️' },
  { id: 'sobinov', name: 'Собинов', category: 'personalities', icon: '🎵' },
  { id: 'borodin', name: 'Бородин', category: 'personalities', icon: '🎼' },
  
  // Темы
  { id: 'architecture', name: 'Архитектура', category: 'themes', icon: '🏛️' },
  { id: 'gastronomy', name: 'Гастрономия', category: 'themes', icon: '🍽️' },
  { id: 'art', name: 'Искусство', category: 'themes', icon: '🎨' },
  { id: 'space', name: 'Космос', category: 'themes', icon: '🌌' },
  { id: 'volga', name: 'Прогулки у Волги', category: 'themes', icon: '🌊' },
  { id: 'museums', name: 'Музеи', category: 'themes', icon: '🏛️' },
  { id: 'parks', name: 'Парки и скверы', category: 'themes', icon: '🌳' },
  { id: 'religion', name: 'Храмы и соборы', category: 'themes', icon: '⛪' },
  { id: 'shopping', name: 'Шопинг', category: 'themes', icon: '🛍️' },
  { id: 'nightlife', name: 'Ночная жизнь', category: 'themes', icon: '🌃' },
  
  // Форматы
  { id: 'active', name: 'Активный', category: 'formats', icon: '🏃' },
  { id: 'leisurely', name: 'Неспешный', category: 'formats', icon: '🚶' },
  { id: 'children', name: 'Для детей', category: 'formats', icon: '👶' },
  { id: 'romantic', name: 'Романтический', category: 'formats', icon: '💕' },
  { id: 'educational', name: 'Образовательный', category: 'formats', icon: '📖' },
  { id: 'photo', name: 'Фотопрогулка', category: 'formats', icon: '📸' },
  { id: 'group', name: 'Для компании', category: 'formats', icon: '👥' },
  { id: 'solo', name: 'Соло-путешествие', category: 'formats', icon: '🚶‍♂️' },
];

export const places: Place[] = [
  {
    id: 'gagarin-park',
    name: 'Парк имени Гагарина',
    description: 'Центральный парк Саратова с памятником первому космонавту',
    coordinates: [51.533562, 46.034266],
    category: 'attractions',
    tags: ['gagarin', 'space', 'children', 'leisurely', 'parks', 'photo'],
    rating: 4.5,
    photos: ['gagarin-park-1.jpg'],
    businessInfo: {
      name: 'Парк имени Гагарина',
      workingHours: 'Круглосуточно',
      isPremium: false
    }
  },
  {
    id: 'conservatory',
    name: 'Саратовская консерватория',
    description: 'Старейшая консерватория России, основанная в 1912 году',
    coordinates: [51.533901, 46.008034],
    category: 'culture',
    tags: ['art', 'architecture', 'leisurely', 'sobinov', 'borodin', 'educational'],
    rating: 4.8,
    photos: ['conservatory-1.jpg'],
    businessInfo: {
      name: 'Саратовская государственная консерватория',
      phone: '+7 (8452) 26-66-09',
      website: 'https://sarcons.ru',
      workingHours: '9:00-18:00',
      isPremium: true
    }
  },
  {
    id: 'drama-theater',
    name: 'Театр драмы имени Слонова',
    description: 'Академический театр драмы, связанный с именами Табакова и Янковского',
    coordinates: [51.531845, 46.005234],
    category: 'culture',
    tags: ['tabakov', 'yankovsky', 'art', 'leisurely', 'educational', 'group'],
    rating: 4.7,
    photos: ['drama-theater-1.jpg'],
    businessInfo: {
      name: 'Саратовский академический театр драмы',
      phone: '+7 (8452) 26-64-87',
      website: 'https://teatr-slonova.ru',
      workingHours: 'По расписанию спектаклей',
      isPremium: true
    }
  },
  {
    id: 'volga-embankment',
    name: 'Набережная Волги',
    description: 'Живописная набережная с видами на великую русскую реку',
    coordinates: [51.533456, 46.042567],
    category: 'nature',
    tags: ['volga', 'active', 'leisurely', 'children', 'photo', 'romantic', 'solo'],
    rating: 4.6,
    photos: ['volga-embankment-1.jpg'],
    businessInfo: {
      name: 'Набережная Волги',
      workingHours: 'Круглосуточно',
      isPremium: false
    }
  },
  {
    id: 'chernyshevsky-museum',
    name: 'Музей Н.Г. Чернышевского',
    description: 'Дом-музей великого писателя и революционера',
    coordinates: [51.532123, 46.012456],
    category: 'culture',
    tags: ['chernyshevsky', 'architecture', 'leisurely', 'museums', 'educational', 'solo'],
    rating: 4.3,
    photos: ['chernyshevsky-museum-1.jpg'],
    businessInfo: {
      name: 'Музей Н.Г. Чернышевского',
      phone: '+7 (8452) 24-31-45',
      workingHours: '10:00-18:00, выходной - понедельник',
      isPremium: false
    }
  },
  {
    id: 'restaurant-pushkin',
    name: 'Ресторан "Пушкинъ"',
    description: 'Изысканная русская кухня в историческом центре',
    coordinates: [51.532567, 46.008901],
    category: 'gastronomy',
    tags: ['gastronomy', 'architecture', 'leisurely', 'romantic', 'group'],
    rating: 4.4,
    photos: ['restaurant-pushkin-1.jpg'],
    businessInfo: {
      name: 'Ресторан "Пушкинъ"',
      phone: '+7 (8452) 75-75-75',
      website: 'https://pushkin-saratov.ru',
      workingHours: '12:00-24:00',
      isPremium: true
    }
  },
  {
    id: 'coffee-house',
    name: 'Кофейня "Волжские зерна"',
    description: 'Уютная кофейня с авторскими напитками и видом на Волгу',
    coordinates: [51.533789, 46.041234],
    category: 'gastronomy',
    tags: ['gastronomy', 'volga', 'leisurely'],
    rating: 4.5,
    photos: ['coffee-house-1.jpg'],
    businessInfo: {
      name: 'Кофейня "Волжские зерна"',
      phone: '+7 (8452) 88-88-88',
      workingHours: '8:00-22:00',
      isPremium: true
    }
  },
  {
    id: 'modern-building',
    name: 'Доходный дом Яхонтова',
    description: 'Прекрасный образец архитектуры модерна начала XX века',
    coordinates: [51.532890, 46.009876],
    category: 'attractions',
    tags: ['architecture', 'leisurely'],
    rating: 4.2,
    photos: ['modern-building-1.jpg'],
    businessInfo: {
      name: 'Доходный дом Яхонтова',
      workingHours: 'Внешний осмотр круглосуточно',
      isPremium: false
    }
  },
  {
    id: 'space-museum',
    name: 'Музей космонавтики',
    description: 'Музей, посвященный космической тематике и Ю.А. Гагарину',
    coordinates: [51.534123, 46.035678],
    category: 'culture',
    tags: ['gagarin', 'space', 'children', 'active'],
    rating: 4.6,
    photos: ['space-museum-1.jpg'],
    businessInfo: {
      name: 'Музей космонавтики',
      phone: '+7 (8452) 27-35-46',
      workingHours: '10:00-17:00, выходной - понедельник',
      isPremium: false
    }
  },
  {
    id: 'saratov-bridge',
    name: 'Саратовский мост',
    description: 'Знаменитый мост через Волгу, один из символов города',
    coordinates: [51.535234, 46.045123],
    category: 'attractions',
    tags: ['volga', 'active', 'architecture'],
    rating: 4.7,
    photos: ['saratov-bridge-1.jpg'],
    businessInfo: {
      name: 'Саратовский мост',
      workingHours: 'Круглосуточно',
      isPremium: false
    }
  },
  {
    id: 'radishchev-museum',
    name: 'Музей имени А.Н. Радищева',
    description: 'Первый общедоступный художественный музей России',
    coordinates: [51.533123, 46.009876],
    category: 'culture',
    tags: ['radishchev', 'art', 'museums', 'architecture', 'educational', 'solo'],
    rating: 4.6,
    photos: ['radishchev-museum-1.jpg'],
    businessInfo: {
      name: 'Саратовский государственный художественный музей',
      phone: '+7 (8452) 26-16-06',
      website: 'https://radmuseumart.ru',
      workingHours: '10:00-18:00, выходной - понедельник',
      isPremium: false
    }
  },
  {
    id: 'stolypin-square',
    name: 'Сквер имени Столыпина',
    description: 'Памятник великому реформатору П.А. Столыпину',
    coordinates: [51.534567, 46.011234],
    category: 'attractions',
    tags: ['stolypin', 'parks', 'architecture', 'educational', 'photo'],
    rating: 4.2,
    photos: ['stolypin-square-1.jpg'],
    businessInfo: {
      name: 'Сквер имени Столыпина',
      workingHours: 'Круглосуточно',
      isPremium: false
    }
  },
  {
    id: 'trinity-cathedral',
    name: 'Троицкий собор',
    description: 'Главный православный храм Саратова',
    coordinates: [51.532789, 46.007123],
    category: 'culture',
    tags: ['religion', 'architecture', 'leisurely', 'educational', 'photo'],
    rating: 4.7,
    photos: ['trinity-cathedral-1.jpg'],
    businessInfo: {
      name: 'Троицкий кафедральный собор',
      phone: '+7 (8452) 27-35-67',
      workingHours: '7:00-19:00',
      isPremium: false
    }
  },
  {
    id: 'shopping-center',
    name: 'ТЦ "Саратов"',
    description: 'Крупный торговый центр в центре города',
    coordinates: [51.533456, 46.010987],
    category: 'shopping',
    tags: ['shopping', 'active', 'group', 'children'],
    rating: 4.1,
    photos: ['shopping-center-1.jpg'],
    businessInfo: {
      name: 'ТЦ "Саратов"',
      phone: '+7 (8452) 55-55-55',
      workingHours: '10:00-22:00',
      isPremium: false
    }
  },
  {
    id: 'night-club',
    name: 'Клуб "Максимилианс"',
    description: 'Популярное место ночной жизни Саратова',
    coordinates: [51.531234, 46.009123],
    category: 'nightlife',
    tags: ['nightlife', 'group', 'active'],
    rating: 4.0,
    photos: ['night-club-1.jpg'],
    businessInfo: {
      name: 'Клуб "Максимилианс"',
      phone: '+7 (8452) 77-77-77',
      website: 'https://maximiliansaratov.ru',
      workingHours: '20:00-6:00, пт-сб',
      isPremium: true
    }
  }
];

export const tabCategories: TabCategory[] = [
  {
    id: 'gastronomy',
    name: 'Гастротур',
    icon: '🍽️'
  },
  {
    id: 'attractions',
    name: 'Достопримечательности',
    icon: '🏛️'
  },
  {
    id: 'culture',
    name: 'Культура',
    icon: '🎭'
  },
  {
    id: 'nature',
    name: 'Природа',
    icon: '🌳'
  }
];

export const achievements: Achievement[] = [
  {
    id: 'first-scan',
    name: 'Первый шаг',
    description: 'Отсканируйте первый QR-код',
    icon: '🎯',
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'culture-lover',
    name: 'Культурный деятель',
    description: 'Посетите 5 культурных мест',
    icon: '🎭',
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'gastronomy-expert',
    name: 'Гастрономический эксперт',
    description: 'Посетите 10 заведений питания',
    icon: '👨‍🍳',
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'space-explorer',
    name: 'Покоритель космоса',
    description: 'Посетите все места, связанные с космосом',
    icon: '🚀',
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'architecture-fan',
    name: 'Ценитель архитектуры',
    description: 'Изучите 15 архитектурных памятников',
    icon: '🏛️',
    progress: 0,
    maxProgress: 15
  },
  {
    id: 'volga-walker',
    name: 'Волжский странник',
    description: 'Пройдите 10 км вдоль Волги',
    icon: '🌊',
    progress: 0,
    maxProgress: 10000
  }
];

// Готовые маршруты
export const predefinedRoutes = [
  {
    id: 'historic-center',
    name: 'Исторический центр',
    description: 'Основные достопримечательности старого Саратова',
    category: 'Классический',
    rating: 4.8,
    duration: 180, // 3 часа
    difficulty: 'medium' as const,
    places: [
      places.find(p => p.id === 'saratov-conservatory'),
      places.find(p => p.id === 'radishchev-museum'),
      places.find(p => p.id === 'trinity-cathedral'),
      places.find(p => p.id === 'chernyshevsky-museum'),
      places.find(p => p.id === 'saratov-bridge')
    ].filter(Boolean) as Place[],
    tags: ['architecture', 'art', 'leisurely']
  },
  {
    id: 'gastro-tour',
    name: 'Гастрономический тур',
    description: 'Лучшие рестораны и кафе города',
    category: 'Еда',
    rating: 4.6,
    duration: 240, // 4 часа
    difficulty: 'easy' as const,
    places: [
      places.find(p => p.id === 'restaurant-volga'),
      places.find(p => p.id === 'cafe-saratov'),
      places.find(p => p.id === 'bakery-central'),
      places.find(p => p.id === 'restaurant-traditional')
    ].filter(Boolean) as Place[],
    tags: ['gastronomy', 'leisurely']
  },
  {
    id: 'space-route',
    name: 'Космический маршрут',
    description: 'По следам Юрия Гагарина и космической истории',
    category: 'Космос',
    rating: 4.9,
    duration: 150, // 2.5 часа
    difficulty: 'easy' as const,
    places: [
      places.find(p => p.id === 'gagarin-park'),
      places.find(p => p.id === 'gagarin-museum'),
      places.find(p => p.id === 'gagarin-monument')
    ].filter(Boolean) as Place[],
    tags: ['gagarin', 'space', 'children']
  },
  {
    id: 'volga-walk',
    name: 'Прогулка по Волге',
    description: 'Живописная набережная и речные виды',
    category: 'Природа',
    rating: 4.7,
    duration: 120, // 2 часа
    difficulty: 'easy' as const,
    places: [
      places.find(p => p.id === 'volga-embankment'),
      places.find(p => p.id === 'saratov-bridge'),
      places.find(p => p.id === 'park-lipki')
    ].filter(Boolean) as Place[],
    tags: ['volga', 'leisurely', 'children']
  }
];
