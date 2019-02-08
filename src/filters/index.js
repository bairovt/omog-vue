'use strict';
import {store} from '@/store/store'

export function translate(word, padezh){
  const dict = {
    'mother': {i: 'мать', r: 'матери', d: 'матери', v: 'мать'},
    'father': {i: 'отец', v: 'отца'},
    'son': {i: 'сын', v: 'сына'},
    'daughter': {i: 'дочь', v: 'дочь'},
    'parent': {v: 'родителя'},
    'child': {v: 'ребенка'},
  }
  return dict[word][padezh];
}

export function surName(person){
  if (person.surname) return person.surname + ' ' + person.name
  // if (person.surname) return person.name + ' ' + person.surname
  return person.name
}

export function predokRelation(a){
  let gender = a.person.gender;
  let relation = '';
  if (gender !== 0 && gender !==1) return relation;
  switch (a.pathLength) {
    case 1:
      relation = gender === 0 ?  'мать' : 'отец'; break;
    case 2:
      relation = gender === 0 ?  'бабушка' : 'дед'; break;
    case 3:
      relation = gender === 0 ?  'прабабушка' : 'прадед'; break;
    default:
      relation = 'предок ' + a.pathLength + '-е ' + 'колено'; break;
  }
  return relation;
}

export function potomokRelation(d){
  let gender = d.person.gender;
  let relation = '';
  if (gender !== 0 && gender !==1) return relation;
  // switch (d.edges.length) {
  switch (d.pathLength) {
    case 1:
      relation = gender === 0 ?  'дочь' : 'сын'; break;
    case 2:
      relation = gender === 0 ?  'внучка' : 'внук'; break;
    case 3:
      relation = gender === 0 ?  'правнучка' : 'правнук'; break;
    default:
      // relation = d.edges.length + "-е " + "колено"; break;
      relation = 'потомок ' + d.pathLength + '-е ' + 'колено'; break;
  }
  return relation
}

export function gender(gen){
  return {'0': 'жен', '1': 'муж', '2': ''}[gen];
}

export function keyFromId(id){
  return id.split('/')[1]
}

export function rodName(_id) {
  const rod =  store.state.rods.find((el) => {
    return el._id === _id
  })
  if (rod) return rod.name
}
