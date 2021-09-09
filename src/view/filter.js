import AbstractView from './abstract';
import { FilterType } from '../const';

const createFilter = (filterType) => {
  const filtersItemsTemplate = Object.values(FilterType).map((element) => `<div class="trip-filters__filter">
  <input id="filter-${element}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${element}" ${element === filterType ? 'checked' : ''}>
  <label class="trip-filters__filter-label" for="filter-${element}">${element}</label>
</div>`).join('');

  return (
    `<form class="trip-filters" action="#" method="get">
    ${filtersItemsTemplate}
    <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`);
};

export default class Filters extends AbstractView {
  constructor(filterType) {
    super();
    this._filterType = filterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilter(this._filterType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('change', this._filterTypeChangeHandler);
  }
}
