let addBtn = document.querySelector(".plus");
let modalCont = document.querySelector(".task");
let addModal = true;
let taskAreaCont = document.querySelector(".input");
let mainCont = document.querySelector(".main-content");
let allPriorityColors = document.querySelectorAll(".priority-color");
let modalPriorityColor = 'pink';
let removeBtn = document.querySelector(".delete");
let removeFlag = false;
let colors = ['pink', 'blue', 'green', 'yellow'];
let modalPriorityTicketColor = colors[colors.length-1];
var uid = new ShortUniqueId();
let toolBoxColors = document.querySelectorAll(".color");
let ticketArr = [];

if(localStorage.getItem("tickets")){
    let str = localStorage.getItem("tickets");
    let arr = JSON.parse(str);
    ticketArr = arr;
    for(let i=0; i<arr.length; i++){
        let ticketObj = arr[i];
        createTicket(ticketObj.color, ticketObj.task, ticketObj.id);
    }
}

for(let i=0; i<toolBoxColors.length; i++){
    toolBoxColors[i].addEventListener("click", function(){
        let currentColor = toolBoxColors[i].classList[1];
        let filteredArr = [];
        for(let i=0; i<ticketArr.length;i++){
            if(ticketArr[i].color == currentColor){
                filteredArr.push(ticketArr[i]);
            }
        }
        let allTickets = document.querySelectorAll(".ticket-cont");
        for(let j=0;j<allTickets.length; j++){
            allTickets[j].remove();
        }
        for(let i=0; i<filteredArr.length; i++){
            let ticket = filteredArr[i];
            let color = ticket.color;
            let task = ticket.task;
            let id = ticket.id;
            createTicket(color,task,id);
        }
    })

    toolBoxColors[i].addEventListener("dblclick", function(){
        let allTickets = document.querySelectorAll(".ticket-cont");
        for(let j=0;j<allTickets.length; j++){
            allTickets[j].remove();
        }
        for(let i=0; i<ticketArr.length; i++){
            let ticket = ticketArr[i];
            let color = ticket.color;
            let task = ticket.task;
            let id = ticket.id;
            createTicket(color,task,id);
        }
    })
}

addBtn.addEventListener('click', function(){
    if(addModal){
        modalCont.style.display = "flex";
    }else{
        modalCont.style.display = "none";
    }
    addModal = !addModal;
})

for(let i=0; i<allPriorityColors.length; i++){
    let priorotyDivOne = allPriorityColors[i];
    priorotyDivOne.addEventListener('click', function(){
        for(let j=0; j<allPriorityColors.length; j++){
            allPriorityColors[j].classList.remove("active");
        }
        priorotyDivOne.classList.add('active');
        modalPriorityColor = priorotyDivOne.classList[1];
    })
}

modalCont.addEventListener('keydown', function(e){
    let key = e.key;
    if(key == 'Enter'){
        createTicket(modalPriorityColor, taskAreaCont.value);
        taskAreaCont.value = "";
        modalCont.style.display = "none";
        addModal = !addModal;
    }
})

removeBtn.addEventListener('click',function(){
    if(removeFlag){
        removeBtn.style.color = 'black';
    }
    else{
        removeBtn.style.color = 'red';
    }
    removeFlag = !removeFlag;
})

function createTicket(ticketColor, task, ticketId){
    let id;
    if(ticketId == undefined){
        id = uid();
    }else{
        id = ticketId;
    }
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute('class', 'ticket-cont');
    ticketCont.innerHTML = `<div class="ticket-color ${ticketColor}"></div>
                            <div class="ticket-id">#${id}</div>
                            <div class="task-area">${task}</div>
                            <div class="lock-unlock"><i class="fa fa-lock"></i></div>`
    mainCont.appendChild(ticketCont);

    let lockUnlockBtn = ticketCont.querySelector(".lock-unlock i");
    let ticketTaskArea = ticketCont.querySelector(".task-area");
    lockUnlockBtn.addEventListener("click", function(){
        if(lockUnlockBtn.classList.contains("fa-lock")){
            lockUnlockBtn.classList.remove("fa-lock");
            lockUnlockBtn.classList.add("fa-unlock");
            ticketTaskArea.setAttribute("contenteditable", "true");
        }else{
            lockUnlockBtn.classList.remove("fa-unlock");
            lockUnlockBtn.classList.add("fa-lock");
            ticketTaskArea.setAttribute("contenteditable", "false");
        }

        let ticketIdx = getTicketIdx(id);
        ticketArr[ticketIdx].task = ticketTaskArea.textContent;
        updateLocalStorage();
    })

    ticketCont.addEventListener('click',function(){
        if(removeFlag){
            ticketCont.remove();

            let ticketIdx = getTicketIdx(id);
            ticketArr.splice(ticketIdx,1);
            updateLocalStorage();
        }
    })

    let ticketColorBand = ticketCont.querySelector(".ticket-color");
    ticketColorBand.addEventListener('click', function(){
        let currentTicketColor = ticketColorBand.classList[1];
        let currentTicketColorIdx = -1;
        for(let i=0; i<colors.length; i++){
            if(currentTicketColor == colors[i]){
                currentTicketColorIdx = i;
                break;
            }
        }
        let nextColorIdx = (currentTicketColorIdx+1)%colors.length;
        let nextColor = colors[nextColorIdx];
        ticketColorBand.classList.remove(currentTicketColor);
        ticketColorBand.classList.add(nextColor);

        let ticketIdx = getTicketIdx(id);
        ticketArr[ticketIdx].color = nextColor;
        updateLocalStorage();
    })

    if(ticketId == undefined){
        ticketArr.push({'color': ticketColor, "task": task, "id": id});
        updateLocalStorage();
    }
}

function getTicketIdx(id){
    for(let i=0;i<ticketArr.length;i++){
        if(ticketArr[i].id==id){
            return i;
        }
    }
}

function updateLocalStorage(){
    let stringifyArr = JSON.stringify(ticketArr);
    localStorage.setItem("tickets", stringifyArr);
}