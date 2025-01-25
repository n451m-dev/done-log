import { pushTodoInSpreadsheet } from './spreadsheet.js';


/**
 * Displays a personalized greeting message based on the current time and user input.
 */
(function showGreeting() {
    function getGreetings(currentHours) {
        if (currentHours <= 12) {
            return "Good Morning";
        }
        else if (currentHours <= 18 && currentHours > 12) {
            return "Good After Noon";
        } else {
            return "Good Evening";
        }
    }

    let today = new Date();
    let currentHours = today.getHours();
    let greeting = getGreetings(currentHours);
    let name = localStorage.getItem("name");
    
    if (!name) {
        name = prompt("Plase enter your first name:");
        localStorage.setItem('name', name);
    }

    document.querySelector(".greeting").innerHTML = greeting + " " + name;
    document.querySelector(".time").innerHTML = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.querySelector('.date').innerHTML = new Date().toDateString();
})();

/**
 * Fetches and displays a random inspirational quote.
 */
(async function showQuote() {
    try {
        let response = await fetch("https://n451m-dev.github.io/staticjsondata/quote.json");
        let data = await response.json();
        let arrlength = data.length;
        let rnum = Math.floor(Math.random() * arrlength);
        document.querySelector('.quote').innerText = data[rnum].text;
        document.querySelector('.author').innerText = "-" + data[rnum].author;
    } catch (err) {
        document.querySelector('.quote').innerText = "Inspiration is unavailable.";
        document.querySelector('.author').innerText = "- Unknown";
    }
        
})();

// DOM elements
let createTodoButton = document.querySelector(".btn");
let todoInput = document.querySelector(".input");
let todoContainer = document.querySelector('.todos-container');
let startInput = document.querySelector('.start-time');
let endInput = document.querySelector('.end-time');

/**
 * Handles the creation of new to-do items when the add button is clicked.
 */
createTodoButton.addEventListener('click', function (event) {
        event.preventDefault();
        if (!todoInput.value || todoInput.value.trim().length<1) return showToast('Please Enter task to do');
        let divele = document.createElement('div')
        let todoElement = document.createElement('span');
        todoElement.innerText = todoInput.value;
        todoElement.classList.add("mytodo");
        divele.appendChild(todoElement);
        let doneBtn = document.createElement('button');
        doneBtn.classList.add('done');
        doneBtn.onclick = markAsDone;
        doneBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>'
        divele.appendChild(doneBtn);
        todoContainer.appendChild(divele);
        divele.classList.add('mytodo-container')
        
        // create delete buton
        let deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete');
        deleteBtn.onclick = deleteTodo;
        deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>';
        divele.appendChild(deleteBtn);
        // create span element to show start time
        let startSpan = document.createElement('span')
        startSpan.innerText = startInput.value;
        startSpan.classList.add("show-start");
        divele.appendChild(startSpan);
        //create span element to show end time
        let endSpan = document.createElement('span')
        endSpan.innerText = endInput.value;
        endSpan.classList.add("show-end");
        divele.appendChild(endSpan);
        const todoId = new Date().getTime();
        divele.id = todoId;

        setTodos(todoInput.value.trim(), false, startInput.value, endInput.value, new Date(), todoId);
        
        todoInput.value = '';
        startInput.value = '';
        endInput.value = '';
    
});

/**
 * Saves a new to -do in local storage.
 */
function setTodos(todo, isDone, startTime, endTime, createdAt, todoId ) {
    let todos = getTodos();
    todos.push({todoId: todoId, todo:todo, isDone:isDone, startTime:startTime,endTime:endTime, createdAt:createdAt});
    localStorage.setItem("mytodos", JSON.stringify(todos));
}

/**
 * Retrieves to-dos from local storage.
 * @returns {Array} Array of to-do objects
 */
function getTodos() {
    let todos;
    if (localStorage.getItem("mytodos") === null) {
      todos = [];
    } else {
      todos = JSON.parse(localStorage.getItem("mytodos"));
    }
    return todos;
  }

// create already available todo on loading the page
function createTodoOnLoad() {
    let todos = getTodos();
    todos.forEach(todoObj => {
        let completeClasss = 'incomplete';
        if (todoObj.isDone) {
            completeClasss="completed"
        }
        createTodoElements(todoObj.todo, completeClasss, todoObj.startTime, todoObj.endTime, todoObj.todoId);
    });
}

function createTodoElements(todo, compClass, startTime, endTime, todoId) {
        let divele = document.createElement('div');
        divele.classList.add(compClass)
        let todoElement = document.createElement('span');
        todoElement.innerText = todo;
        todoElement.classList.add("mytodo");
        
        divele.appendChild(todoElement);
        let doneBtn = document.createElement('button');
        doneBtn.classList.add('done');
        doneBtn.onclick = markAsDone;
        
        doneBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>'
        divele.appendChild(doneBtn);
        divele.classList.add('mytodo-container')
        todoContainer.appendChild(divele);
        let deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete');
        deleteBtn.onclick = deleteTodo;
        deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>';
        divele.appendChild(deleteBtn);
        // create span element to show start time
        let startSpan = document.createElement('span');
        startSpan.innerText = startTime;
        startSpan.classList.add("show-start");
        divele.appendChild(startSpan);
        // create span element to show end time
        let endSpan = document.createElement('span')
        endSpan.innerText = endTime;
        endSpan.classList.add("show-end");
        divele.appendChild(endSpan);
        divele.id = todoId;

}

window.addEventListener('load', createTodoOnLoad);
/**
 * Deletes a to-do item from the DOM and local storage.
 */
function deleteTodo(event){
    const parent = event.currentTarget.parentElement;
    const todoId = parent.id;
    console.log("todoId", todoId);
    deleteOneTodoFromLocalStorageById(todoId);
    parent.remove();
}
/**
 * Marks a to-do as completed.
 */
function markAsDone(event){
const doneBtn = event.currentTarget;
const parent = doneBtn.parentElement;
const mytodo = parent.querySelector('.mytodo');
let todos = getTodos();
        const foundTodo = todos.find(ele => ele.todo === mytodo.innerText);
        if (foundTodo) {
            foundTodo.isDone = true;
            foundTodo.doneAt = new Date();
            localStorage.setItem('mytodos', JSON.stringify(todos));
        }
        parent.classList.add('completed');
}

function deleteOneTodoFromLocalStorageById(todoId) {
    let todos = getTodos();
    todos = todos.filter(todo => todo.todoId != todoId);
    localStorage.setItem("mytodos", JSON.stringify(todos));
}

// delete previous days already done todos
(async function autoDeleteOldAlreadyDoneTodo() {

    let checkdate = localStorage.getItem('checkdate');
    if (!checkdate) {
        localStorage.setItem('checkdate', new Date());
    }
    if (new Date().getDate() - new Date(checkdate).getDate() > 0) {
        await deleteAlreadyDoneTodo()
    }
})()

async function deleteAlreadyDoneTodo(){
    if(!navigator.onLine) return showToast('Please connect to internet to push done todos in google sheet');;
    let todos = getTodos();
    let myTaskArr = [];
      todos.forEach(elem => {
        if (elem.isDone == true) {
          myTaskArr.push([elem.todo, elem.createdAt,elem.doneAt, elem.startTime, elem.endTime, elem.isDone]);
          deleteOneTodoFromLocalStorageById(elem.todoId);
          }
      });
     if(myTaskArr.length>0) await pushTodoInSpreadsheet(myTaskArr);
     
      localStorage.setItem('checkdate', new Date());
      
      showToast('Done tasks cleared successfully');

      setTimeout(() => {
        location.reload(); 
    }, 2500);
}

document.querySelector(".cleartodos").addEventListener('click', clearTodos);

async function clearTodos(event){
    await deleteAlreadyDoneTodo();
}

/**
 * Shows a toast notification with the provided message.
 */
function showToast(message) {
    const toast = document.querySelector('.toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 3000); 
  }