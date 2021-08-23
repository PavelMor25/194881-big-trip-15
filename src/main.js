import {createSiteMenu} from './view/site-menu';
import {createFilter} from './view/filter';
import {createTripInfo, createTripInfoRouteDate, createTripInfoPrice} from './view/trip-info';
import {createSort} from './view/trip-sort';
import {createTravelList, createTravelListItem} from './view/trip-list';
import {createNewPoint} from './view/edit-trip';
import {generateEvent} from './mock/trip';
import { render} from './utils/utils';

const TASK_COUNT = 5;
const events = new Array(TASK_COUNT)
  .fill()
  .map(() => generateEvent())
  .sort((a, b) => a.date.from - b.date.from);


const tripMain = document.querySelector('.trip-main');

render(tripMain, createTripInfo(), 'afterbegin');

const tripInfoMain = tripMain.querySelector('.trip-info__main');

render(tripInfoMain, createTripInfoRouteDate(events), 'beforeend');
render(tripInfoMain, createTripInfoPrice(events), 'afterend');

const tripNavigation = tripMain.querySelector('.trip-controls__navigation');

render(tripNavigation, createSiteMenu(), 'beforeend');

const tripFilters = tripMain.querySelector('.trip-controls__filters');

render(tripFilters, createFilter(), 'beforeend');

const tripEvents = document.querySelector('.trip-events');

render(tripEvents, createSort(), 'beforeend');
render(tripEvents, createTravelList(), 'beforeend');

const tripList = tripEvents.querySelector('.trip-events__list');

render(tripList, createNewPoint(events[0]), 'beforeend');

for (let i = 1; i < TASK_COUNT; i++) {
  render(tripList, createTravelListItem(events[i]), 'beforeend');
}
