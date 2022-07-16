import { transformKey } from "./theme.js";

const addNote = document.querySelector(".add-note");
const createNoteModal = document.querySelector(".add-note-modal");
const modalPallet = document.querySelector(".color-pallets");
const addTodo = document.querySelector("#add-todo");
const modalTodoArea = document.querySelector(".modal-todo-area");

let _globalId = 0;
const controller = {
  _id: null,
  _condition: null,
  _modalActive: null,
};

const defineId = () => _globalId++;

const notes = [];

const getNoteIndex = (id) => {
  let index;
  for (index = 0; index < notes.length; index++) {
    if (notes[index].id === id) {
      return index;
    }
  }
};

const saveNote = () => {
  const newNote = createNote();

  if (getNote(newNote.id) !== null) {
    const index = getNoteIndex(newNote.id);
    notes[index] = newNote;
  } else {
    notes.push(newNote);
  }

  createNoteModal.classList.toggle("open");
  resetNote();
};

const resetNote = () => {
  const noteTitle = document.querySelector("#note-title");
  noteTitle.value = "";

  removeTodo(modalTodoArea);
};

const createNote = () => {
  const noteTitle = document.querySelector("#note-title");
  noteTitle.style.color = "var(--textColor)";
  const bg =
    createNoteModal.style.backgroundColor === ""
      ? "var(--blue)"
      : createNoteModal.style.backgroundColor;

  return {
    title: noteTitle.value === "" ? "Note title here!" : noteTitle.value,
    tasks: [...modalTodoArea.children],
    bg,
    id: controller._condition ? defineId() : controller._id,
  };
};

const removeTodo = (elementParent) => {
  const children = [...elementParent.children];
  children.forEach((child) => {
    elementParent.removeChild(child);
  });
};

const checkTask = (checkbox) => {
  const taskDescription = checkbox.nextElementSibling;
  if (checkbox.checked) {
    taskDescription.classList.add("checked");
  } else {
    taskDescription.classList.remove("checked");
  }
};

const createTodo = () => {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = "todo-input";
  checkbox.setAttribute("checkbox", "");
  checkbox.onclick = function (e) {
    e.stopPropagation();
    checkTask(this);
  };

  const textNote = document.createElement("input");
  textNote.type = "text";
  textNote.classList.add("modal-text-todo");
  textNote.placeholder = "Type your task here!";
  textNote.required = true;

  const todo = document.createElement("div");
  todo.classList.add("todo");
  todo.appendChild(checkbox);
  todo.appendChild(textNote);

  return todo;
};

const showCreateNoteModal = () => {
  createNoteModal.classList.toggle("open");
  controller._modalActive = true;
};

addNote.addEventListener("click", () => {
  controller._condition = true;
  showCreateNoteModal();
});

document.querySelector("#close-modal").addEventListener("click", () => {
  createNoteModal.classList.toggle("open");
  modalPallet.classList.remove("open");
  removeTodo(modalTodoArea);
  updateNoteArea();
  controller._modalActive = false;
});

document.querySelector("#color-pallets").addEventListener("click", () => {
  modalPallet.classList.toggle("open");
});

const appendTodo = () => {
  modalTodoArea.classList.add("todo-area");
  modalTodoArea.appendChild(createTodo());
};

addTodo.addEventListener("click", appendTodo);

const getElementValue = (element) => {
  if (element.tagName === "INPUT") {
    return element.value === "" ? "Type your task here!" : element.value;
  } else {
    return element.innerText === ""
      ? "Type your task here!"
      : element.innerText;
  }
};

const deleteNote = (id) => {
  const note = getNote(id);

  if (note !== null) {
    const index = notes.indexOf(note);
    notes.splice(index, 1);

    const noteModel = document.getElementById(id);
    const noteArea = document.querySelector(".note-area");
    noteArea.removeChild(noteModel);
  }
};

const getNote = (id) => {
  for (let note of notes) {
    if (note.id === Number(id)) {
      return note;
    }
  }

  return null;
};

const updateItems = ({ title, tasks, bg }) => {
  const noteTitle = document.querySelector("#note-title");
  noteTitle.value = title;

  createNoteModal.style.backgroundColor = bg;

  tasks.forEach((task) => {
    let input = document.createElement("input");
    input.type = "text";
    input.value = getElementValue(task.lastChild);

    let checkbox = task.firstChild;
    if (checkbox.checked) {
      input.classList.add("checked");
    } else {
      input.classList.remove("checked");
    }

    task.removeChild(task.lastChild);
    task.appendChild(input);

    modalTodoArea.appendChild(task);
  });
};

const showNoteModal = (noteElement) => {
  if (!controller._modalActive) {
    const note = getNote(noteElement.id);
    updateItems(note);
    controller._id = note.id;
    controller._condition = false;
    showCreateNoteModal();
  }
};

const createNoteModel = ({ title, tasks, bg, id }) => {
  const noteModel = document.createElement("section");
  noteModel.classList.add("note");
  noteModel.style.backgroundColor = bg;

  const h2 = document.createElement("h2");
  h2.innerText = title;
  h2.style.color = "var(--textColor)";

  const actionBtn = document.createElement("div");
  actionBtn.classList.add("action-buttons");

  const deleteNoteIcon = document.createElement("i");
  deleteNoteIcon.classList.add("fa-solid");
  deleteNoteIcon.classList.add("fa-xmark");
  deleteNoteIcon.style.color = "var(--textColor)";
  deleteNoteIcon.id = id;
  deleteNoteIcon.onclick = function (e) {
    e.stopPropagation();
    deleteNote(this.id);
  };

  actionBtn.appendChild(deleteNoteIcon);

  const todoArea = document.createElement("div");
  todoArea.classList.add("todo-area");

  tasks.forEach((task) => {
    let p = document.createElement("p");
    let checkbox = task.firstChild;
    if (checkbox.checked) {
      p.classList.add("checked");
    }
    p.innerText = getElementValue(task.lastChild);
    task.removeChild(task.lastChild);
    task.appendChild(p);

    todoArea.appendChild(task);
  });

  noteModel.appendChild(h2);
  noteModel.appendChild(actionBtn);
  noteModel.appendChild(todoArea);
  noteModel.id = id;
  noteModel.onclick = function () {
    showNoteModal(this);
  };

  return noteModel;
};

const updateNoteArea = () => {
  const noteArea = document.querySelector(".note-area");
  const userNotes = notes.map((note) => createNoteModel(note));

  removeTodo(noteArea);

  userNotes.forEach((note) => {
    noteArea.appendChild(note);
  });
};

document.querySelector(".save-note").addEventListener("click", () => {
  document.querySelector(".color-pallets").classList.remove("open");
  saveNote();
  updateNoteArea();
  controller._modalActive = false;
});

document.querySelectorAll(".pallet").forEach((p) => {
  p.addEventListener("click", () => {
    p.style.backgroundColor = `var(${transformKey(p.id)})`;
    createNoteModal.style.backgroundColor = p.style.backgroundColor;
  });
});
