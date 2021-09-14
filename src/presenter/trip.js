import SiteMenuView from '../view/site-menu';
import TripInfoView from '../view/trip-info';
import TripSortView from './../view/trip-sort';
import TripListView from './../view/trip-list';
import LoadingView from '../view/loading';
import PointNewPresenter from './point-new';
import EmptyListView from './../view/empty-events';
import PointPresenter, {State as PointPresenterViewState} from './point';
import { render, RenderPosition, remove} from './../utils/render';
import { sortDay, sortPrice, sortTime, filter } from '../utils/trip-and-info';
import { SortType, UpdateType, UserAction, FilterType} from '../const';


export default class Trip {
  constructor(infoContainer, tripContainer, pointsModel, filterModel, addEventBtn, api) {
    this._infoContainer = infoContainer;
    this._tripContainer = tripContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._addEventBtn = addEventBtn;
    this._api = api;
    this._pointPresenter = new Map();
    this._currentFilterType = FilterType.EVERYTHING;
    this._currentSortType = SortType.SORT_DAY;
    this._isLoading = true;

    this._tripSortComponent = null;
    this._infoComponent = null;
    this._emptyListComponent =null;

    this._siteMenuComponent = new SiteMenuView();
    this._tripComponent = new TripListView();
    this._loadingComponent = new LoadingView();

    this._handlerViewAction = this._handlerViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handlerModeChange = this._handlerModeChange.bind(this);
    this._handlerSortTypeChange = this._handlerSortTypeChange.bind(this);
    this._changeBtnSatus = this._changeBtnSatus.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._tripComponent, this._handlerViewAction, this._changeBtnSatus, this._pointsModel);
  }

  createPoint() {
    this._currentSortType = SortType.SORT_DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    if (this._emptyListComponent) {
      remove(this._emptyListComponent);
      this._renderSort();
      render(this._tripContainer, this._tripComponent, RenderPosition.BEFOREEND);
    }
    this._changeBtnSatus();
    this._pointNewPresenter.init();
  }

  _destroyNewPoint() {
    this._pointNewPresenter.destroy();
  }

  _changeBtnSatus() {
    this._addEventBtn.disabled = !this._addEventBtn.disabled;
  }

  _getPoints() {
    this._currentFilterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filtredPoints = filter[this._currentFilterType](points);

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
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    if (!this._isLoading) {
      this._renderInfo();
      this._renderTripList();
      return;
    }
    this._renderLoading();
  }

  destroy() {
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._destroyNewPoint();
    this._clearTripList(true);
    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _renderLoading() {
    render(this._tripContainer, this._loadingComponent, RenderPosition.BEFOREEND);
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
      remove(this._infoComponent);
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
      remove(this._tripSortComponent);
    }

    this._tripSortComponent = new TripSortView(this._currentSortType);
    this._tripSortComponent.setSortTypeHandler(this._handlerSortTypeChange);
    render(this._tripContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(event) {
    const pointPresenter = new PointPresenter(this._tripComponent, this._handlerViewAction, this._handlerModeChange, this._pointsModel);
    pointPresenter.init(event);
    this._pointPresenter.set(event.id, pointPresenter);
  }

  _clearTripList(resetSortType = false) {
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
        this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.updatePoint(updateType, response);
          })
          .catch(() => {
            this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => {
            this._pointsModel.addPoint(updateType, response);
          })
          .catch(() => {
            this._pointNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
          })
          .catch(() => {
            this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
          });
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
        this._clearTripList(true);
        this._renderTripList();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderInfo();
        this._renderTripList();
    }
  }

  _handlerModeChange() {
    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }
}
