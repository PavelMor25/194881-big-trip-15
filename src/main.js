import SiteMenuView from './view/site-menu';
import FilterView from './view/filter';
import TripInfoView from './view/trip-info';
import TripSortView from './view/trip-sort';
import TripListView from './view/trip-list';
import TripEventsView from './view/trip';
import TripPointEditView from './view/edit-trip';
import {generateEvent} from './mock/trip';
import { render, RenderPosition} from './utils/utils';

const EVENTS_COUNT = 5;
const events = new Array(EVENTS_COUNT)
  .fill()
  .map(() => generateEvent())
  .sort((a, b) => a.date.from - b.date.from);

const renderEvent = (eventListElement, event) => {
  const eventComponent = new TripEventsView(event);
  const eventEditComponent = new TripPointEditView(event);

  const replaceCardToForm = () => {
    eventListElement.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  };

  const replaceFormToCard = () => {
    eventListElement.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  };

  eventComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceCardToForm();
  });

  eventEditComponent.getElement().querySelector('.event__save-btn').addEventListener('click', () => {
    replaceFormToCard();
  });

  render(eventListElement, eventComponent.getElement(), RenderPosition.BEFOREEND);
};

const tripMain = document.querySelector('.trip-main');

render(tripMain, new TripInfoView(events).getElement(), RenderPosition.AFTERBEGIN);

const tripNavigation = tripMain.querySelector('.trip-controls__navigation');

render(tripNavigation, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);

const tripFilters = tripMain.querySelector('.trip-controls__filters');

render(tripFilters, new FilterView().getElement(), RenderPosition.BEFOREEND);

const tripEvents = document.querySelector('.trip-events');

render(tripEvents, new TripSortView().getElement(), RenderPosition.BEFOREEND);

const tripListComponent = new TripListView();
render(tripEvents, tripListComponent.getElement(), RenderPosition.BEFOREEND);

for (let i = 0; i < EVENTS_COUNT; i++) {
  renderEvent(tripListComponent.getElement(), events[i]);
}
