import Input from './input';

export default class Gallery {
  constructor(CardListClass, CardClass) {
    this.el = document.createElement('div');
    this.el.classList.add('gallery');

    this.dndBlock = new Input('Drag and Drop files here or click to select');
    this.cardList = new CardListClass(CardClass);

    this.dndBlock.bindToDOM(this.el);
    this.cardList.bindToDOM(this.el);

    this.setListeners();
  }

  createCard() {
    const [file] = this.dndBlock.files;

    if (!/\.(png|svg|jpg|jpeg|gif)$/i.test(file.name)) {
      return;
    }

    const src = URL.createObjectURL(file);

    this.cardList.add(file.name, src, () => {
      URL.revokeObjectURL(src);
    });

    this.dndBlock.reset();
  }

  setListeners() {
    this.dndBlock.addCreateCallback(() => {
      this.createCard();
    });
  }

  bindToDOM(parentElement) {
    parentElement.insertAdjacentElement('beforeEnd', this.el);
  }
}
