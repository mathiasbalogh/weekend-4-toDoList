$(function(){

  console.log('Doc is ready!');

  getTasks();

  $('#taskAdding').on('click', '#task-submit', addTask);
  $('#task-list').on('click', '.remove', removeTask);
  $('#task-list').on('click', '.save', updateTask);


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

  $('#task-list').empty();

  tasks.forEach(function(task){
    var $li = $('<li></li>');
    var $form = $('<form></form>');
    $form.append('<label for="task">Task:</label>');
    $form.append('<input type="text" name="task" value="'+task.task+'"/>');
    $form.append('<label for="created_on">Created On:</label>');
    var $createdOn = new Date(task.created_on).toISOString().slice(0,10);
    $form.append('<input type="date" name="created_on" value="'+$createdOn+'"/>');
    $form.append('<label for="completed_on">Completed On:</label>');
    if(task.completed_on == null){
      $form.append('<input type="text" name="completed_on" value="Not Yet Completed"/>');
    }else{
      $form.append('<input type="text" name="completed_on" value="' +task.completed_on+'"/>');
    }
    $form.append('<label for="completed">Completed:</label>');
    $form.append('<input type="checkbox" name="completed"/>');
    var $button = $('<button class="save">Save!</button>');
    $button.data('id', task.id);
    $form.append($button);
    var $remove = $('<button class="remove">Remove!</button>');
    $remove.data('id', task.id);
    $form.append($remove);
    $li.append($form);
    $('#task-list').append($li);
  });
}

function addTask(event) {
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
function updateTask(event){
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


function removeTask(event){
  event.preventDefault();

  $.ajax({
    url: '/tasks/'+ $(this).data('id'),
    type: 'DELETE',
    success: getTasks
  });
}
