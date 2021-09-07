import dayjs from 'dayjs';
import { offerEvents, destinationList } from '../mock/trip-mock';

export const getDateFormat = (date, format) => dayjs(date).format(format);

export const getDateDif = (dateFrom, dateTo) => {
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

export const getTotalPrice = (events) => events.reduce(
  (totalPrice, element) => totalPrice + element.price +
  (element.offer
    ? element.offer.reduce((sumOffer, offer) => sumOffer + offer.price, 0)
    : 0), 0);

export const getRoute = (events) => {
  if (!events.length) {
    return '';
  }
  let routeEvents = events.map((element) => element.destination !== null ? element.destination.place : '');
  let currentPlace = routeEvents[0];
  routeEvents = routeEvents.filter((element, index) =>{
    if (!element){
      return false;
    }
    if (element !== currentPlace || index === 0) {
      currentPlace = element;
      return true;
    }
    return false;
  });

  return routeEvents.length < 3 ? routeEvents.join('  &mdash; ') : `${routeEvents[0]} &mdash; ... &mdash; ${routeEvents[routeEvents.length - 1]}`;
};

export const getDate = (events) => {
  if (!events.length) {
    return '';
  }
  let copyEvents = events.slice();
  copyEvents = copyEvents.sort((a, b) => a.date.from - b.date.from);
  return (
    getDateFormat(copyEvents[0].date.from, 'MMM') === getDateFormat(copyEvents[copyEvents.length - 1].date.to, 'MMM')
      ? `${getDateFormat(copyEvents[0].date.from, 'MMM DD')} &mdash; ${getDateFormat(copyEvents[copyEvents.length - 1].date.to, 'DD')}`
      : `${getDateFormat(copyEvents[0].date.from, 'MMM DD')} &mdash; ${getDateFormat(copyEvents[copyEvents.length - 1].date.to, 'MMM DD')}`);
};

export const sortDay = (dayA, dayB) => dayA.date.from - dayB.date.from;

export const sortTime = (timeA, timeB) =>(timeB.date.to - timeB.date.from) - (timeA.date.to - timeA.date.from);

export const sortPrice = (priceA, priceB) => priceB.price - priceA.price;

export const isOfferList = (element) => offerEvents.some((offerVal) => offerVal.type === element);

export const getOffers = (type, currentOffer) => {
  const offerType = offerEvents.find((typeOffer) => typeOffer.type === type);

  if (!currentOffer) {
    return offerType ? [] : null;
  }

  return offerType.offers[offerType.offers.findIndex((offer) => offer.title === currentOffer)];
};

export const getDestination = (destination) => destination ? destinationList.find((element) => element.place === destination) : null;

