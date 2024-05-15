// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) 
let nextId = JSON.parse(localStorage.getItem("nextId")) 

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;

}

// Todo: create a function to create a task card
function createTaskCard(task) {
    let taskCard = $('<div>').addClass('card task-card').attr('id', 'task-'  + task.id).draggable({
            revert: 'invalid',
            cursor: 'move',
            snap: '.lane',
            snapMode: 'inner'
        });

        let cardTitle = $('<h5>').addClass('card-title').text(task.title);

        let cardDescription = $('<p>').addClass('card-text').text(task.description);
        
        let cardDueDate = $('<p>').addClass('card-text').text('Due:' + task.dueDate);

        let today = new Date();
        today.setHours(0, 0, 0, 0);

        let dueDate = new Date(task.dueDate);
        dueDate.setHours(0,0,0,0);

        if (dueDate < today) {
            taskCard.addClass('bg-danger');
        }else if (dueDate.getTime() === today.getTime()){
            taskCard.addClass('bg-warning');
        }

        let deleteButton = $('<button>').addClass('btn btn-danger delete-task').text('Delete');

        
        
        let cardBody = $('<div>').addClass('card-body');
        cardBody.append(cardTitle, cardDueDate, cardDescription, deleteButton);
        taskCard.append(cardBody);
        

       
        return taskCard;
    

    
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    
    $(".lane .task-card").remove();

    if (taskList){

        taskList.forEach(task => {
            let lane = task.status === "todo" ? "#to-do" : task.status === "in-progress" ? "#in-progress" : "#done";
            $(lane + " .card-body").append(createTaskCard(task));
        });
    }


    }
 

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    let taskTitle = $('#taskTitle').val();
    let taskDescription= $('#taskDescription').val();
    let taskDueDate = $('#taskDueDate').val();

    if (!taskList) {
        tasklist = [];
    }
    

    let newTask = {
        id: generateTaskId(),
        title: taskTitle,
        description: taskDescription,
        dueDate: taskDueDate,
        
        status: 'todo'
    };
    
    if (Array.isArray(taskList)){ 
        taskList.push(newTask);
    }else{
        taskList = [newTask];
    }

    localStorage.setItem('tasks', JSON.stringify(taskList));
    localStorage.setItem('nextId', nextId);

    renderTaskList();

    $('#formModal').modal('hide');
        

    }
  

  


// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

    let taskCard = $(event.target).closest('.task-card');

    let taskId = parseInt(taskCard.attr('id').split('-') [1]);

    taskList = taskList.filter(task => task.id !== taskId);


    localStorage.setItem('tasks', JSON.stringify(taskList));

    renderTaskList();

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

    let taskCard = ui.helper;
    let taskId = parseInt(taskCard.attr('id').split('-') [1]);
    let newLane = $(event.target).closest('.lane').attr('id');

    taskList.forEach(task => {
        if (task.id === taskId) {
            task.status = newLane;
            if (newLane === 'done') {
                taskCard.removeClass('bg-danger bg-warning').css('background-color', 'white');
            }
        }
    });

    localStorage.setItem('tasks', JSON.stringify(taskList));

    renderTaskList();



}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $("#formModal").on("click", "button.btn-primary", handleAddTask);

    $(".container").on("click", ".delete-task", function(event) {
        handleDeleteTask(event);
    });
   
    $(".lane").droppable({
        accept: ".task-card",
        drop: handleDrop
    });
   
    $("#taskDueDate").datepicker();



});
