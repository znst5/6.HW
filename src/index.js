import './css/style.css';
import { renderBoard } from './js/trello';

document.addEventListener("DOMContentLoaded", () => {
  renderBoard();
  initAddCardListeners();
});

function initAddCardListeners() {
  document.querySelectorAll('.column').forEach(column => {
    const addBtn = column.querySelector('.add-button');
    const formContainer = column.querySelector('.form-container');
    const saveBtn = column.querySelector('.save-button');
    const cancelBtn = column.querySelector('.cancel-button');
    const textarea = column.querySelector('.card-input');
    const columnId = column.dataset.id;

    addBtn.addEventListener("click", () => {
      addBtn.classList.add("hidden");
      formContainer.classList.remove("hidden");
      textarea.focus();
    });

    const closeForm = () => {
      formContainer.classList.add("hidden");
      addBtn.classList.remove("hidden");
      textarea.value = '';
    };

    cancelBtn.addEventListener("click", closeForm);

    saveBtn.addEventListener("click", () => {
      const text = textarea.value.trim();
      if (text) {
        import('./js/state').then(({ getState, saveState }) => {
          const state = getState();
          state[columnId].push(text);
          saveState(state);
          renderBoard();
          closeForm();
        });
      }
    });
  });
}
