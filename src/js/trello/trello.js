import TaskColumn from './taskColumn';

export default class Trello {
  constructor(taskColumns) {
    this.state = {
      maxId: 0,
    };
    this.el = document.createElement('div');
    this.el.classList.add('trello');

    this.dndBuffer = null;
    this.previouseMousePosition = null;
    this.dndOriginalElement = null;
    this.dndTaskColumn = null;

    this.emptyElement = document.createElement('div');
    this.emptyElement.classList.add('empty-element');

    if (taskColumns) {
      this.taskColumns = taskColumns;
    } else {
      this.taskColumns = {
        TODO: new TaskColumn('TODO'),
        'IN PROGRESS': new TaskColumn('IN PROGRESS'),
        DONE: new TaskColumn('DONE'),
      };
    }

    this.lastSaveMouseData = {
      taskColumn: null,
      taskElement: null,
      position: null,
    };

    Object.values(this.taskColumns).forEach((taskColumn) => {
      taskColumn.bindToDOM(this.el);
      taskColumn.setTrelloState(this.state);
    });

    this.setListeners();
  }

  setListeners() {
    this.el.addEventListener('mouseleave', () => {
      this.dndBuffer?.remove();
      this.dndBuffer = null;
      this.previouseMousePosition = null;
      this.el.style.cursor = 'pointer';
    });

    this.el.addEventListener('mouseout', (event) => {
      const { target } = event;

      if (!this.dndBuffer) {
        return;
      }

      const taskElement = target.closest('.task');
      const taskColumnElement = target.closest('.task-column');

      if (!taskColumnElement) {
        return;
      }

      const taskColumn = this.taskColumns[taskColumnElement.dataset.title];

      this.emptyElement.style.width = `${this.dndOriginalElement.offsetWidth}px`;
      this.emptyElement.style.height = `${this.dndOriginalElement.offsetHeight}px`;

      this.lastSaveMouseData.taskColumn = taskColumn;

      if (taskColumn.tasks.length === 0) {
        this.emptyElement.classList.remove('d-none');
        taskColumn.addEmptyElement(this.emptyElement);
        this.lastSaveMouseData.taskElement = null;
        return;
      }

      if (!taskElement || this.dndOriginalElement === taskElement) {
        return;
      }

      const { pageY } = event;
      const { top } = taskElement.getBoundingClientRect();
      const position =
        top + window.scrollY + taskElement.offsetHeight / 2 > pageY
          ? 'before'
          : 'after';

      if (
        taskElement !== this.lastSaveMouseData.taskColumn &&
        position !== this.lastSaveMouseData.position
      ) {
        this.lastSaveMouseData.taskColumn?.deleteEmptyElement();

        this.emptyElement.classList.remove('d-none');
        taskColumn.addEmptyElement(this.emptyElement, position, taskElement);
      }

      this.lastSaveMouseData.taskElement = taskElement;
    });

    this.el.addEventListener('mousemove', (event) => {
      if (!this.dndBuffer) {
        return;
      }

      event.preventDefault();

      const { pageX, pageY } = event;

      const shiftPositions = {
        x: pageX - this.previouseMousePosition.pageX,
        y: pageY - this.previouseMousePosition.pageY,
      };

      const oldPosition = {
        y: Number(this.dndBuffer.style.top.replace('px', '')),
        x: Number(this.dndBuffer.style.left.replace('px', '')),
      };

      this.dndBuffer.style.top = `${oldPosition.y + shiftPositions.y}px`;
      this.dndBuffer.style.left = `${oldPosition.x + shiftPositions.x}px`;

      this.previouseMousePosition.pageX = pageX;
      this.previouseMousePosition.pageY = pageY;
    });

    this.el.addEventListener('mousedown', (event) => {
      const { target } = event;
      const task = target.closest('.task');
      const deleteButton = target.closest('.task-delete-btn');

      if (task && !deleteButton) {
        const taskColumnElement = target.closest('.task-column');
        this.dndTaskColumn = this.taskColumns[taskColumnElement.dataset.title];

        const { pageX, pageY } = event;

        this.previouseMousePosition = {
          pageX,
          pageY,
        };

        this.dndOriginalElement = task;

        this.dndBuffer = task.cloneNode(true);
        this.dndBuffer.classList.remove('task');
        this.dndBuffer.classList.add('task-shadow');

        this.dndBuffer.style.width = `${this.dndOriginalElement.offsetWidth}px`;
        this.dndBuffer.style.height = `${this.dndOriginalElement.offsetHeight}px`;

        const { left, top } = this.dndOriginalElement.getBoundingClientRect();

        this.dndBuffer.style.top = `${top + window.scrollY}px`;
        this.dndBuffer.style.left = `${left + window.scrollX}px`;

        this.el.append(this.dndBuffer);
        this.el.style.cursor = 'grabbing';
      }
    });

    this.el.addEventListener('mouseup', (event) => {
      const { taskElement } = this.lastSaveMouseData;

      if (this.dndBuffer) {
        const taskId = Number(this.dndOriginalElement.dataset.id);
        const task = this.dndTaskColumn.getTask(taskId);

        if (taskElement) {
          const { pageY } = event;
          const { top } = taskElement.getBoundingClientRect();
          const position =
            top + window.scrollY + taskElement.offsetHeight / 2 > pageY
              ? 'before'
              : 'after';

          this.lastSaveMouseData.taskColumn.addTask(
            task,
            position,
            taskElement
          );
        } else {
          this.lastSaveMouseData.taskColumn.addTask(task);
        }

        this.dndTaskColumn.extractTask(taskId);
      }

      this.dndBuffer?.remove();
      this.dndBuffer = null;
      this.previouseMousePosition = null;
      this.dndOriginalElement = null;
      this.el.style.cursor = 'pointer';

      this.lastSaveMouseData.taskColumn?.deleteEmptyElement();
      this.lastSaveMouseData.taskElement = null;
    });
  }

  bindToDOM(parentEl) {
    parentEl.insertAdjacentElement('beforeEnd', this.el);
  }
}
