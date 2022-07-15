export default class TaskAddButton {
  constructor() {
    this.addCallback = null;
    this.el = document.createElement('div');
    this.el.classList.add('task-add-block');

    this.openFormButton = document.createElement('button');
    this.openFormButton.classList.add('btn', 'btn-primary', 'p-1', 'm-1');
    this.openFormButton.textContent = '+ add task';

    this.addForm = document.createElement('div');
    this.addForm.classList.add(
      'd-flex',
      'flex-column',
      'align-items-center',
      'd-none'
    );

    this.input = document.createElement('textarea');
    this.input.classList.add('form-control');
    this.input.rows = 3;

    const formButtonBlock = document.createElement('div');
    formButtonBlock.classList.add('d-flex');

    this.addButton = document.createElement('button');
    this.addButton.classList.add('btn', 'btn-success', 'p-1', 'm-1');
    this.addButton.textContent = 'Add task';

    this.showFormButton = document.createElement('button');
    this.showFormButton.classList.add('btn', 'btn-warning', 'p-1', 'm-1');
    this.showFormButton.textContent = 'X';

    formButtonBlock.insertAdjacentElement('beforeEnd', this.addButton);
    formButtonBlock.insertAdjacentElement('beforeEnd', this.showFormButton);

    this.addForm.insertAdjacentElement('beforeEnd', this.input);
    this.addForm.insertAdjacentElement('beforeEnd', formButtonBlock);

    this.el.insertAdjacentElement('beforeEnd', this.openFormButton);
    this.el.insertAdjacentElement('beforeEnd', this.addForm);

    this.setListeners();
  }

  setAddCallback(addCallback) {
    this.addCallback = addCallback;
  }

  setListeners() {
    this.openFormButton.addEventListener('click', (event) => {
      event.preventDefault();

      this.openFormButton.classList.add('d-none');
      this.addForm.classList.remove('d-none');

      this.input.value = '';
    });

    this.showFormButton.addEventListener('click', (event) => {
      event.preventDefault();

      this.openFormButton.classList.remove('d-none');
      this.addForm.classList.add('d-none');
    });

    this.addButton.addEventListener('click', (event) => {
      event.preventDefault();

      const value = this.input.value.trim();

      if (value.length > 0) {
        this.addCallback?.(value);
        this.showFormButton.click();
      }

      this.input.value = '';
    });
  }

  bindToDOM(parentEl) {
    parentEl.insertAdjacentElement('beforeEnd', this.el);
  }
}
