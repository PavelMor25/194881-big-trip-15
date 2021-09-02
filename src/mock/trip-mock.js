import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {getRandomInteger} from '../utils/common';

const offerEvents = [
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
  offerEvents.forEach((element) => {
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

const generatePhotos = () => new Array(getRandomInteger(0, 4)).fill().map(() => `http://picsum.photos/248/152?r=${Math.random()}`);

const createDestination = () => {
  const places = [
    'Amsterdam',
    'Chamonix',
    'Geneva',
    'China',
  ];

  const destinationArray =[];
  for(const place of places){
    destinationArray.push({
      description: generateDescription(),
      place: place,
      photos: generatePhotos(),
    });
  }
  return destinationArray;
};

const destination = createDestination();

const typeEvent = [
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

const generateType = () => {

  const randomIndex = getRandomInteger(0, typeEvent.length - 1);

  return typeEvent[randomIndex];
};


const generateDate = () => {
  const timeAdd = 1 + Math.floor(Math.random() * 7) * 24 * getRandomInteger(0, 60) * 60 * 1000;
  return dayjs().add(timeAdd, 'ms').toDate();
};

const generateEvent = () => {
  const dateStart = generateDate();
  const dateEnd = generateDate();
  const type = generateType();

  return {
    id: nanoid(),
    type: type,
    offer: generateOffer(type),
    isFavorite: getRandomInteger(0,1) === 1,
    destination: destination[getRandomInteger(0, destination.length - 1)],
    price: getRandomInteger(1200),
    date: {
      from: Math.min(dateStart, dateEnd),
      to: Math.max(dateStart, dateEnd),
    },
  };
};

export {offerEvents, generateEvent, destination, typeEvent};
