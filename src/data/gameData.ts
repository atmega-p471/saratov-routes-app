import { UserLevel, Quest, LeaderboardEntry, Event } from '../types';

export const userLevels: UserLevel[] = [
  {
    level: 1,
    name: 'Новичок',
    minPoints: 0,
    maxPoints: 99,
    privileges: [
      'Доступ к базовым маршрутам',
      'Скидка 5% у партнеров'
    ],
    badge: '🌱',
    color: '#68d391',
    icon: '🌱'
  },
  {
    level: 2,
    name: 'Турист',
    minPoints: 100,
    maxPoints: 299,
    privileges: [
      'Доступ к расширенным маршрутам',
      'Скидка 10% у партнеров',
      'Приоритетная поддержка'
    ],
    badge: '🎒',
    color: '#4299e1',
    icon: '🎒'
  },
  {
    level: 3,
    name: 'Путешественник',
    minPoints: 300,
    maxPoints: 599,
    privileges: [
      'Доступ к премиум маршрутам',
      'Скидка 15% у партнеров',
      'Эксклюзивные события',
      'Персональные рекомендации'
    ],
    badge: '🗺️',
    color: '#805ad5',
    icon: '🗺️'
  },
  {
    level: 4,
    name: 'Исследователь',
    minPoints: 600,
    maxPoints: 999,
    privileges: [
      'Доступ ко всем маршрутам',
      'Скидка 20% у партнеров',
      'Бесплатные экскурсии (1 в месяц)',
      'Закрытые мероприятия',
      'Бета-тестирование новых функций'
    ],
    badge: '🔍',
    color: '#ed8936',
    icon: '🔍'
  },
  {
    level: 5,
    name: 'Знаток Саратова',
    minPoints: 1000,
    maxPoints: 1999,
    privileges: [
      'Все привилегии предыдущих уровней',
      'Скидка 25% у партнеров',
      'Бесплатные экскурсии (2 в месяц)',
      'Бесплатные билеты на городские события',
      'Участие в создании контента',
      'VIP-поддержка'
    ],
    badge: '🏛️',
    color: '#e53e3e',
    icon: '🏛️'
  },
  {
    level: 6,
    name: 'Амбассадор города',
    minPoints: 2000,
    maxPoints: Infinity,
    privileges: [
      'Все привилегии предыдущих уровней',
      'Скидка 30% у партнеров',
      'Безлимитные бесплатные экскурсии',
      'Персональный гид при необходимости',
      'Участие в управлении сообществом',
      'Специальные награды и подарки',
      'Именная табличка в зале славы'
    ],
    badge: '👑',
    color: '#d69e2e',
    icon: '👑'
  }
];

export const sampleQuests: Quest[] = [
  {
    id: 'quest-coffee-morning',
    title: 'Утренний кофе',
    description: 'Посетите кофейню "Волжские зерна" до 11:00 и получите скидку 20%',
    businessName: 'Кофейня "Волжские зерна"',
    businessId: 'coffee-house',
    type: 'visit',
    requirements: {
      placesToVisit: ['coffee-house']
    },
    rewards: {
      points: 50,
      coupon: {
        id: 'coffee-morning-coupon',
        businessName: 'Кофейня "Волжские зерна"',
        discount: 20,
        description: 'Скидка 20% на утренний кофе',
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        qrCode: 'MORNING_COFFEE_20',
        isUsed: false
      }
    },
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true,
    completedBy: []
  },
  {
    id: 'quest-culture-route',
    title: 'Культурный маршрут',
    description: 'Пройдите маршрут по 3 культурным местам: консерватория, театр драмы и музей Чернышевского',
    businessName: 'Министерство культуры',
    businessId: 'culture-ministry',
    type: 'route',
    requirements: {
      placesToVisit: ['conservatory', 'drama-theater', 'chernyshevsky-museum']
    },
    rewards: {
      points: 150,
      badge: '🎭 Культурный деятель',
      coupon: {
        id: 'culture-route-coupon',
        businessName: 'Театральная касса',
        discount: 25,
        description: 'Скидка 25% на билеты в театры города',
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        qrCode: 'CULTURE_ROUTE_25',
        isUsed: false
      }
    },
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    isActive: true,
    completedBy: []
  },
  {
    id: 'quest-gastro-challenge',
    title: 'Гастрономический вызов',
    description: 'Посетите 5 разных заведений питания и соберите QR-коды',
    businessName: 'Ассоциация ресторанов Саратова',
    businessId: 'restaurant-association',
    type: 'scan',
    requirements: {
      placesToScan: ['restaurant-pushkin', 'coffee-house', 'pizza-place', 'burger-spot', 'tea-house']
    },
    rewards: {
      points: 200,
      badge: '👨‍🍳 Гастро-эксперт',
      coupon: {
        id: 'gastro-challenge-coupon',
        businessName: 'Ресторан "Пушкинъ"',
        discount: 30,
        description: 'Скидка 30% на ужин для двоих',
        validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        qrCode: 'GASTRO_CHALLENGE_30',
        isUsed: false
      }
    },
    validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    isActive: true,
    completedBy: []
  },
  {
    id: 'quest-social-share',
    title: 'Поделись впечатлениями',
    description: 'Поделитесь своим маршрутом в социальных сетях с хештегом #СоберисвойСаратов',
    businessName: 'Туристический комитет',
    businessId: 'tourism-committee',
    type: 'social',
    requirements: {
      socialAction: 'share_route'
    },
    rewards: {
      points: 75,
      badge: '📱 Амбассадор',
      coupon: {
        id: 'social-share-coupon',
        businessName: 'Сувенирный магазин "Саратов"',
        discount: 15,
        description: 'Скидка 15% на сувениры',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        qrCode: 'SOCIAL_SHARE_15',
        isUsed: false
      }
    },
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    isActive: true,
    completedBy: []
  },
  {
    id: 'quest-weekend-explorer',
    title: 'Выходные исследователя',
    description: 'Посетите 10 разных мест за выходные (суббота-воскресенье)',
    businessName: 'Городская администрация',
    businessId: 'city-administration',
    type: 'scan',
    requirements: {
      placesToScan: ['gagarin-park', 'conservatory', 'drama-theater', 'volga-embankment', 
                     'restaurant-pushkin', 'coffee-house', 'modern-building', 'space-museum', 
                     'saratov-bridge', 'chernyshevsky-museum']
    },
    rewards: {
      points: 300,
      badge: '🏃 Супер-исследователь',
      coupon: {
        id: 'weekend-explorer-coupon',
        businessName: 'Экскурсионное бюро "Саратов-тур"',
        discount: 50,
        description: 'Скидка 50% на любую экскурсию',
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        qrCode: 'WEEKEND_EXPLORER_50',
        isUsed: false
      }
    },
    validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isActive: true,
    completedBy: []
  },
  {
    id: 'quest-coffee-discount-push',
    title: '☕ Скидка на кофе - сегодня!',
    description: 'Специальное предложение! Получите 20% скидку на любой кофе в сети "Кофе & Круассаны". Предложение действует только сегодня!',
    businessName: 'Сеть "Кофе & Круассаны"',
    businessId: 'coffee-croissants-network',
    type: 'visit',
    requirements: {
      placesToVisit: ['coffee-croissants-central', 'coffee-croissants-park', 'coffee-croissants-station']
    },
    rewards: {
      points: 30,
      coupon: {
        id: 'coffee-push-coupon',
        businessName: 'Сеть "Кофе & Круассаны"',
        discount: 20,
        description: '20% скидка на любой напиток',
        validUntil: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // действует 1 день
        qrCode: 'COFFEE_PUSH_20',
        isUsed: false
      }
    },
    validUntil: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // активен 1 день
    isActive: true,
    isPush: true, // специальный флаг для пуш-уведомлений
    urgency: 'high',
    completedBy: []
  },
  {
    id: 'quest-route-geolocation',
    title: '🗺️ Исследователь с GPS',
    description: 'Пройдите новый маршрут "Саратовские тайны" и подтвердите своё местоположение на каждой точке. За успешное прохождение получите промокод на выставку "История Поволжья" в Краеведческом музее.',
    businessName: 'Краеведческий музей',
    businessId: 'local-history-museum',
    type: 'route_with_geo',
    requirements: {
      routeToComplete: 'saratov-secrets-route',
      placesToVisit: ['secret-courtyard', 'old-merchant-house', 'forgotten-fountain', 'hidden-alley', 'vintage-pharmacy'],
      requireGeolocation: true,
      minAccuracy: 50 // метры
    },
    rewards: {
      points: 250,
      badge: '🧭 GPS-навигатор',
      coupon: {
        id: 'geo-route-exhibition-coupon',
        businessName: 'Краеведческий музей',
        discount: 0, // не скидка, а промокод на бесплатный вход
        description: 'Бесплатный билет на выставку "История Поволжья"',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // действует месяц
        qrCode: 'GEO_ROUTE_EXHIBITION_FREE',
        isUsed: false,
        promoCode: 'HISTORY2024'
      }
    },
    validUntil: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // активен 3 недели
    isActive: true,
    requiresGeolocation: true,
    difficulty: 'medium',
    estimatedDuration: 180, // 3 часа
    completedBy: []
  }
];

export const sampleLeaderboard: LeaderboardEntry[] = [
  {
    userId: 'user-1',
    username: 'Александр К.',
    points: 2150,
    level: userLevels[5], // Амбассадор города
    achievements: 15,
    completedQuests: 12
  },
  {
    userId: 'user-2',
    username: 'Мария В.',
    points: 1850,
    level: userLevels[4], // Знаток Саратова
    achievements: 12,
    completedQuests: 10
  },
  {
    userId: 'user-3',
    username: 'Дмитрий П.',
    points: 1650,
    level: userLevels[4], // Знаток Саратова
    achievements: 11,
    completedQuests: 9
  },
  {
    userId: 'user-4',
    username: 'Елена С.',
    points: 1420,
    level: userLevels[4], // Знаток Саратова
    achievements: 10,
    completedQuests: 8
  },
  {
    userId: 'user-5',
    username: 'Андрей М.',
    points: 1280,
    level: userLevels[4], // Знаток Саратова
    achievements: 9,
    completedQuests: 7
  },
  {
    userId: 'user-6',
    username: 'Ольга Н.',
    points: 950,
    level: userLevels[3], // Исследователь
    achievements: 8,
    completedQuests: 6
  },
  {
    userId: 'user-7',
    username: 'Игорь Л.',
    points: 820,
    level: userLevels[3], // Исследователь
    achievements: 7,
    completedQuests: 5
  },
  {
    userId: 'user-8',
    username: 'Татьяна Р.',
    points: 680,
    level: userLevels[3], // Исследователь
    achievements: 6,
    completedQuests: 4
  },
  {
    userId: 'user-9',
    username: 'Сергей Б.',
    points: 520,
    level: userLevels[2], // Путешественник
    achievements: 5,
    completedQuests: 3
  },
  {
    userId: 'user-10',
    username: 'Анна Г.',
    points: 380,
    level: userLevels[2], // Путешественник
    achievements: 4,
    completedQuests: 2
  }
];

export const sampleEvents: Event[] = [
  {
    id: 'event-1',
    title: 'Фестиваль уличной еды',
    description: 'Большой фестиваль уличной еды на набережной Волги. Более 20 участников, живая музыка, мастер-классы.',
    location: {
      name: 'Набережная Волги',
      coordinates: [51.533456, 46.042567]
    },
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    category: 'food',
    organizer: 'Ассоциация ресторанов Саратова',
    price: 0,
    maxParticipants: 5000,
    currentParticipants: 1250,
    images: ['street-food-festival.jpg'],
    isActive: true
  },
  {
    id: 'event-2',
    title: 'Ночь в консерватории',
    description: 'Специальный концерт классической музыки с участием студентов и преподавателей консерватории.',
    location: {
      name: 'Саратовская консерватория',
      coordinates: [51.533901, 46.008034]
    },
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
    category: 'culture',
    organizer: 'Саратовская государственная консерватория',
    price: 500,
    maxParticipants: 300,
    currentParticipants: 180,
    images: ['conservatory-night.jpg'],
    isActive: true
  },
  {
    id: 'event-3',
    title: 'Космический квиз',
    description: 'Интеллектуальная игра, посвященная космической тематике и Юрию Гагарину.',
    location: {
      name: 'Музей космонавтики',
      coordinates: [51.534123, 46.035678]
    },
    startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
    category: 'education',
    organizer: 'Музей космонавтики',
    price: 200,
    maxParticipants: 100,
    currentParticipants: 45,
    images: ['space-quiz.jpg'],
    isActive: true
  },
  {
    id: 'event-4',
    title: 'Театральный марафон',
    description: 'День открытых дверей в театре драмы. Экскурсии, мастер-классы, встречи с актерами.',
    location: {
      name: 'Театр драмы имени Слонова',
      coordinates: [51.531845, 46.005234]
    },
    startDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
    category: 'culture',
    organizer: 'Саратовский академический театр драмы',
    price: 0,
    maxParticipants: 500,
    currentParticipants: 220,
    images: ['theater-marathon.jpg'],
    isActive: true
  },
  {
    id: 'event-5',
    title: 'Волжский забег',
    description: 'Благотворительный забег вдоль набережной Волги. Дистанции: 5км, 10км, 21км.',
    location: {
      name: 'Набережная Волги',
      coordinates: [51.533456, 46.042567]
    },
    startDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
    category: 'sport',
    organizer: 'Спортивный комитет Саратова',
    price: 300,
    maxParticipants: 1000,
    currentParticipants: 650,
    images: ['volga-run.jpg'],
    isActive: true
  }
];

export const getUserLevel = (points: number): UserLevel => {
  return userLevels.find(level => points >= level.minPoints && points <= level.maxPoints) || userLevels[0];
};
