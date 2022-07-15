import TaskContent from './taskContent';

export default class Task {
  static fromObject(object) {
    const task = new Task(object.id);

    const { content } = object;
    task.setContent(new TaskContent(content.type, content.content));

    return task;
  }

  constructor(id) {
    this.id = id;
    this.el = document.createElement('div');
    this.el.classList.add('task');
    this.el.dataset.id = id;

    this.deleteButton = document.createElement('button');
    this.deleteButton.classList.add('btn', 'btn-danger', 'task-delete-btn');
    this.deleteButton.innerHTML = '<span>x</span>';

    this.el.insertAdjacentElement('beforeEnd', this.deleteButton);

    this.taskContent = null;
  }

  setContent(taskContent) {
    if (taskContent === undefined) {
      return;
    }

    this.taskContent = taskContent;
    this.taskContent.bindToDOM(this.el);
  }

  toObject() {
    if (!this.taskContent) {
      return { content: null };
    }

    return { id: this.id, content: this.taskContent.toObject() };
  }

  remove() {
    this.el.remove();
  }

  bindToDOM(parentEl) {
    parentEl.insertAdjacentElement('beforeEnd', this.el);
  }
}
