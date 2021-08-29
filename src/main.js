import SiteMenuView from './view/site-menu';
import FilterView from './view/filter';
import TripInfoView from './view/trip-info';
import TripSortView from './view/trip-sort';
import TripListView from './view/trip-list';
import TripEventsView from './view/trip';
import TripPointEditView from './view/edit-trip';
import EmptyListView from './view/empty-events';
import Abstract from './view/abstract';
import {generateEvent} from './mock/trip';
import { render, RenderPosition, replace} from './utils/render';

const EVENTS_COUNT = 10;
const events = new Array(EVENTS_COUNT)
  .fill()
  .map(() => generateEvent())
  .sort((a, b) => a.date.from - b.date.from);

const renderEvent = (eventListElement, event) => {
  if (eventListElement instanceof Abstract) {
    eventListElement = eventListElement.getElement();
  }

  const eventComponent = new TripEventsView(event);
  const eventEditComponent = new TripPointEditView(event);

  const replaceCardToForm = () => {
    replace(eventEditComponent, eventComponent);
  };

  const replaceFormToCard = () => {
    replace(eventComponent, eventEditComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  const replaceFormToCardEvent = () => {
    replaceFormToCard();
    document.removeEventListener('keydown', onEscKeyDown);
  };

  const replaceCardToFormEvent = () => {
    replaceCardToForm();
    document.addEventListener('keydown', onEscKeyDown);
  };

  eventComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', replaceCardToFormEvent);

  eventEditComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', replaceFormToCardEvent);

  eventEditComponent.getElement().addEventListener('submit', replaceFormToCardEvent);

  render(eventListElement, eventComponent, RenderPosition.BEFOREEND);
};

const renderTripList = (tripListContainer, event) => {
  if (!events.length) {
    return render(tripListContainer, new EmptyListView(), RenderPosition.BEFOREEND);
  }

  const tripSortComponent = new TripSortView();
  render(tripListContainer, tripSortComponent, RenderPosition.BEFOREEND);

  const tripListComponent = new TripListView();
  render(tripListContainer, tripListComponent, RenderPosition.BEFOREEND);

  for (let i = 0; i < EVENTS_COUNT; i++) {
    renderEvent(tripListComponent, event[i]);
  }
};

const tripMain = document.querySelector('.trip-main');

render(tripMain, new TripInfoView(events), RenderPosition.AFTERBEGIN);

const tripNavigation = tripMain.querySelector('.trip-controls__navigation');

render(tripNavigation, new SiteMenuView(), RenderPosition.BEFOREEND);

const tripFilters = tripMain.querySelector('.trip-controls__filters');

render(tripFilters, new FilterView(), RenderPosition.BEFOREEND);

const tripEvents = document.querySelector('.trip-events');

renderTripList(tripEvents, events);
