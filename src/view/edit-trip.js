import { getDateFormat, isOfferList, getOffers, getDestination} from '../utils/trip-and-info';
import { TypeEvent } from '../const';
import SmartView from './smart';
import flatpickr from 'flatpickr';
import he from 'he';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const NEW_POINT = {
  type: TypeEvent[0],
  offer: [],
  isFavorite: false,
  destination: null,
  price: 0,
  date: {
    from: Date.now(),
    to: '',
  },
};

const createPlace = (destinationList) =>
  destinationList.map((item, index) => destinationList[index] ? `<option value="${item.place}"></option>` : '')
    .join('');

const createDescription = (eventDestination, destinationList) => {
  const currentDescription = destinationList.find((element) => element.place === eventDestination);

  return (`<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">
    ${currentDescription.description}
   </p>

    ${currentDescription ?
      `<div class="event__photos-container">
        <div class="event__photos-tape">
        ${currentDescription
      .photos
      .map((element) => `<img class="event__photo" src="${element.src}" alt="${element.description}">`).join('')}
        </div>
      </div>`
      : ''}
  </section>`
  );};

const createTypeItemsTemplate = (currentType, isDisabled) => (
  TypeEvent.map((element) =>
    `<div class="event__type-item">
    <input
    id="event-type-${element}-1"
    class="event__type-input visually-hidden"
    type="radio"
    name="event-type"
    value="${element}"
    ${element === currentType ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${element}"
    for="event-type-${element}-1"
    data-type="${element}"
    ${isDisabled ? 'disabled' : ''}>${element}</label>
    </div>`)
    .join('')
);

const createOffersTemplate = (currentType, offers, offerEvents, isDisabled) => (
  `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>

  <div class="event__available-offers">
  ${offerEvents
    .find((element) => element.type === currentType)
    .offers
    .map((element) => `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden"
      id="event-offer-${element.title.replaceAll(' ', '-')}-1"
      type="checkbox"
      name="event-offer-${element.title.replaceAll(' ', '-')}"
      ${offers.some((offer) => offer.title === element.title) ? 'checked' : ''}
      ${isDisabled ? 'disabled' : ''}>
      <label class="event__offer-label"
       for="event-offer-${element.title.replaceAll(' ', '-')}-1"
       data-offer="${element.title}">
        <span class="event__offer-title" data-offer="${element.title}">${element.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${element.price}</span>
      </label>
    </div>`).join('')}
  </div>
</section>`
);

const createEditPointTemplate = (data, destinationsModel, offersModel) => {
  const {destination, type, offer, date: {from, to}, price, isPlace, isOffer, isDisabled, isSaving, isDeleting} = data;
  const places = createPlace(destinationsModel.getDestinations());
  const destinationPlace = destination ? destination.place : '';
  const description = isPlace ? createDescription(destination.place, destinationsModel.getDestinations()) : '';
  const typeList = createTypeItemsTemplate(type, isDisabled);
  const offerList = isOffer ? createOffersTemplate(type, offer, offersModel.getOffers(), isDisabled) : '';

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
        <fieldset class="event__type-group" ${isDisabled ? 'disabled' : ''}>
          <legend class="visually-hidden">Event type</legend>

          ${typeList}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(destinationPlace)}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
      <datalist id="destination-list-1">
        ${places}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getDateFormat(from, 'DD/MM/YY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDateFormat(to, 'DD/MM/YY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}" ${isDisabled ? 'disabled' : ''}>
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
    <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
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

export default class TripPointEdit extends SmartView {
  constructor(events = NEW_POINT, destinationsModel, offersModel) {
    super();
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._data = TripPointEdit.parsePointToData(events, this._offersModel.getOffers());
    this._datepickerStart = null;
    this._datepickerEnd = null;

    this._clickHandler = this._clickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._changeTypeHandler = this._changeTypeHandler.bind(this);
    this._clickOfferHandler = this._clickOfferHandler.bind(this);
    this._changePriceHandler = this._changePriceHandler.bind(this);
    this._changePlaceHandler = this._changePlaceHandler.bind(this);
    this._dateStartChangeHandler = this._dateStartChangeHandler.bind(this);
    this._dateEndChangeHandler = this._dateEndChangeHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);

    this._setInnerHandlers();
    this._setDatePickerStart();
    this._setDatePickerEnd();
  }

  getTemplate() {
    return createEditPointTemplate(this._data, this._destinationsModel, this._offersModel);
  }

  removeElement() {
    super.removeElement();

    if (this._datepickerStart || this._datepickerEnd) {
      this._datepickerStart.destroy();
      this._datepickerStart = null;
      this._datepickerEnd.destroy();
      this._datepickerEnd = null;
    }
  }

  _changeTypeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.dataset.type,
      isOffer: isOfferList(evt.target.dataset.type, this._offersModel.getOffers()),
      offer: getOffers(evt.target.dataset.type, '', this._offersModel.getOffers()),
    });
  }

  _clickOfferHandler(evt) {
    if (evt.target.tagName !== 'LABEL' && evt.target.tagName !== 'SPAN') {
      return;
    }

    if (this._data.offer.some((offer) => offer.title === getOffers(this._data.type, evt.target.dataset.offer, this._offersModel.getOffers()).title)) {
      this.updateData({
        offer: this._data.offer.filter((offer) => offer.title !== getOffers(this._data.type, evt.target.dataset.offer, this._offersModel.getOffers()).title),
      }, true);
      return;
    }

    this.updateData({
      offer: this._data.offer.concat(getOffers(this._data.type, evt.target.dataset.offer, this._offersModel.getOffers())),
    }, true);
  }

  _changePriceHandler(evt) {
    this.updateData({
      price: Number(evt.target.value),
    }, true);
  }

  _changePlaceHandler(evt) {
    evt.preventDefault();
    this.updateData({
      destination: getDestination(evt.target.value, this._destinationsModel.getDestinations()),
      isPlace: getDestination(evt.target.value, this._destinationsModel.getDestinations()) !== null,
    });
  }

  _setDatePickerStart() {
    if (this._datepickerStart) {
      this._datepickerStart.destroy();
      this._datepickerStart = null;
    }

    this._datepickerStart = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      {
        defaultDate: this._data.date.from,
        maxDate: this._data.date.to,
        enableTime: true,
        altInput: true,
        altFormat: 'd/m/y H:i',
        dateFormat: 'U',
        onClose: this._dateStartChangeHandler,
      },
    );
  }

  _dateStartChangeHandler(_, dStr) {
    this.updateData({
      date: {
        from: dStr * 1000,
        to: this._data.date.to,
      },
    });
  }

  _setDatePickerEnd() {
    if (this._datepickerEnd) {
      this._datepickerEnd.destroy();
      this._datepickerEnd = null;
    }

    this._datepickerEnd = flatpickr(
      this.getElement().querySelector('#event-end-time-1'),
      {
        defaultDate: this._data.date.to,
        minDate: this._data.date.from,
        enableTime: true,
        altInput: true,
        altFormat: 'd/m/y H:i',
        dateFormat: 'U',
        onClose: this._dateEndChangeHandler,
      },
    );
  }

  _dateEndChangeHandler(_, dStr) {
    this.updateData({
      date: {
        from: this._data.date.from,
        to: dStr * 1000,
      },
    });
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setClickHandler(this._callback.click);
    this._setDatePickerStart();
    this._setDatePickerEnd();
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(TripPointEdit.parseDataToPoint(this._data));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
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
    this._callback.formSubmit(TripPointEdit.parseDataToPoint(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('click', this._changeTypeHandler);

    if (this._data.isOffer) {
      this.getElement()
        .querySelector('.event__available-offers')
        .addEventListener('click', this._clickOfferHandler);
    }

    this.getElement()
      .querySelector('#event-price-1')
      .addEventListener('input', this._changePriceHandler);

    this.getElement()
      .querySelector('#event-destination-1')
      .addEventListener('change', this._changePlaceHandler);
  }

  reset(event) {
    this.updateData(
      TripPointEdit.parsePointToData(event, this._offersModel.getOffers()),
    );
  }

  static parsePointToData(event, offersModel) {
    return Object.assign(
      {},
      event,
      {
        isPlace: event.destination !== null,
        isOffer: isOfferList(event.type, offersModel),
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    if (!data.isPlace) {
      data.destination = null;
    }

    if (!data.isOffer) {
      data.offer = null;
    }

    delete data.isPlace;
    delete data.isOffer;
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}
