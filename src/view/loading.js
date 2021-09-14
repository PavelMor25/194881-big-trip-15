import AbstractView from './abstract';

const createNoPointsTemplate = () => '<p class="trip-events__msg">Loading...</p>';

export default class Loading extends AbstractView {
  getTemplate() {
    return createNoPointsTemplate();
  }
}
