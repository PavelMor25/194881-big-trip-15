import { createElement } from '../utils/utils';

const createTravelList = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class TripList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTravelList();
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
