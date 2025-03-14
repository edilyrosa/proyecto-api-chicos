const userTable = document.getElementById('tBody')
const url = "http://localhost:3000/usuarios"

const titleForm = document.getElementById('title');
const form = document.getElementById('form');
const userId = document.getElementById('userId');
const nombre = document.getElementById('nombre');
const edad = document.getElementById('edad');
const aceptacion = document.getElementById('aceptacion');
const email = document.getElementById('email');
const submitButton = document.getElementById('btnSubmit');
const btnReset = document.getElementById('reset');


//! GET: Cargar usuarios al iniciar
async function fetchUsers() {
    try {
        const response = await fetch(url)
        if(!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`)
        const users = await response.json()
        console.log('EL JSON', users);
        renderUsers(users);
    }catch(err){ //Error en el fetch()
        userTable.innerHTML = '' //Quito el loader y pongo lo siguiente
        let row = document.createElement('tr')
        row.innerHTML = `<td colspan="7" class='text-red-600 font-bold text-2xl text-center py-4'>${err.message}</td>`;
        userTable.appendChild(row)

        console.log('ERROR', err);
    }
}


//!Funcion que Renderiza usuarios en la tabla
function renderUsers(usuarios){
    userTable.innerHTML = '' //Quito el loader y pongo lo siguiente

    //*CONDICIONAL QUE CONTROLE EL FLUJO, DADA LA CONDICIÓN CIERTA QUE EL ARRAY DE USUARIOS QUE SE ESTÁ CONSUMIENDO ESTÁ VACÍO, Y COMO CONSECUENCIA MUESTRE EN LA TABLA UN REGISTRO QUE OCUPE TODAS LAS COLUMNAS QUE DIGA: "No hay ningún registro de usuario en la API"
    if(usuarios.length ===0 ){
        let row = document.createElement('tr')
        row.innerHTML = `
        <td  colspan='7' class='text-red-600 font-bold text-5xl text-center'>
            NO HAY REGISTROS QUE MOSTRAR 
         </td>
        `
        userTable.appendChild(row)
    }
    usuarios.forEach(user => {
    //*Operador ternario para establecer el color de la fuente, dependiendo del genero, mujer === true y debe ser rosado, hombre === false y debe ser azul 
        let colorGenero = user.genero ? 'text-pink-500' : 'text-blue-500'
        let colorBarra = user.genero ? 'bg-pink-500' : 'bg-blue-500'

        let row = document.createElement('tr')
    //?Corregir en <img Escribir bn -> "rounded-full"
    //?<button agregamos las CLASS: edit-btn y delete-btn mas los DATA-ATTRUBUTE: data-id="${user.id} y data-nombre="${user.nombre}
        row.innerHTML = `
            <td> <img class='w-[80px] h-[80px] rounded-full' src="${user.foto}" alt="${user.foto}" </td>
            <td class="border-t-0 px-4 align-middle text-xs font-medium text-gray-900 whitespace-nowrap p-4"> ${user.nombre} </td>
            <td class="border-t-0 px-4 align-middle text-xs font-medium text-gray-900 whitespace-nowrap p-4"> ${user.edad} </td>
           <td class="${colorGenero} text-center border-t-0 px-4 align-middle text-xs font-bold whitespace-nowrap p-4">${user.genero ? 'Mujer' : 'Hombre'}</td>
            <td class="border-t-0 px-4 align-middle text-xs font-medium text-gray-900 whitespace-nowrap p-4"> ${user.email} </td>
            <td class="border-t-0 px-4 align-middle text-xs whitespace-nowrap p-4">
                <div class="flex items-center">
                    <span class="mr-2 text-xs font-medium">${user.aceptacion}%</span>
                    <div class="relative w-full">
                        <div class="w-full bg-gray-200 rounded-sm h-2">
                            <div class="${colorBarra} h-2 rounded-sm" style="width:${user.aceptacion}%"></div>
                        </div>
                    </div>
                </div>
            </td>
            <td>
                <button class="w-[40%] bg-blue-500 rounded-sm p-1 text-white font-bold mr-2 edit-btn" data-id="${user.id}">✏️ Editar</button>
                <button class="w-[50%] bg-pink-500 rounded-sm p-1 text-white font-bold delete-btn" data-id="${user.id}" data-nombre="${user.nombre}">🗑️ Eliminar</button>
            </td>
        `
        userTable.appendChild(row)
    })

//*NUEVO: debemos agregar las funciones manejadoras de los botones editar y eliminar de cada registro que 
//*ha sido creado en el DOM, cada vez que son creados.


//!BTN OYENTE DE UPDATE: ENVIA INFO AL FORM
//!INVESTIGAR: data-attrb y dataset 
//!edit-btn, clase que lo diferencia del boton "eliminar", mediante la cual se capturar el id desde el datasert
    document.querySelectorAll('.edit-btn').forEach( btn => 
        btn.addEventListener('click', () => editUser(btn.dataset.id)))
    

//!BTN OYENTE DE DELETE, abre el modal que pregunta
    document.querySelectorAll('.delete-btn').forEach( (btn) => 
        btn.addEventListener('click', () => confirmDelete(btn.dataset.id, btn.dataset.nombre)))



}

//**NUEVO: vamos a crear las Funciones manejadoras del evento click del boton "Editar" y "Eliminar" de la tabla
//!editUser(id) -> GET: cargar en el form la data del usuario específicado con id parametro, para editarlo. 

 async function editUser(id) {
    try{
        titleForm.innerText = 'LLENAR LOS CAMPOS PARA ACTUALIZAR USUARIO'
        submitButton.value = 'Actualizar'
        let res = await fetch(`${url}/${id}`) //get
        if(!res.ok) throw new Error('Error al actualizar')
        let usuario = await res.json();
        userId.value = usuario.id
        nombre.value = usuario.nombre
        edad.value = usuario.edad
        email.value = usuario.email
        foto.value = usuario.foto
        aceptacion.value = usuario.aceptacion

        document.querySelector(
            `input[name='genero'][value=${usuario.genero ? 'true' : 'false'}]`
        ).checked = true
    }catch(err){
        console.log(err);
        alert(err)
        
    }
}

 //!confirmDelete(btn.dataset.id, btn.dataset.nombre) Confirmación antes de eliminar
 function confirmDelete(id, nombre) {
    if(confirm(`Seguro desea eliminar a ${nombre} con id ${id}`)) deleteUser(id)
 }

//* Funcion de Eliminar usuario (DELETE), llamada en confirmDelete(id, nombre)
 async function deleteUser(id){
    try{
         let res = await fetch(`${url}/${id}`,{method:'DELETE'})
        if(!res.ok) throw new Error ('Error al eliminar')
        fetchUsers()
    }catch(err){
        console.log(err);
    }
}



//**NUEVO: vamos a crear las Funciones de Guardar usuario (POST o PUT)
//!hay q crear el obj usuario que sera el body de la peticion fetch()
form.addEventListener('submit', async (e) => {
    e.preventDefault()
    let usuario = {
        nombre: nombre.value,
        edad:Number(edad.value),
        email:email.value,
        foto: foto.value,
        aceptacion: Number(aceptacion.value),
        genero: document.querySelector('input[name="genero"]:checked').value === "true"
    }
    try {
        if(userId.value){ //usuario existe y debemos hacer PUT
            usuario.id = userId.value
            await updateUser(usuario)
        } else await postUser(usuario)
        
    } catch (error) {
        console.log(err);
        
    }
})

//**NUEVO: vamos a crear las Funciones que directamente hacen POST y PUT.

async function updateUser(usuario) {

    try{
        let res = await fetch(`${url}/${usuario.id}`, {
            method: 'PUT',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify(usuario),
        })
        if(!res.ok) throw new Error('Error en PUT')
    }catch(err){
        console.log(err);
        throw err
        
    }

}

async function postUser(usuario){
    try{
        let res = await fetch(`${url}`, { //No necesito id, es nuevo
            method: 'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify(usuario),
        })
        if(!res.ok) throw new Error('Error en POST')
    }catch(err){
        console.log(err);
        throw err
        
    }
}


//**NUEVO: restablecer titleForm.innerText al evento click del btn reset.
btnReset.addEventListener("click", () => (titleForm.innerText = "LLENA LOS CAMPOS Y CREA UN USUARIO."));

//**NUEVO: llamar a fetchUsers() 
fetchUsers() 
