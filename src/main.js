import {createSiteMenu} from './view/site-menu';
import {createFilter} from './view/filter';
import {createTripInfo, createTripInfoRoute, createTripInfoDate, createTripInfoPrice} from './view/trip-info';
import {createSort} from './view/trip-sort';
import {createTravelList, createTravelListItem} from './view/trip-list';
import {createNewPoint, createNewPointWithoutOffer, createNewPointWithoutDestination} from './view/edit-trip';
import {generateEvent} from './mock/trip';

const TASK_COUNT = 3;
const events = new Array(TASK_COUNT).fill().map(() => generateEvent());

const render = (container, template, place) => container.insertAdjacentHTML(place, template);

const tripMain = document.querySelector('.trip-main');

render(tripMain, createTripInfo(), 'afterbegin');

const tripInfoMain = tripMain.querySelector('.trip-info__main');

render(tripInfoMain, createTripInfoRoute(), 'beforeend');
render(tripInfoMain, createTripInfoDate(), 'beforeend');
render(tripInfoMain, createTripInfoPrice(), 'afterend');

const tripNavigation = tripMain.querySelector('.trip-controls__navigation');

render(tripNavigation, createSiteMenu(), 'beforeend');

const tripFilters = tripMain.querySelector('.trip-controls__filters');

render(tripFilters, createFilter(), 'beforeend');

const tripEvents = document.querySelector('.trip-events');

render(tripEvents, createSort(), 'beforeend');
render(tripEvents, createTravelList(), 'beforeend');

const tripList = tripEvents.querySelector('.trip-events__list');

render(tripList, createNewPoint(), 'beforeend');

for (let i = 0; i < TASK_COUNT; i++) {
  render(tripList, createTravelListItem(), 'beforeend');
}
