import Task from './task';
import TaskAddButton from './taskAddButton';
import TaskContent from './taskContent';

export default class TaskColumn {
  static fromObject(object) {
    const taskColumn = new TaskColumn(object.title);

    object.tasks.forEach((taskObject) => {
      const task = Task.fromObject(taskObject);
      taskColumn.tasks.push(task);
      task.bindToDOM(taskColumn.taskColumnContent);
    });

    return taskColumn;
  }

  constructor(title) {
    this.trelloState = null;
    this.el = document.createElement('div');
    this.el.classList.add('task-column');

    this.el.dataset.title = title;

    this.emptyElement = null;

    const titleEl = document.createElement('div');
    titleEl.classList.add('task-column-title');
    titleEl.textContent = title;

    this.taskColumnContent = document.createElement('div');
    this.taskColumnContent.classList.add('task-column-content');

    this.el.insertAdjacentElement('beforeEnd', titleEl);
    this.el.insertAdjacentElement('beforeEnd', this.taskColumnContent);

    this.addButton = new TaskAddButton();

    this.addButton.bindToDOM(this.el);

    this.tasks = [];

    this.setListeners();
  }

  setTrelloState(trelloState) {
    this.trelloState = trelloState;

    this.addButton.setAddCallback((taskContent) => {
      const task = new Task(this.trelloState.maxId);
      this.trelloState.maxId += 1;
      task.setContent(new TaskContent('text', taskContent));
      this.addTask(task);
    });
  }

  setListeners() {
    this.el.addEventListener('click', (event) => {
      event.preventDefault();
      const { target } = event;

      const closeBtn = target?.closest('.task-delete-btn');

      if (closeBtn) {
        const taskEl = closeBtn.closest('.task');

        this.deleteTask(Number(taskEl.dataset.id));
      }
    });

    this.taskColumnContent.addEventListener('mouseleave', () => {
      this.deleteEmptyElement();
    });
  }

  addTask(task, position = 'before', relativeTaskElement) {
    if (relativeTaskElement === undefined) {
      this.tasks.push(task);
      task.bindToDOM(this.taskColumnContent);
      this.trelloState?.saveState();
      return;
    }

    const taskIndex = this.tasks.findIndex(
      (task) => task.el === relativeTaskElement
    );

    if (position === 'before') {
      this.taskColumnContent.insertBefore(task.el, relativeTaskElement);
      this.tasks.splice(taskIndex, 0, task);
    } else {
      this.taskColumnContent.insertBefore(
        task.el,
        relativeTaskElement.nextSibling
      );
      this.tasks.splice(taskIndex + 1, 0, task);
    }
    this.trelloState?.saveState();
  }

  addEmptyElement(element, position = 'before', relativeTaskElement) {
    if (!relativeTaskElement) {
      this.taskColumnContent.append(element);
    }

    if (position === 'before') {
      this.taskColumnContent.insertBefore(element, relativeTaskElement);
    } else {
      this.taskColumnContent.insertBefore(
        element,
        relativeTaskElement.nextSibling
      );
    }

    this.emptyElement = element;
  }

  deleteEmptyElement() {
    this.emptyElement?.classList.add('d-none');
  }

  deleteTask(id) {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    const task = this.tasks[taskIndex];
    task.remove();
    this.tasks.splice(taskIndex, 1);
    this.trelloState?.saveState();
  }

  extractTask(id) {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    this.tasks.splice(taskIndex, 1);
    this.trelloState?.saveState();
  }

  getTask(id) {
    return this.tasks.find((task) => task.id === id);
  }

  toObject() {
    return {
      title: this.el.dataset.title,
      tasks: this.tasks.map((task) => task.toObject()),
    };
  }

  bindToDOM(parentEl) {
    parentEl.insertAdjacentElement('beforeEnd', this.el);
  }
}
