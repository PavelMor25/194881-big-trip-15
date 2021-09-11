import SiteMenuView from './view/site-menu';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import PointsModel from './model/point';
import FilterModel from './model/filter';
import StatisticsView from './view/statistics';
import {generateEvent} from './mock/trip-mock';
import { remove, render, RenderPosition } from './utils/render';
import { MenuItem } from './const';

const EVENTS_COUNT = 10;
const events = new Array(EVENTS_COUNT)
  .fill()
  .map(() => generateEvent());

const pointsModel = new PointsModel();
pointsModel.setPoints(events);

const filterModel = new FilterModel();

const siteMenuComponent = new SiteMenuView();

const tripMain = document.querySelector('.trip-main');

const tripNavigation = tripMain.querySelector('.trip-controls__navigation');

render(tripNavigation, siteMenuComponent, RenderPosition.BEFOREEND);

const tripFilters = tripMain.querySelector('.trip-controls__filters');

const filterPresenter = new FilterPresenter(tripFilters, filterModel, pointsModel);

const addEventBtn = document.querySelector('.trip-main__event-add-btn');

const tripEvents = document.querySelector('.trip-events');

const tripPresenter = new TripPresenter(tripMain, tripEvents, pointsModel, filterModel, addEventBtn);

addEventBtn.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});

let statisticComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      filterPresenter.changeFilterDisable();
      addEventBtn.disabled = false;
      tripPresenter.init();
      remove(statisticComponent);
      break;
    case MenuItem.STATISTICS:
      tripPresenter.destroy();
      filterPresenter.changeFilterDisable();
      addEventBtn.disabled = true;
      statisticComponent = new StatisticsView(pointsModel.getPoints());
      render(tripEvents, statisticComponent, RenderPosition.BEFOREEND);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();

tripPresenter.init();
