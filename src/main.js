import SiteMenuView from './view/site-menu';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import PointsModel from './model/point';
import DestinationsModel from './model/destinations';
import OffersModel from './model/offers';
import FilterModel from './model/filter';
import StatisticsView from './view/statistics';
import Api from './api/api';
import Store from './api/store';
import Provider from './api/provider';
import { isOnline } from './utils/common';
import { toast } from './utils/toast';
import {remove, render, RenderPosition} from './utils/render';
import {MenuItem, UpdateType} from './const';

const AUTHORIZATION = 'Basic V1ad1V0stOkasd34F32';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';
const STORE_PREFIX = 'bigtrip-localstorage';
const STORE_VER = 'v15';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const tripMainElement = document.querySelector('.trip-main');
const tripNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const addEventBtnElement = document.querySelector('.trip-main__event-add-btn');
const tripEventsElement = document.querySelector('.trip-events');

addEventBtnElement.disabled = true;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const filterModel = new FilterModel();
const siteMenuComponent = new SiteMenuView();

render(tripNavigationElement, siteMenuComponent, RenderPosition.BEFOREEND);

const filterPresenter = new FilterPresenter(tripFiltersElement, filterModel, pointsModel);

const tripPresenter = new TripPresenter(tripMainElement, tripEventsElement, pointsModel, filterModel, destinationsModel, offersModel, addEventBtnElement, apiWithProvider);

addEventBtnElement.addEventListener('click', (evt) => {
  if (!isOnline()) {
    toast('You can\'t create new Event offline');
    return;
  }
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


// Promise.all([
//   apiWithProvider.getPoints(),
//   apiWithProvider.getDestinations(),
//   apiWithProvider.getOffers(),
// ])
apiWithProvider.getInitData()
  .then((data) => {
    const [points, destinations, offers] = data;


    offersModel.setOffers(offers);
    destinationsModel.setDestinations(destinations);
    pointsModel.setPoints(UpdateType.INIT, points);

    addEventBtnElement.disabled = false;
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    filterPresenter.init();
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);


    addEventBtnElement.disabled = false;
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    filterPresenter.init();
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
