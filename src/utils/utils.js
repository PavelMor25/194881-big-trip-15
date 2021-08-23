import dayjs from 'dayjs';

const getDateFormat = (date, format) => dayjs(date).format(format);

const getDateDif = (dateFrom, dateTo) => {
  const dateStart = dayjs(Math.min(dateFrom, dateTo));
  const dateEnd = dayjs(Math.max(dateFrom, dateTo));
  const difDay = dateEnd.diff(dateStart, 'd') > 10 ? dateEnd.diff(dateStart, 'd') : `0${dateEnd.diff(dateStart, 'd')}`;
  const difHour = (dateEnd.diff(dateStart, 'h') - difDay * 24) > 10 ? (dateEnd.diff(dateStart, 'h') - difDay * 24) : `0${(dateEnd.diff(dateStart, 'h') - difDay * 24)}`;
  const difMinute = (dateEnd.diff(dateStart, 'm') - difHour * 60 - difDay * 1440) > 10 ? (dateEnd.diff(dateStart, 'm') - difHour * 60 - difDay * 1440) : `0${(dateEnd.diff(dateStart, 'm') - difHour * 60 - difDay * 1440)}`;
  if (difDay > 0) {
    return `${difDay}D ${difHour}H ${difMinute}M` ;
  } else {
    return difHour > 0 ? `${difHour}H ${difMinute}M` : `${difMinute}M`;
  }
};

const render = (container, template, place) => container.insertAdjacentHTML(place, template);

// const getTotalprice = (events) => {
//   let totalPrice = 0;
//   const offerPrice = (offer) => {
//     const sum = 0;
//     if (!offer) {
//       return 0;
//     }
//     return sum;
//   };
//   for (let i = 0; i < events.length; i++) {
//     totalPrice += events[i].price;
//     totalPrice += offerPrice(events[i].offer);
//   }
//   // events.forEach((item) => {
//   //   totalPrice += item.price;
//   //   totalPrice += offerPrice(item.offer);
//   // });
//   return totalPrice;
// };

const getTotalPrice = (events) => events.reduce(
  (totalPrice, element) => totalPrice + element.price +
  (element.offer
    ? element.offer.reduce((sumOffer, offer) => sumOffer + offer.price, 0)
    : 0), 0);


const getRoute = (events) => {
  let copyEvents = events.slice();
  copyEvents = copyEvents.sort((a, b) => a.date.from - b.date.from);
  const route = [copyEvents[0].destination.place];
  let currentPlace = copyEvents[0].destination.place;
  for (let i = 1; i < copyEvents.length; i++) {
    if (!(currentPlace === copyEvents[i].destination.place)) {
      route.push(copyEvents[i].destination.place);
      currentPlace = copyEvents[i].destination.place;
    }
  }

  return route.length < 3 ? route.join('  &mdash; ') : `${route[0]} &mdash; ... &mdash; ${route[route.length - 1]}`;
};


const getDate = (events) => {
  let copyEvents = events.slice();
  copyEvents = copyEvents.sort((a, b) => a.date.from - b.date.from);
  return (
    getDateFormat(copyEvents[0].date.from, 'MMM') === getDateFormat(copyEvents[copyEvents.length - 1].date.to, 'MMM')
      ? `${getDateFormat(copyEvents[0].date.from, 'MMM DD')} &mdash; ${getDateFormat(copyEvents[copyEvents.length - 1].date.to, 'DD')}`
      : `${getDateFormat(copyEvents[0].date.from, 'MMM DD')} &mdash; ${getDateFormat(copyEvents[copyEvents.length - 1].date.to, 'MMM DD')}`);
};


export {getDateFormat, getDateDif, render, getTotalPrice, getRoute, getDate};
