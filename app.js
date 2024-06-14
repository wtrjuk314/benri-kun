document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab-button');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    tabs[0].classList.add('active');
    contents[0].classList.add('active');

    // Firebaseの参照を設定
    const tasksRef = firebase.database().ref('tasks');
    const notepadRef = firebase.database().ref('notepad');

    // ToDoリストのコード
    document.getElementById('add-task').addEventListener('click', addTaskFromInput);
    document.getElementById('new-task').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            addTaskFromInput();
        }
    });

    function addTaskFromInput() {
        const taskInput = document.getElementById('new-task');
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            taskInput.value = '';
        }
    }

    function addTask(taskText) {
        const newTaskRef = tasksRef.push();
        newTaskRef.set({
            text: taskText
        });
    }

    tasksRef.on('child_added', function(snapshot) {
        const task = snapshot.val();
        const taskList = document.getElementById('tasks');
        const taskItem = document.createElement('li');
        taskItem.textContent = task.text;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
            tasksRef.child(snapshot.key).remove();
            taskList.removeChild(taskItem);
        });

        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);
    });

    tasksRef.on('child_removed', function(snapshot) {
        const taskList = document.getElementById('tasks');
        taskList.childNodes.forEach(taskItem => {
            if (taskItem.firstChild.textContent === snapshot.val().text) {
                taskList.removeChild(taskItem);
            }
        });
    });

    // メモ帳のコード
    const notepad = document.getElementById('notepad');
    notepadRef.on('value', function(snapshot) {
        notepad.value = snapshot.val() || '';
    });

    notepad.addEventListener('input', function() {
        notepadRef.set(notepad.value);
    });
});
