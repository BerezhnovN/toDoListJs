let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
let valueInput = '';
let input = null;

window.onload = function () {
    const input = document.getElementById('add-task');
    input.addEventListener('change', updateValue);
    render();
    localStorage.setItem('tasks', JSON.stringify(allTasks));
}

onClickButton = () => {
    allTasks.push({
        text: valueInput,
        isCheck: false
    });
    valueInput = '';
    const input = document.getElementById('add-task');
    input.value = '';
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    render();
}

deleteAll = () => {
    allTasks.splice(0, allTasks.length);
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    render();
}

updateValue = (event) => {
    valueInput = event.target.value;
}

render = () => {
    const content = document.getElementById('content-page');
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
    allTasks.sort((a, b) => a.isCheck > b.isCheck ? 1 : a.isCheck < b.isCheck ? -1 : 0);
    allTasks.map((item, index) => {
        const container = document.createElement('div');
        container.id = `task-${index}`;
        container.className = 'task-container';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.isCheck;
        checkbox.onchange = function () {
            onChangeCheckbox(index);
        }
        container.appendChild(checkbox);
        const text = document.createElement('p');
        text.innerText = item.text;
        text.className = item.isCheck ? 'text-task done-text' : 'text-task'
        container.appendChild(text);

        if (!item.isCheck) {
            const imageEdit = document.createElement('img');
            imageEdit.src = 'images/edit.png';
            imageEdit.onclick = function () {
                if (allTasks[index].isCheck === false) {
                    checkbox.remove();
                    text.remove();
                    imageEdit.remove();
                    imageDelete.remove();
                    editTask(item, index, container);
                }
            }
            container.appendChild(imageEdit);
        }


        const imageDelete = document.createElement('img');
        imageDelete.src = 'images/delete.png';
        imageDelete.onclick = function () {
            deleteTask(index);
        }
        container.appendChild(imageDelete);

        content.appendChild(container);
    });
}

onChangeCheckbox = (index) => {
    allTasks[index].isCheck = !allTasks[index].isCheck;
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    render();
}

deleteTask = (index) => {
    allTasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    render();
}

const editTask = (item, index, container) => {
    const editInput = document.createElement('input');
    const editInputBtn = document.createElement('button');
    const editDiv = document.createElement('div');
    editInput.type = 'text';
    editInput.value = item.text;
    editInputBtn.innerHTML = 'Edit';
    editDiv.className = 'inputs';
    editDiv.appendChild(editInput);
    editDiv.appendChild(editInputBtn);
    container.appendChild(editDiv);
    const noChange = () => {
        item.text = editInput.value;
        render();
    }
    if (!editInput.addEventListener('change', () => { })) {
        editInputBtn.addEventListener('click', noChange);
    } else {
        editInput.addEventListener('change', (e) => {
            item.text = e.target.value;
            render();
        })
    }
}