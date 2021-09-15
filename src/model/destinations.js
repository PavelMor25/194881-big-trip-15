import AbstractObserver from '../utils/abstracr-observer';

export default class Destinations extends AbstractObserver {
  constructor() {
    super();
    this._destinations = [];
  }

  setDestinations(destinations) {
    this._destinations = destinations.slice();
  }

  getDestinations() {
    return this._destinations;
  }

  static adaptToClient(destination) {
    const adaptDestination = Object.assign(
      {},
      destination,
      {
        place: destination.name,
        description: destination.description,
        photos: destination.pictures,
      },
    );

    delete adaptDestination.name;
    delete adaptDestination.pictures;

    return adaptDestination;
  }
}
