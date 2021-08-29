import AbstractView from './abstract';

const createTravelList = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class TripList extends AbstractView {
  getTemplate() {
    return createTravelList();
  }
}
