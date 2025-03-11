const userTable = document.getElementById('tBody')
const url = "http://localhost:3000/usuarios"

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
        row.innerHTML = `<td colspan="7" class='text-2xl text-red-600'>${err.message}</td>`;
        userTable.appendChild(row)

        console.log('ERROR', err);
    }
}

function renderUsers(usuarios){
    userTable.innerHTML = '' //Quito el loader y pongo lo siguiente
    //?ASIGNACIÓN: HAGA UN CONDICIONAL QUE CONTROLE EL FLUJO, DADA LA CONDICIÓN CIERTA QUE EL ARRAY DE USUARIOS QUE SE ESTÁ CONSUMIENDO ESTÁ VACÍO, Y COMO CONSECUENCIA MUESTRE EN LA TABLA UN REGISTRO QUE OCUPE TODAS LAS COLUMNAS QUE DIGA: "No hay ningún registro de usuario en la API"
    usuarios.forEach(user => {
        //?TAREA:investigar que es operador ternario y uselo para mostrar el genero del usuario en el campo "Genero" de la tabla, recuerde que este es un campo booleano (mujer === true, hombre === false)
        //?TAREA:investigar como establecer el color de la fuente, dependiendo del genero, mujer === true y debe ser rosado, hombre === false y debe ser azul 
        let row = document.createElement('tr')
        row.innerHTML = `
            <td> <img class='w-[80px] h-[80px] ronded-full' src="${user.foto}" alt="${user.foto}" </td>
            <td class="border-t-0 px-4 align-middle text-xs font-medium text-gray-900 whitespace-nowrap p-4"> ${user.nombre} </td>
            <td class="border-t-0 px-4 align-middle text-xs font-medium text-gray-900 whitespace-nowrap p-4"> ${user.edad} </td>
            <td class="border-t-0 px-4 align-middle text-xs font-medium text-gray-900 whitespace-nowrap p-4"> ${user.genero ? 'Mujer' : 'Hombre'} </td>
            <td class="border-t-0 px-4 align-middle text-xs font-medium text-gray-900 whitespace-nowrap p-4"> ${user.email} </td>
        
        
            <td class="border-t-0 px-4 align-middle text-xs whitespace-nowrap p-4">
                        <div class="flex items-center">
                            <span class="mr-2 text-xs font-medium">${user.aceptacion}%</span>
                            <div class="relative w-full">
                                <div class="w-full bg-gray-200 rounded-sm h-2">
                                    <div class="bg-red-400 h-2 rounded-sm" style="width:${user.aceptacion}%"></div>
                                </div>
                            </div>
                        </div>
                    </td>
        
            <td> 
            <button class='w-[40%] bg-blue-600' >Editar</button>
            <button class='w-[40%] bg-red-600' >Eliminar</button>
            </td>
        `
        userTable.appendChild(row)
    })
}

fetchUsers() 

//INVESTIGAR QUE SON DATA-ATRIBUTOS y la propiedad dataset 
//PARA QUÉ SIRVE: <input type="hidden" id="userId"> EN LOS FORMULARIOS.
//Como podría usar el mismo formulario tanto para hacer POST como para hacer PUT? (la clave es: ese registro tiene o no id?, les comento que Json-server asigna id a los registros que  son posteados, investiguen un poco su funcionamiento)

//Rcuerden, para correr la aplicacion que estamos haciendo:
//1. el index.html lo sirven con open with de live server
//2. db.json lo sirven con ejecutando el comando en la terminal: json-server --watch db.json --port 3000