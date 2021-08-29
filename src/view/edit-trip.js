import { getDateFormat} from '../utils/trip-and-info';
import { offerEvents, destination, typeEvent} from '../mock/trip-mock';
import AbstractView from './abstract';

const createPlace = () =>
  destination.map((item) =>
    `<option value="${item.place}"></option>`)
    .join('');

const createDescription = (eventDestination) => (
  `<section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  <p class="event__destination-description">
  ${destination.find((element) => {
    if (element.place === eventDestination) {
      return 1;
    }
  }).description}
  </p>
</section>`
);

const createTypeItemsTemplate = (currentType) => (
  typeEvent.map((element) =>
    `<div class="event__type-item">
    <input
    id="event-type-${element}-1"
    class="event__type-input visually-hidden"
    type="radio"
    name="event-type"
    value="${element}"
    ${element === currentType ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${element}"
    for="event-type-${element}-1">${element}</label>
    </div>`)
    .join('')
);

const createOffersTemplate = (currentType, offers) => (
  `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>

  <div class="event__available-offers">
  ${offerEvents
    .find((element) => element.type === currentType ? 1 : 0)
    .offers
    .map((element) => `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden"
      id="event-offer-${element.title.replaceAll(' ', '-')}-1"
      type="checkbox"
      name="event-offer-${element.title.replaceAll(' ', '-')}"
      ${offers.includes(element) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${element.title.replaceAll(' ', '-')}-1">
        <span class="event__offer-title">${element.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${element.price}</span>
      </label>
    </div>`).join('')}
  </div>
</section>`
);

const createEditPointTemplate = (events) => {
  const {destination: {place}, type, offer, date: {from, to}, price} = events;
  const places = createPlace();
  const description = place ? createDescription(place) : '';
  const typeList = createTypeItemsTemplate(type);
  const offerList = (offerEvents.find((element) => element.type === type ? 1 : 0)) ? createOffersTemplate(type, offer) : '';


  return (`<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>

          ${typeList}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="Geneva" list="destination-list-1">
      <datalist id="destination-list-1">
        ${places}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getDateFormat(from, 'DD/MM/YY HH:mm')}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDateFormat(to, 'DD/MM/YY HH:mm')}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  ${offerList || description
      ? `<section class="event__details">
      ${offerList}
      ${description}
      </section>`
      : ''}
  </form>
  </li>`
  );
};

export default class TripPointEdit extends AbstractView {
  constructor(events) {
    super();
    this._events = events;

    this._clickHandler = this._clickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
  }

  getTemplate() {
    return createEditPointTemplate(this._events);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._clickHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit();
  }

  setFormSubmitHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._clickHandler);
  }
}
