import SiteMenuView from './view/site-menu';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import PointsModel from './model/point';
import FilterModel from './model/filter';
import StatisticsView from './view/statistics';
import Api from './api';
import { remove, render, RenderPosition } from './utils/render';
import { MenuItem} from './const';

const AUTHORIZATION = 'Basic V1ad1V0stOkasd34F32';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';

const tripMainElement = document.querySelector('.trip-main');
const tripNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const addEventBtnElement = document.querySelector('.trip-main__event-add-btn');
const tripEventsElement = document.querySelector('.trip-events');

addEventBtnElement.disabled = true;

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const siteMenuComponent = new SiteMenuView();

render(tripNavigationElement, siteMenuComponent, RenderPosition.BEFOREEND);

const filterPresenter = new FilterPresenter(tripFiltersElement, filterModel, pointsModel);

const tripPresenter = new TripPresenter(tripMainElement, tripEventsElement, pointsModel, filterModel, addEventBtnElement, api);

addEventBtnElement.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});

let statisticComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      filterPresenter.changeFilterDisable();
      addEventBtnElement.disabled = false;
      tripPresenter.init();
      remove(statisticComponent);
      break;
    case MenuItem.STATISTICS:
      tripPresenter.destroy();
      filterPresenter.changeFilterDisable();
      addEventBtnElement.disabled = true;
      statisticComponent = new StatisticsView(pointsModel.getPoints());
      render(tripEventsElement, statisticComponent, RenderPosition.BEFOREEND);
      break;
  }
};

tripPresenter.init();

Promise
  .all([
    api.getPoints().then((points) => {
      pointsModel.setPoints(points);
    }),
    api.getDestinations().then((destinations) => {
      pointsModel.setDestinations(destinations);
    }),
    api.getOffers().then((offers) => {
      pointsModel.setOffers(offers);
    }),
  ])
  .then(() => {
    addEventBtnElement.disabled = false;
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    pointsModel.init();
    filterPresenter.init();
  });

