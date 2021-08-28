import SiteMenuView from './view/site-menu';
import FilterView from './view/filter';
import TripInfoView from './view/trip-info';
import TripSortView from './view/trip-sort';
import TripListView from './view/trip-list';
import TripEventsView from './view/trip';
import TripPointEditView from './view/edit-trip';
import EmptyListView from './view/empty-events';
import {generateEvent} from './mock/trip';
import { render, RenderPosition} from './utils/utils';

const EVENTS_COUNT = 10;
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

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  eventComponent.getElement().querySelector('.event__rollup-btn');

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

  render(eventListElement, eventComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderTripList = (tripListContainer, event) => {
  if (!events.length) {
    return render(tripListContainer, new EmptyListView().getElement(), RenderPosition.BEFOREEND);
  }

  const tripSortComponent = new TripSortView();
  render(tripListContainer, tripSortComponent.getElement(), RenderPosition.BEFOREEND);

  const tripListComponent = new TripListView();
  render(tripListContainer, tripListComponent.getElement(), RenderPosition.BEFOREEND);

  for (let i = 0; i < EVENTS_COUNT; i++) {
    renderEvent(tripListComponent.getElement(), event[i]);
  }
};

const tripMain = document.querySelector('.trip-main');

render(tripMain, new TripInfoView(events).getElement(), RenderPosition.AFTERBEGIN);

const tripNavigation = tripMain.querySelector('.trip-controls__navigation');

render(tripNavigation, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);

const tripFilters = tripMain.querySelector('.trip-controls__filters');

render(tripFilters, new FilterView().getElement(), RenderPosition.BEFOREEND);

const tripEvents = document.querySelector('.trip-events');

renderTripList(tripEvents, events);
