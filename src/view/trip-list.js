import { getDateFormat, getDateDif } from '../utils/utils';

const createTravelList = () => (
  `<ul class="trip-events__list">
  </ul>`
);

const createOffersList = (offers) => (
  offers.map((element) => (
    `<li class="event__offer">
    <span class="event__offer-title">${element.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${element.price}</span>
      </li>`
  )).join(''));

const createTravelListItem = (events) => {
  const {date, type, offer, isFavorite, destination, price} = events;
  const offersList = offer ? createOffersList(offer) : '';
  const favoriteClassActive = isFavorite ? 'event__favorite-btn--active' : '';

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${getDateFormat(date.from,'YYYY-MM-DD')}">${getDateFormat(date.from, 'MMM DD')}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${destination.place}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="2019-03-18T12:25">${getDateFormat(date.from, 'HH:mm')}</time>
        &mdash;
        <time class="event__end-time" datetime="2019-03-18T13:35">${getDateFormat(date.to, 'HH:mm')}</time>
      </p>
      <p class="event__duration">${getDateDif(date.from, date.to)}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${price}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${offersList}
    </ul>
    <button class="event__favorite-btn ${favoriteClassActive}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
};

export {createTravelList, createTravelListItem};
