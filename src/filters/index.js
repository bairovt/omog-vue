'use strict';
import {
  store
} from '@/store/store'

export function translate(word, padezh) {
  const dict = {
    'mother': {
      i: 'мать',
      r: 'матери',
      d: 'матери',
      v: 'мать'
    },
    'father': {
      i: 'отец',
      v: 'отца'
    },
    'son': {
      i: 'сын',
      v: 'сына'
    },
    'daughter': {
      i: 'дочь',
      v: 'дочь'
    },
    'parent': {
      v: 'родителя'
    },
    'child': {
      v: 'ребенка'
    },
  }
  return dict[word][padezh];
}

export function fullName(person) {
  let {
    name,
    surname
  } = person;
  surname = surname ? surname : '';
  let fullname = `${name} ${surname}`
  fullname = fullname.trim();
  return fullname;
}

export function fullestName(person) {
  let {
    name,
    midname,
    surname
  } = person;
  midname = midname ? midname : '';
  surname = surname ? surname : '';
  let fullestName = `${name} ${midname} ${surname}`
  fullestName = fullestName.trim();
  return fullestName;
}

export function predokRelation(a) {
  let gender = a.person.gender;
  let relation = '';
  if (gender !== 0 && gender !== 1) return relation;
  switch (a.pathLength) {
    case 1:
      relation = gender === 0 ? 'мать' : 'отец';
      break;
    case 2:
      relation = gender === 0 ? 'бабушка' : 'дед';
      break;
    case 3:
      relation = gender === 0 ? 'прабабушка' : 'прадед';
      break;
    default:
      relation = 'предок ' + a.pathLength + '-е ' + 'колено';
      break;
  }
  return relation;
}

export function potomokRelation(d) {
  let gender = d.person.gender;
  let relation = '';
  if (gender !== 0 && gender !== 1) return relation;
  // switch (d.edges.length) {
  switch (d.pathLength) {
    case 1:
      relation = gender === 0 ? 'дочь' : 'сын';
      break;
    case 2:
      relation = gender === 0 ? 'внучка' : 'внук';
      break;
    case 3:
      relation = gender === 0 ? 'правнучка' : 'правнук';
      break;
    default:
      // relation = d.edges.length + "-е " + "колено"; break;
      relation = 'потомок ' + d.pathLength + '-е ' + 'колено';
      break;
  }
  return relation
}

export function gender(gen) {
  return {
    '0': 'жен',
    '1': 'муж',
    '2': ''
  } [gen];
}

export function keyFromId(id) {
  return id.split('/')[1]
}

export function rodName(_id) {
  const rod = store.state.rods.find((el) => {
    return el._id === _id
  })
  if (rod) return rod.name
}