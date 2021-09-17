import AbstractObserver from '../utils/abstracr-observer';

export default class Points extends AbstractObserver {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(update, points) {
    this._points = points.slice();
    this._notify(update);
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        offer: point.offers,
        price: point.base_price,
        date: {
          from: new Date(point.date_from),
          to: new Date(point.date_to),
        },
        destination: {
          description: point.destination.description,
          place: point.destination.name,
          photos: point.destination.pictures,
        },
        isFavorite: point.is_favorite,
      },
    );

    delete adaptedPoint.offers;
    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint.destination.name;
    delete adaptedPoint.destination.pictures;
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        offers: point.offer,
        'base_price': point.price,
        'date_from': new Date(point.date.from).toISOString(),
        'date_to': new Date(point.date.to).toISOString(),
        destination: point.destination ? {
          description: point.destination.description,
          name: point.destination.place,
          pictures: point.destination.photos,
        } : null,
        'is_favorite': point.isFavorite,
      },
    );


    delete adaptedPoint.price;
    delete adaptedPoint.offer;
    delete adaptedPoint.date;
    if (adaptedPoint.destination) {
      delete adaptedPoint.destination.place;
      delete adaptedPoint.destination.photos;
    }
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
