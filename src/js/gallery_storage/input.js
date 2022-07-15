export default class Input {
  constructor(title) {
    this.el = document.createElement('div');
    this.el.classList.add('dnd-block');

    const titleElement = document.createElement('div');
    titleElement.classList.add('dnd-title');
    titleElement.textContent = title;

    this.input = document.createElement('input');
    this.input.type = 'file';
    this.input.classList.add('dnd-file-input');
    this.input.accept = 'image/png, image/jpeg';

    this.el.insertAdjacentElement('beforeEnd', titleElement);
    this.el.insertAdjacentElement('beforeEnd', this.input);

    this.filesList = [];

    this.setListeners();
  }

  setListeners() {
    this.el.addEventListener('click', () => {
      this.input.click();
    });

    this.input.addEventListener('change', () => {
      this.filesList = this.input.files;
      this.createCallback?.();
    });

    this.el.addEventListener('dragover', (event) => {
      event.preventDefault();
    });

    this.el.addEventListener('drop', (event) => {
      event.preventDefault();

      this.filesList = event.dataTransfer.files;
      this.createCallback?.();
    });
  }

  get files() {
    return this.filesList;
  }

  reset() {
    this.input.value = null;
  }

  addCreateCallback(createCallback) {
    this.createCallback = createCallback;
  }

  bindToDOM(parentElement) {
    parentElement.insertAdjacentElement('beforeEnd', this.el);
  }
}
