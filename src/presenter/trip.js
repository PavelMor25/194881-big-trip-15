import SiteMenuView from '../view/site-menu';
import TripInfoView from '../view/trip-info';
import TripSortView from './../view/trip-sort';
import TripListView from './../view/trip-list';
import EmptyListView from './../view/empty-events';
import PointPresenter from './point';
import { render, RenderPosition, remove} from './../utils/render';
import { sortDay, sortPrice, sortTime, filter } from '../utils/trip-and-info';
import { SortType, UpdateType, UserAction, FilterType} from '../const';


export default class Trip {
  constructor(infoContainer, tripContainer, pointsModel, filterModel) {
    this._infoContainer = infoContainer;
    this._tripContainer = tripContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._pointPresenter = new Map();
    this._currentFilterType = FilterType.EVERYTHING;
    this._currentSortType = SortType.SORT_DAY;

    this._tripSortComponent = null;
    this._infoComponent = null;
    this._emptyListComponent =null;

    this._siteMenuComponent = new SiteMenuView();
    this._tripComponent = new TripListView();

    this._handlerViewAction = this._handlerViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handlerModeChange = this._handlerModeChange.bind(this);
    this._handlerSortTypeChange = this._handlerSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filtredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.SORT_DAY:
        return filtredPoints.sort(sortDay);
      case SortType.SORT_PRICE:
        return filtredPoints.sort(sortPrice);
      case SortType.SORT_TIME:
        return filtredPoints.sort(sortTime);
    }
  }

  init() {
    this._renderInfo();
    this._renderTripList();
  }

  _renderTripList() {
    const points = this._getPoints();
    if (points.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();

    render(this._tripContainer, this._tripComponent, RenderPosition.BEFOREEND);
    points.forEach((event) => this._renderPoint(event));
  }

  _renderNoPoints() {
    this._emptyListComponent = new EmptyListView(this._currentFilterType);
    render(this._tripContainer, this._emptyListComponent, RenderPosition.BEFOREEND);
  }

  _handlerSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTripList();
    this._renderTripList();
  }

  _renderInfo() {
    if (this._infoComponent !== null) {
      this._infoComponent === null;
    }
    const points = this._getPoints();

    this._infoComponent = new TripInfoView(points);
    render(this._infoContainer, this._infoComponent, RenderPosition.AFTERBEGIN);
  }

  _clearTripInfo() {
    remove(this._infoComponent);
  }

  _renderSort() {
    if (this._tripSortComponent !== null) {
      this._tripSortComponent = null;
    }

    this._tripSortComponent = new TripSortView(this._currentSortType);
    this._tripSortComponent.setSortTypeHandler(this._handlerSortTypeChange);
    render(this._tripComponent, this._tripSortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(event) {
    const pointPresenter = new PointPresenter(this._tripComponent, this._handlerViewAction, this._handlerModeChange);
    pointPresenter.init(event);
    this._pointPresenter.set(event.id, pointPresenter);
  }

  _clearTripList({resetSortType = false} = {}) {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();

    remove(this._tripSortComponent);

    if (this._emptyListComponent) {
      remove(this._emptyListComponent);
    }

    if (resetSortType) {
      this._currentSortType = SortType.SORT_DAY;
    }
  }

  _handlerViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearTripInfo();
        this._renderInfo();
        this._clearTripList();
        this._renderTripList();
        break;
      case UpdateType.MAJOR:
        this._clearTripInfo();
        this._renderInfo();
        this._clearTripList({ resetSortType: true});
        this._renderTripList();
        break;
    }
  }

  _handlerModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }
}
