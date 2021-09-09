import AbstractView from './abstract';
import { FilterType } from '../const';

const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
};

const createEmptyEvent = (filterType) => {
  const NoPointsTextValue = NoPointsTextType[filterType];

  return (`<p class="trip-events__msg">${NoPointsTextValue}</p>`);
};

export default class EmptyList extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createEmptyEvent(this._data);
  }
}
