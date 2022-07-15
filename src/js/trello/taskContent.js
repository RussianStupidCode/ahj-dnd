export default class TaskContent {
  constructor(type = 'text', content = '') {
    this.type = type;
    this.el = document.createElement('div');
    this.el.classList.add('task-content');
    this.el.textContent = content;
  }

  toObject() {
    return { type: this.type, content: this.el.textContent };
  }

  bindToDOM(parentEl) {
    parentEl.insertAdjacentElement('beforeEnd', this.el);
  }
}
