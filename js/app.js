document.addEventListener('DOMContentLoaded', function(){

    //Form
    const form = this.querySelector('#form');

    //EventListeners:
    form.addEventListener('submit', validateForm);

    showDates();
});

function showDates(){
    const containerDates = document.querySelector('.container-dates');
    let dates = getDataLS();

    clearHTML(containerDates);
    dates.forEach( record => {
        const {id, name, owner, tel, date, sintomas} = record;

        const dateContainer = document.createElement('DIV');
        dateContainer.classList.add('date-container', 'p-3', 'bg-white', 'shadow', 'rounded', 'mb-3');

        const dateTitle = document.createElement('H2');
        dateTitle.classList.add('date-title','m-0');
        dateTitle.textContent = name;

        const dateOwner = document.createElement('P');
        dateOwner.classList.add('date-owner','m-0','text-sm','text-success');
        dateOwner.textContent = owner + " - " + tel;

        const dateDate = document.createElement('P');
        dateDate.classList.add('date-date','m-0');
        dateDate.textContent = date;

        const dateSintomas = document.createElement('P');
        dateSintomas.classList.add('date-dateSintomas','m-0');
        dateSintomas.textContent = sintomas;

        const dataBtnEdit = document.createElement('BUTTON');
        dataBtnEdit.classList.add('btn', 'btn-sm', 'btn-primary', 'mt-2');
        dataBtnEdit.innerHTML = '<i class="bi bi-pencil-square"></i> Editar';
        dataBtnEdit.onclick = () => editDate(record);

        const dataBtnDelete = document.createElement('BUTTON');
        dataBtnDelete.classList.add('btn', 'btn-sm', 'btn-danger', 'mt-2', 'ms-2');
        dataBtnDelete.innerHTML = '<i class="bi bi-trash3-fill"></i> Eliminar';
        dataBtnDelete.onclick = () => deleteDate(record);

        dateContainer.appendChild(dateTitle);
        dateContainer.appendChild(dateDate);
        dateContainer.appendChild(dateOwner);
        dateContainer.appendChild(dateSintomas);
        dateContainer.appendChild(dataBtnEdit);
        dateContainer.appendChild(dataBtnDelete);

        containerDates.appendChild(dateContainer);
    });
}

function editDate(dateInfo){
    const {id, name, owner, tel, date, sintomas} = dateInfo;
    const nameInput = document.querySelector('#name');
    const ownerInput = document.querySelector('#owner');
    const telInput = document.querySelector('#tel');
    const dateInput = document.querySelector('#date');
    const sintomasInput = document.querySelector('#sintomas');
    const idInput = document.querySelector('#id');

    //Fill de input
    nameInput.value = name;
    ownerInput.value = owner;
    telInput.value = tel;
    dateInput.value = date;
    sintomasInput.value = sintomas;
    idInput.value = id;
}

function deleteDate(date){
    const { id } = date;
    
    const dates = getDataLS();
    const currentDates = dates.filter(currentDate => currentDate.id !== id);
    localStorage.setItem('dates', JSON.stringify(currentDates));

    showDates();
}

function validateForm(e){
    e.preventDefault();
    const name = document.querySelector('#name').value;
    const owner = document.querySelector('#owner').value;
    const tel = document.querySelector('#tel').value;
    const date = document.querySelector('#date').value;
    const sintomas = document.querySelector('#sintomas').value;
    const id = document.querySelector('#id').value;

    //Regular expression for tels
    const regexTel = /^[6-7]\d{7}$/;
    const infoDate = {
        name,
        owner,
        tel,
        date,
        sintomas
    }

    if(Object.values(infoDate).includes('')) return showAlert('danger', 'Todos los campos son obligatorios');
    if(!regexTel.test(tel)) return showAlert('danger', 'Escríbe un teléfono válido');
    if(new Date() > new Date(date)) return showAlert('danger', 'La fecha no es válida');
    if(sintomas.length < 10) return showAlert('danger', 'Detalles de síntomas insuficientes');

    e.target.reset();

    if(id){
        infoDate.id = id;
        const dates = getDataLS();
        const datesActualizadas = dates.map( cita => {
            if(cita.id === id){
                return infoDate;
            }

            return cita;
        });
        
        localStorage.setItem('dates', JSON.stringify(datesActualizadas));
        showDates();
    }else{
        infoDate.id = generateId();
        setDataLS(infoDate);
    }
}

//Dom's messages
function getDataLS(){
    const dates = JSON.parse(localStorage.getItem('dates')) ?? [];
    return dates;
}

function setDataLS(record){
    let dates = JSON.parse(localStorage.getItem('dates')) ?? [];
    dates = [...dates, record];
    
    localStorage.setItem('dates', JSON.stringify(dates));
    showDates();
}

function showAlert(type, message){
    const body = document.querySelector('body');
    const tastContainer = document.createElement('DIV');
    tastContainer.classList.add('toast', 'position-fixed', 'top-0', 'end-0', 'm-2', `bg-${type}`, 'text-white', 'text-center');
    tastContainer.innerHTML = `<div class="toast-body">${message}</div>`
    body.appendChild(tastContainer);
    const toast = new bootstrap.Toast('.toast');
    toast.show();
    setTimeout(() => {
        tastContainer.remove();
    },10000);
}

function generateId(){
    const today = Date.now().toString(36).substring(2);
    const string = Math.random().toString(36).substring(2);

    return today + string;
}

function clearHTML(selector){
    while(selector.firstChild){
        selector.removeChild(selector.firstChild);
    }
}