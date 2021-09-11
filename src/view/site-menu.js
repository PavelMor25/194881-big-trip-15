import AbstractView from './abstract';
import { MenuItem } from '../const';

const createSiteMenu = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
  <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-value="${MenuItem.TABLE}">Table</a>
  <a class="trip-tabs__btn" href="#" data-value="${MenuItem.STATISTICS}">Stats</a>
</nav>`
);

export default class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenu();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._setMenuItem(evt.target.dataset.value);
    this._callback.menuClick(evt.target.dataset.value);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  _setMenuItem(menuItem) {
    const items = this.getElement().querySelectorAll('.trip-tabs__btn');
    items.forEach((element) => element.classList.remove('trip-tabs__btn--active'));
    const item = this.getElement().querySelector(`[data-value=${menuItem}]`);
    item.classList.add('trip-tabs__btn--active');


  }
}
