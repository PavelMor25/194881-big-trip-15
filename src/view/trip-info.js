import { getTotalprice, getRoute, getDate } from "../utils/utils";

const createTripInfo = () => (
  `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
  </div>
</section>`
);

const createTripInfoRouteDate = (events) => (
  `<h1 class="trip-info__title">${getRoute(events)}</h1>
  <p class="trip-info__dates">${getDate(events)}</p>`
);

const createTripInfoPrice = (events) => (
  `<p class="trip-info__cost">
  Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTotalprice(events)}</span>
</p>`
);

export {createTripInfo, createTripInfoRouteDate, createTripInfoPrice};
