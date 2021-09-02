import SiteMenuView from './view/site-menu';
import FilterView from './view/filter';
import TripInfoView from './view/trip-info';
import Trip from './presenter/trip';
import {generateEvent} from './mock/trip-mock';
import { render, RenderPosition} from './utils/render';

const EVENTS_COUNT = 10;
const events = new Array(EVENTS_COUNT)
  .fill()
  .map(() => generateEvent());

const tripMain = document.querySelector('.trip-main');

render(tripMain, new TripInfoView(events), RenderPosition.AFTERBEGIN);

const tripNavigation = tripMain.querySelector('.trip-controls__navigation');

render(tripNavigation, new SiteMenuView(), RenderPosition.BEFOREEND);

const tripFilters = tripMain.querySelector('.trip-controls__filters');

render(tripFilters, new FilterView(), RenderPosition.BEFOREEND);

const tripEvents = document.querySelector('.trip-events');

const tripComponent = new Trip(tripEvents);

tripComponent.init(events);
