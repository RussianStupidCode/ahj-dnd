export default class CardList {
  constructor(CardClass) {
    this.currentCardId = 0;
    this.el = document.createElement('div');
    this.el.classList.add('gallery-card-list');

    this.CardClass = CardClass;

    this.cards = {};

    this.setListeners();
  }

  setListeners() {
    this.el.addEventListener('click', (event) => {
      const { target } = event;
      const closeButton = target.closest('.card-close-button');

      const card = target.closest('.gallery-card');

      if (closeButton) {
        this.removeCard(card.dataset.id);
      }
    });
  }

  add(title, src, loadCallback) {
    const card = new this.CardClass(
      title,
      src,
      this.currentCardId,
      loadCallback
    );
    this.cards[this.currentCardId] = card;

    card.bindToDOM(this.el);

    this.currentCardId += 1;
  }

  removeCard(id) {
    const card = this.cards[id];

    if (card) {
      card.remove();
      delete this.cards[id];
    }
  }

  bindToDOM(parentElement) {
    parentElement.insertAdjacentElement('beforeEnd', this.el);
  }
}
