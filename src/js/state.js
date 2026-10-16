let state = {
  todo: ["Welcome to Trello!", "This is a card."],
  "in-progress": ["Invite your team to this board."],
  done: ["To learn more tricks, check out the guide."]
};

const savedState = localStorage.getItem("trello-state");
if (savedState) {
  try {
    state = JSON.parse(savedState);
  } catch (e) {
    console.error("Ошибка чтения localStorage", e);
  }
}

export function getState() {
  return state;
}

export function saveState(newState) {
  state = newState;
  localStorage.setItem("trello-state", JSON.stringify(state));
}
