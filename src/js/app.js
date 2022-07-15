import Card from './gallery_storage/card';
import CardList from './gallery_storage/cardList';
import Gallery from './gallery_storage/gallery';
import Trello from './trello/trello';

const controls = document.querySelector('.controls');
const field = document.querySelector('.field');

function createControlButton(text, uniqueClass, callback) {
  const btn = document.createElement('button');
  btn.classList.add(
    'btn',
    'bg-primary',
    'text-white',
    'm-2',
    'p-2',
    uniqueClass
  );
  btn.textContent = text;

  btn.addEventListener('click', (event) => {
    field.innerHTML = '';
    callback(event);
  });

  controls.insertAdjacentElement('beforeEnd', btn);
}

createControlButton('trello (#1)', 'trello-start-button', () => {
  field.innerHTML = '';

  const trello = new Trello(window.localStorage);
  trello.bindToDOM(field);
});

createControlButton('gallery (#2)', 'gallery-start-button', () => {
  field.innerHTML = '';

  const gallery = new Gallery(CardList, Card);
  gallery.bindToDOM(field);
});
