const userInputElement = document.getElementById("task");
const searchInputElement = document.getElementById("searchInput");

const addTaskButton = document.getElementById("addButton");
const addTaskButtonText = addTaskButton.innerText;

let displayBox = document.querySelectorAll(".displayBox");

const totalTaskDisplayElement = document.getElementById("total tasks");
const checkedTaskDisplayElement = document.getElementById("checked tasks");
const pendingTaskDisplayElement = document.getElementById("pending tasks");

let tasksArray = [];
let edit_index = null;
let is_task_edited = false;

function loadData(){
let localData_string_format = localStorage.getItem("tasks");
if(localData_string_format != null)
    tasksArray = JSON.parse(localData_string_format);
}

loadData();
updateDisplay(tasksArray);
displayInformation(tasksArray);

function countCheckedTasks(tasksArray){
    let colorCount = 0;
    tasksArray.forEach((ele)=>{
        if(ele.color != '')
        colorCount++;
    })

    return colorCount;
}

function updateDisplay(tasksArray){

    totalTaskDisplayElement.innerHTML = `<span><b>Tasks( ${tasksArray.length} )</b></span>`;
    let count = countCheckedTasks(tasksArray);
    checkedTaskDisplayElement.innerHTML = `<span><b>Checked( ${count} )</b></span>`
    pendingTaskDisplayElement.innerHTML = `<span><b>Pending( ${tasksArray.length- count} )</b></span>` 
}

addTaskButton.addEventListener("click",function addTask(){
   
    if(edit_index != null){ 
        tasksArray.splice(edit_index,1,{'task':userInputElement.value,'color':''});
        edit_index = null;
     }
     else{
        tasksArray.push({
            'task' : userInputElement.value,
            'color':''
        })
     }
 
    saveInformation(tasksArray);
    displayInformation(tasksArray);

    userInputElement.value  = "";
    searchInputElement.value = "";

    addTaskButton.innerText = addTaskButtonText;
    updateDisplay(tasksArray);
 });
 
 function displayInformation(tasksArray){

    let tableBody = document.getElementById("tableBody");
    let rowData = "";

    tasksArray.forEach((item,id)=>{
            rowData += `<tbody>
            <tr style="background-color: ${item.color};">
              <th scope="row">${id+1}</th>
              <td>${item.task}</td>
              <td><i for="task" class="btn fa-solid fa-pen-to-square fa-xl" onClick = "editInformation(${id})" ></i>
              <i class="btn fa-solid fa-trash fa-xl mx-3" onClick = "deleteInformation(${id})" ></i>
              <i class="btn fa-solid fa-circle-check fa-xl" onClick = "colorInformation(${id})"></i>
              </td>
            </tr>
          </tbody>`;
        });

    tableBody.innerHTML = rowData; 
    searchInputElement.value = "";
}

function deleteInformation(id){

    tasksArray.splice(id,1);

    saveInformation(tasksArray);
    displayInformation(tasksArray);
    updateDisplay(tasksArray);
}

function editInformation(id){ 

    userInputElement.focus();
    edit_index = id;

    userInputElement.value = tasksArray[id].task;
    addTaskButton.innerText = "Save Changes";

    is_task_edited = !is_task_edited;
    updateDisplay(tasksArray);
}

let colored_elements_array = [];
let colored_elements_count = colored_elements_array.length;

function colorInformation(id){

    if(tasksArray[id].color == '')
    {
        tasksArray[id].color = "#80ed99";
        colored_elements_array.push(id);
    }else{

        tasksArray[id].color = '';
        colored_elements_array.pop(id);
    }
    
    saveInformation(tasksArray);
    displayInformation(tasksArray);
    updateDisplay(tasksArray);
}

function saveInformation(tasksArray){
    const tasksArray_string_format = JSON.stringify(tasksArray);
    localStorage.setItem("tasks",tasksArray_string_format);
}

let allTableRows = document.querySelectorAll("#tableBody tr");
let rows_count = tasksArray.length;

searchInputElement.addEventListener("input",function searchTask(e){

    if(tasksArray.length > rows_count || tasksArray.length < rows_count || colored_elements_array.length > colored_elements_count || colored_elements_array.length < colored_elements_count || is_task_edited){

        allTableRows = document.querySelectorAll("#tableBody tr");
        rows_count = tasksArray.length;
        colored_elements_count = colored_elements_array.length;

        saveInformation(tasksArray);
        displayInformation(tasksArray);
        updateDisplay(tasksArray);

        is_task_edited = !is_task_edited;
    }

    let searchValue = e.target.value.toLowerCase();
    tableBody.innerHTML = "";

    allTableRows.forEach((tr)=>{
        
        const rowData = tr.querySelectorAll("td");
        if(rowData[0].innerText.toLowerCase().indexOf(searchValue) > -1){
            tableBody.appendChild(tr);
        }
    })
    
    if(tableBody.innerHTML == ""){
        tableBody.innerHTML = `<div class="mt-3 mb-2"><h5>No matching results found!</h5></div>`
    }
});
