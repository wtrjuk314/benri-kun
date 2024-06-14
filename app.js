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

    // 最初にToDoリストのタブを表示
    tabs[0].classList.add('active');
    contents[0].classList.add('active');
    
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
        const taskList = document.getElementById('tasks');
        const taskItem = document.createElement('li');
        taskItem.textContent = taskText;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
            taskList.removeChild(taskItem);
            saveTasks();
        });

        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);
        saveTasks();
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('#tasks li').forEach(taskItem => {
            tasks.push(taskItem.firstChild.textContent);
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(taskText => addTask(taskText));
    }

    window.addEventListener('load', loadTasks);

    // メモ帳のコード
    const notepad = document.getElementById('notepad');
    notepad.value = localStorage.getItem('notepad') || '';
    
    notepad.addEventListener('input', function() {
        localStorage.setItem('notepad', notepad.value);
    });
});
