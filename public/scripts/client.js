$(function(){

  console.log('Doc is ready!');

  getTasks();
  $('#task-list').hide();
  $('#taskAdding').hide();

  $('#taskAdding').on('click', '#task-submit', addTask);
  $('#task-list').on('click', '.remove', removeTask);
  $('#task-list').on('click', '.save', updateTask);
  $('#task-list').on('click', '.checkbox', toggleTaskStatus);
  $('#addTaskButton').click(formToggle);
  $('#taskList').click(taskListToggle);
});

function getTasks() {
  $.ajax({
    url: '/tasks',
    type: 'GET',
    success: displayTasks
  });
}

function displayTasks(tasks) {
  console.log('Got tasks from the server', tasks);
  $('#taskAdding').hide();

  $('#task-list').empty();

  tasks.forEach(function(task){ //loops through all tasks and displays them appropriately
      var $li = $('<li></li>');
      var $form = $('<form></form>');
      $form.append('<label for="task">Task:</label>');
      $form.append('<input type="text" name="task" class="form-control" value="'+task.task+'"/>');
      $form.append('<label for="created_on">Created On:</label>');
      var $createdOn = new Date(task.created_on).toISOString().slice(0,10);
      $form.append('<input type="date" name="created_on" value="'+$createdOn+'"/>');
      $form.append('<label for="completed_on">Completed On:</label>');
      if(task.completed_on == null){  //this conditional checks completion status to detemine field text and css styling
        $form.append('<input type="text" class="completed_on" name="completed_on" value="Not Yet Completed"/>');
        var $checkbox = $('<button class="checkbox" name="completed">Complete!</button>');
        $checkbox.data('id', task.id);
        $form.append($checkbox);


      }else{
        var $compeletedOn = new Date(task.completed_on).toISOString().slice(0,10);
        $form.append('<input type="text" class="completed_on" name="completed_on" value="' +$compeletedOn+'"/>');
        var $checkbox = $('<button class="checkbox" name="completed">Completed!</button>');
        $checkbox.data('id', task.id);
        $form.append($checkbox);
        $form.addClass('completed');
      }
      var $button = $('<button class="save">Save!</button>');
      $button.data('id', task.id);
      $form.append($button);
      var $remove = $('<button class="remove">Remove!</button>');
      $remove.data('id', task.id);
      $form.append($remove);
      $li.append($form);
      if(task.completed_on == null){  //this conditional determines the DOM display depending on completion status
      $('#task-list').prepend($li);
    }else{
      $('#task-list').append($li);
    }
  });
  $('#addTaskButton').text('+');
}

function addTask(event) { //adds task to database and redisplays page
  event.preventDefault();
  var formData = $(this).closest('form').serialize();
  console.log(formData);
  $.ajax({
    url: '/tasks',
    type: 'POST',
    data: formData,
    success: getTasks
  });
}
function updateTask(event){  //this will update the display and database info of particular task
    event.preventDefault();
    var $button = $(this);
    var $form = $button.closest('form');

    var formData = $form.serialize();
    console.log(formData);
    $.ajax({
      url: '/tasks/'+ $button.data('id'),
      type: 'PUT',
      data: formData,
      success: getTasks
    });
  }


function removeTask(event){ //will remove task from client view and databse while prompting client before finalizing
  event.preventDefault();
  var confirmDel = confirm('Are you sure you want to delete this task?');
  if(confirmDel == true){
    $.ajax({
      url: '/tasks/'+ $(this).data('id'),
      type: 'DELETE',
      success: getTasks
    });
  }
}

function toggleTaskStatus(event){  //this function checks if task is complete or not before changing the status
  event.preventDefault();
  if($(this).text()=='Complete!'){
    $(this).text('Completed!');
    $(this).closest('form').addClass('completed');
    var $compeletedOn = new Date().toISOString().slice(0,10);
    //this section auto completes the completed on date at the time of button click
    $(this).closest('form').find('.completed_on').val($compeletedOn);
    var $form = $(this).closest('form');

    var formData = $form.serialize();
    console.log(formData);
    $.ajax({
      url: '/tasks/'+ $(this).data('id'),
      type: 'PUT',
      data: formData,
      success: getTasks
    });
  }else{
    $(this).text('Complete!');
    $(this).closest('form').removeClass('completed');
    $(this).closest('form').find('.completed_on').val('Not Yet Completed');
    var $form = $(this).closest('form');

    var formData = $form.serialize();
    $.ajax({
      url: '/tasks/'+ $(this).data('id'),
      type: 'PUT',
      data: formData,
      success: getTasks
    });
  }
}

function formToggle(event){
  event.preventDefault();
  if($(this).text()=='+'){
    $('#taskAdding').show('slow');
    $(this).text('-');
  }else{
    $(this).text('+');
    $('#taskAdding').hide('slow');
  }
}

function taskListToggle(event){
  event.preventDefault();
  if($(this).hasClass('hidden1')){
    $('#task-list').show('slow');
    $(this).removeClass('hidden1');
  }else{
    $('#task-list').hide('slow');
    $(this).addClass('hidden1');
  }
}
