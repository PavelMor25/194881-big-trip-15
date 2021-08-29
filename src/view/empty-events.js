import AbstractView from './abstract';

const createEmptyEvent = () => '<p class="trip-events__msg">Click New Event to create your first point</p>';

export default class EmptyList extends AbstractView {
  getTemplate() {
    return createEmptyEvent();
  }
}
