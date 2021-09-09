import SiteMenuView from './view/site-menu';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import PointsModel from './model/point';
import FilterModel from './model/filter';
import {generateEvent} from './mock/trip-mock';
import { render, RenderPosition } from './utils/render';

const EVENTS_COUNT = 10;
const events = new Array(EVENTS_COUNT)
  .fill()
  .map(() => generateEvent());

const pointsModel = new PointsModel();
pointsModel.setPoints(events);

const filterModel = new FilterModel();

const tripMain = document.querySelector('.trip-main');

const tripNavigation = tripMain.querySelector('.trip-controls__navigation');

render(tripNavigation, new SiteMenuView, RenderPosition.BEFOREEND);

const tripFilters = tripMain.querySelector('.trip-controls__filters');


const tripEvents = document.querySelector('.trip-events');

const filterPresenter = new FilterPresenter(tripFilters, filterModel, pointsModel);

const tripPresenter = new TripPresenter(tripMain, tripEvents, pointsModel, filterModel);

filterPresenter.init();

tripPresenter.init();
