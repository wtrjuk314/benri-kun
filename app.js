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
    
    // Firestoreの初期化
    const db = firebase.firestore();

    // ToDoリストのコード
    document.getElementById('add-task').addEventListener('click', addTaskFromInput);
    document.getElementById('new-task').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            addTaskFromInput();
        }
    });

    async function addTaskFromInput() {
        const taskInput = document.getElementById('new-task');
        const taskText = taskInput.value.trim();
        if (taskText) {
            await addTask(taskText);
            taskInput.value = '';
        }
    }

    async function addTask(taskText) {
        const taskList = document.getElementById('tasks');
        const taskItem = document.createElement('li');
        taskItem.textContent = taskText;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', async function() {
            taskList.removeChild(taskItem);
            await saveTasks();
        });

        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);
        await saveTasks();
    }

    async function saveTasks() {
        const tasks = [];
        document.querySelectorAll('#tasks li').forEach(taskItem => {
            tasks.push(taskItem.firstChild.textContent);
        });
        await db.collection("tasks").doc("taskList").set({tasks: tasks});
    }

    async function loadTasks() {
        const doc = await db.collection("tasks").doc("taskList").get();
        if (doc.exists) {
            const tasks = doc.data().tasks;
            tasks.forEach(taskText => addTask(taskText));
        }
    }

    window.addEventListener('load', loadTasks);

    // メモ帳のコード
    const notepad = document.getElementById('notepad');

    notepad.addEventListener('input', async function() {
        await db.collection("notepad").doc("notes").set({content: notepad.value});
    });

    async function loadNotepad() {
        const doc = await db.collection("notepad").doc("notes").get();
        if (doc.exists) {
            notepad.value = doc.data().content;
        }
    }

    window.addEventListener('load', loadNotepad);
});
