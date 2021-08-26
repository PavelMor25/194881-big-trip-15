import { getTotalPrice, getRoute, getDate, createElement} from '../utils/utils';

const createTripInfoRouteDate = (events) => (
  `<h1 class="trip-info__title">${getRoute(events)}</h1>
  <p class="trip-info__dates">${getDate(events)}</p>`
);

const createTripInfoPrice = (events) => (
  `<p class="trip-info__cost">
  Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTotalPrice(events)}</span>
</p>`
);

const createTripInfo = (events) => (
  `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
  ${createTripInfoRouteDate(events)}
  </div>
  ${createTripInfoPrice(events)}
</section>`
);

export default class TripInfo {
  constructor(events) {
    this._events = events,
    this._element = null;
  }

  getTemplate() {
    return createTripInfo(this._events);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
