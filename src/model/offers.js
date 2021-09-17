import AbstractObserver from '../utils/abstracr-observer';

export default class Offers extends AbstractObserver {
  constructor() {
    super();
    this._offers = [];
  }

  setOffers(offers) {
    this._offers = offers.slice();
  }

  getOffers() {
    return this._offers;
  }
}
