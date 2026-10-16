import { getState, saveState } from './state';

let draggedCardEl = null;
let shiftX = 0;
let shiftY = 0;
const placeholderEl = document.createElement("div");
placeholderEl.classList.add("placeholder");
export function renderBoard() {
  const state = getState();

  Object.keys(state).forEach(columnId => {
    const columnEl = document.querySelector(`.column[data-id="${columnId}"]`);
    if (!columnEl) return;

    const container = columnEl.querySelector(".cards-container");
    if (!container) return;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    state[columnId].forEach((text, index) => {
      const cardEl = document.createElement("div");
      cardEl.classList.add("card");
      cardEl.textContent = text;

      const deleteBtn = document.createElement("span");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.textContent = "×";
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        state[columnId].splice(index, 1);
        saveState(state);
        renderBoard();
      });

      cardEl.appendChild(deleteBtn);
      container.appendChild(cardEl);
    });
  });

  initCustomDragAndDrop();
}

function initCustomDragAndDrop() {
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    card.addEventListener("mousedown", (e) => {
      if (e.target.classList.contains("delete-btn")) return;
      if (e.button !== 0) return;

      e.preventDefault();
      draggedCardEl = card;

      const rect = card.getBoundingClientRect();
      shiftX = e.clientX - rect.left;
      shiftY = e.clientY - rect.top;

      placeholderEl.style.height = `${card.offsetHeight}px`;
      card.after(placeholderEl);

      card.classList.add("dragging");
      card.style.width = `${rect.width}px`;
      card.style.left = `${e.clientX - shiftX}px`;
      card.style.top = `${e.clientY - shiftY}px`;

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  });
}

function onMouseMove(e) {
  if (!draggedCardEl) return;

  draggedCardEl.style.left = `${e.clientX - shiftX}px`;
  draggedCardEl.style.top = `${e.clientY - shiftY}px`;

  draggedCardEl.style.display = "none";
  const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
  draggedCardEl.style.display = "block";

  if (!elemBelow) return;

  const container = elemBelow.closest(".card-container") || (elemBelow.closest(".column") ? elemBelow.closest(".column").querySelector(".cards-container") : null);

  if (container) {
    const cardBelow = elemBelow.closest(".card:not(.dragging");
    if (cardBelow) {
      const rect = cardBelow.getBoundingClientRect();
      const next = (e.clientY - rect.top) > (rect.height / 2);
      container.insertBefore(placeholderEl, next ? cardBelow.nextSibling : cardBelow);
    } else {
      container.appendChild(placeholderEl);
    }
  }
}

function onMouseUp(e) {
  if (!draggedCardEl) return;

  draggedCardEl.style.display = "none";
  const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
  draggedCardEl.style.display = 'block';

  let targetContainer = null;
  if (elemBelow) {
    targetContainer = elemBelow.closest(".cards-container") || (elemBelow.closest(".column") ? elemBelow.closest(".column").querySelector(".card-container") : null);
  }

  if (targetContainer) {
    if (placeholderEl.parentNode === targetContainer) {
      placeholderEl.after(draggedCardEl);
    } else {
      targetContainer.appendChild(draggedCardEl);
    }
  } else if (placeholderEl.parentNode) {
    placeholderEl.after(draggedCardEl);
  }

  draggedCardEl.classList.remove("dragging");
  draggedCardEl.style.position = '';
  draggedCardEl.style.left = '';
  draggedCardEl.style.top = '';
  draggedCardEl.style.width = '';

  if (placeholderEl.parentNode) {
    placeholderEl.parentNode.removeChild(placeholderEl);
  }

  const newState = { todo: [], "in-progress": [], done: [] };
  document.querySelectorAll(".column").forEach(col => {
    const colId = col.dataset.id;
    col.querySelectorAll(".card").forEach(c => {
      newState[colId].push(c.firstChild.textContent);
    });
  });

  saveState(newState);
  renderBoard();

  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
  draggedCardEl = null;
}
