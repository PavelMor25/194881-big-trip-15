import dayjs from 'dayjs';

export const makeItemsUniq = (items) => [...new Set(items)];

export const countPointsByMoney = (items, type) => items.filter((point) => point.type === type).reduce((prevValue, curElem) => prevValue + Number(curElem.price), 0);

export const countPointsByType = (items, type) => items.filter((point) => point.type === type).length;

const getDifMinute = (item) => {
  const dateStart = dayjs(item.date.from);
  const dateEnd = dayjs(item.date.to);
  return dateEnd.diff(dateStart, 'm');
};

export const countByTime = (items, type) => items.filter((point) => point.type === type).reduce((prevVal, curElem) => prevVal + getDifMinute(curElem), 0);

export const sortUniqType = (uniqType, value, typeArr = true) => {
  const typeValue =  uniqType.map((type ,index) => ({type: type, value: value[index]})).sort((a,b)=> b.value - a.value);
  return typeArr ? typeValue.map((element) => element.type) : typeValue.map((element) => element.value);
};
