import AbstractView from './abstract';
import { FilterType } from '../const';
import { filter } from '../utils/trip-and-info';

const createFilter = (filterType, points) => {
  const filtersItemsTemplate = Object.values(FilterType).map((element) => {
    const pointsFilter = filter[element](points.slice());
    return (`<div class="trip-filters__filter" >
  <input id="filter-${element}"
  class="trip-filters__filter-input  visually-hidden"
  type="radio" name="trip-filter"
  value="${element}"
  ${element === filterType ? 'checked' : ''}
  ${pointsFilter.length ? '' : 'disabled'}>
  <label class="trip-filters__filter-label" for="filter-${element}">${element}</label>
  </div>`);
  }).join('');

  return (
    `<form class="trip-filters" action="#" method="get">
    ${filtersItemsTemplate}
    <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`);
};

export default class Filters extends AbstractView {
  constructor(filterType, points) {
    super();
    this._filterType = filterType;
    this._points = points;
    this._filterDisabled = false;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilter(this._filterType, this._points);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('change', this._filterTypeChangeHandler);
  }

  changeDisableFilters() {
    this.getElement().querySelectorAll('.trip-filters__filter-input').forEach((element) => element.disabled = !this._filterDisabled);
    this._filterDisabled = !this._filterDisabled;
  }
}
