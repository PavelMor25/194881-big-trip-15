import { getTotalPrice, getRoute, getDate} from '../utils/utils';
import AbstractView from './abstract';

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

export default class TripInfo extends AbstractView  {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTripInfo(this._events);
  }
}
