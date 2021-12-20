let allTasks = [];
let valueInput = '';
let input = null;

const getLastValue = async () => {
    const resp = await fetch('http://localhost:8000/allTasks', {
        method: 'GET'
    });
    const result = await resp.json();
    allTasks = result.data;
    render();
}

window.onload = async function init() {
    const input = document.getElementById('add-task');
    input.addEventListener('change', updateValue);
    getLastValue();
}

const onClickButton = async () => {
    const input = document.getElementById('add-task');
    if (valueInput) {
        allTasks.push({
            text: valueInput,
            isCheck: false
        });
        const resp = await fetch('http://localhost:8000/createTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                text: valueInput,
                isCheck: false
            })
        });
        let result = await resp.json();
        allTasks = result.data;

        valueInput = '';
        input.value = '';
        render();
    } else {
        alert("Введите хоть какое-нибудь значение!");
    }
}

const deleteAll = () => {
    allTasks.map((item, id) => {
        deleteTask(item.id);
    })
}

const updateValue = (event) => {
    valueInput = event.target.value;
}

const render = () => {
    const content = document.getElementById('content-page');
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
    allTasks
        .sort((a, b) => {
            if (a.isCheck === b.isCheck) return 0;
            return (a.isCheck > b.isCheck ? 1 : -1)
        })
        .map((item, index) => {
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
                imageEdit.onclick = () => {
                    if (allTasks[index].isCheck === false) {
                        checkbox.remove();
                        text.remove();
                        imageEdit.remove();
                        imageDelete.remove();
                        editTask(item, item.id, container);
                    }
                }
                container.appendChild(imageEdit);
            }

            const imageDelete = document.createElement('img');
            imageDelete.src = 'images/delete.png';
            imageDelete.onclick = () => {
                deleteTask(item.id);
            }
            container.appendChild(imageDelete);

            content.appendChild(container);
        });
}

const onChangeCheckbox = async (index) => {
    allTasks[index].isCheck = !allTasks[index].isCheck;
    render();
}


deleteTask = async (itemID) => {
    const resp = await fetch(`http://localhost:8000/deleteTask?id=${itemID}`, {
        method: 'DELETE'
    });
    getLastValue();
}

const editTask = async (item, id, container) => {
    const editInput = document.createElement('input');
    const editInputBtn = document.createElement('button');
    const editDiv = document.createElement('div');
    let value = '';
    editInput.type = 'text';
    editInput.value = item.text;
    editInputBtn.innerHTML = 'Edit';
    editDiv.className = 'inputs';
    container.appendChild(editDiv);
    editDiv.appendChild(editInput);
    editDiv.appendChild(editInputBtn);

    const noChange = () => {
        item.text = editInput.value;
        render();
    }

    editInput.addEventListener('change', (e) => value = e.target.value);

    editInputBtn.addEventListener('click', () => {
        if (value) {
            editDoneTasks(item.id, value);
        } else {
            noChange();
        }
    });
}

const editDoneTasks = async (id, value) => {
    const resp = await fetch('http://localhost:8000/updateTask', {
        method : 'PATCH',
        headers : {
            'Content-type': 'application/json; charset=UTF-8'
        },
        body : JSON.stringify({
            text : value,
            id
        })
    })
    
    let result = await resp.json();
    allTasks = result.data;
    render();
}