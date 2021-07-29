const createTripInfo = () => (
  `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
  </div>
</section>`
);

const createTripInfoRoute = () => '<h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>';

const createTripInfoDate = () => '<p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>';

const createTripInfoPrice = () => (
  `<p class="trip-info__cost">
  Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
</p>`
);

export {createTripInfo, createTripInfoRoute, createTripInfoDate, createTripInfoPrice};
