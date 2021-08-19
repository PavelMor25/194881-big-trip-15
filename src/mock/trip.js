import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const offer = [
  {
    type: 'taxi',
    offers: [
      {
        title: 'Upgrade to a business class',
        price: 100,
      },
      {
        title: 'Child seat',
        price: 15,
      },
    ],
  },
  {
    type: 'flight',
    offers: [
      {
        title: 'Upgrade to a business class',
        price: 150,
      },
      {
        title: 'Choose seats',
        price: 10,
      },
      {
        title: 'Add luggage',
        price: 30,
      },
    ],
  },
];

const generateOffer = (typeIn) => {
  let ArrayOffer;
  offer.forEach((element) => {
    if (element.type === typeIn) {
      ArrayOffer = element.offers.slice(getRandomInteger(0, element.offers.length - 1));
    }
  });
  return ArrayOffer;
};

const generateDescription = () => {
  const description = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.',
  ];

  const randomIndex = getRandomInteger(0, Math.floor(description.length / 2));

  return description.slice(randomIndex,  randomIndex + getRandomInteger(4)).join(' ');
};

const generateType = () => {
  const type = [
    'taxi',
    'bus',
    'train',
    'ship',
    'drive',
    'flight',
    'check-in',
    'sightseeing',
    'restaurant',
  ];

  const randomIndex = getRandomInteger(0, type.length - 1);

  return type[randomIndex];
};

const generatePlace = () => {
  const place = [
    'Amsterdam',
    'Chamonix',
    'Geneva',
    'China',
  ];
  return place[getRandomInteger(0, place.length - 1)];
};

const generatePhotos = () => new Array(getRandomInteger(0, 5)).fill().map(() => `http://picsum.photos/248/152?r=${Math.random()}`);

const generateDate = () => {
  const timeAdd = 1 + Math.floor(Math.random() * 7) * 24 * getRandomInteger(0, 60) * 60 * 1000;
  return dayjs().add(timeAdd, 'ms').toDate();
};

export const generateEvent = () => {
  const dateStart = generateDate();
  const dateEnd = generateDate();
  const type = generateType();

  return {
    type: type,
    offer: generateOffer(type),
    isFavorite: getRandomInteger(0,1) === 1,
    destination: {
      description: generateDescription(),
      place: generatePlace(),
      photos: generatePhotos(),
    },
    price: getRandomInteger(1200),
    date: {
      from: Math.min(dateStart, dateEnd),
      to: Math.max(dateStart, dateEnd),
    },
  };
};
