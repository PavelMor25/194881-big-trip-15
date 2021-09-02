import TripSortView from './../view/trip-sort';
import TripListView from './../view/trip-list';
import EmptyListView from './../view/empty-events';
import PointPresenter from './point';
import { render, RenderPosition} from './../utils/render';
import { updateItem } from '../utils/common';
import { sortDay, sortPrice, sortTime } from '../utils/trip-and-info';
import { SortType } from '../const';


export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._pointPresenter = new Map();
    this._currentSortType = SortType.SORT_DAY;

    this._tripComponent = new TripListView();
    this._tripSortComponent = new TripSortView();
    this._emptyListComponent = new EmptyListView();

    this._handlerPointChange = this._handlerPointChange.bind(this);
    this._handlerModeChange = this._handlerModeChange.bind(this);
    this._handlerSortTypeChange = this._handlerSortTypeChange.bind(this);
  }

  init(events) {
    this._tripEvents = events.slice().sort(sortDay);
    this._renderTripList();
  }

  _renderTripList() {
    if (!this._tripEvents.length) {
      this._renderNoPoints();
      return;
    }

    if (!this._tripContainer.contains(this._tripSortComponent.getElement())) {
      this._renderSort();
    }

    render(this._tripContainer, this._tripComponent, RenderPosition.BEFOREEND);
    this._tripEvents.forEach((event) => this._renderPoint(event));
  }

  _renderNoPoints() {
    render(this._tripContainer, this._emptyListComponent, RenderPosition.BEFOREEND);
  }

  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.SORT_PRICE:
        this._tripEvents.sort(sortPrice);
        break;
      case SortType.SORT_TIME:
        this._tripEvents.sort(sortTime);
        break;
      default:
        this._tripEvents.sort(sortDay);
        break;
    }

    this._currentSortType = sortType;
    this._tripSortComponent.getElement().querySelector(`#${this._currentSortType}`).checked = true ;
  }

  _handlerSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPoints(sortType);
    this._clearTripList();
    this._renderTripList();
  }

  _renderSort() {
    render(this._tripContainer, this._tripSortComponent, RenderPosition.BEFOREEND);
    this._tripSortComponent.setSortTypeHandler(this._handlerSortTypeChange);
  }

  _renderPoint(event) {
    const pointPresenter = new PointPresenter(this._tripComponent, this._handlerPointChange, this._handlerModeChange);
    pointPresenter.init(event);
    this._pointPresenter.set(event.id, pointPresenter);
  }

  _clearTripList() {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();
  }

  _handlerPointChange(updatePoint) {
    this._tripEvents = updateItem(this._tripEvents, updatePoint);
    this._pointPresenter.get(updatePoint.id).init(updatePoint);
  }

  _handlerModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }
}
