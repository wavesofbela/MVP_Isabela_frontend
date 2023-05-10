'use strict'

const getClientes = async () =>{
    let url = 'http://127.0.0.1:5000/clientes';
    const response = fetch(url, {
      method: 'get',
    })
      .then((response) => response.json())
      .then((data) => {
        return data.clientes.forEach((client) => {createRow(client)})
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      return await response
}

const delClientes = async (id) => {
    const formData = new FormData();
    formData.append('id', id);
    let url = 'http://127.0.0.1:5000/clientes';
    await fetch(url, {
      method: 'delete',
      body: formData
    })
      .then((response) => response)
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const postCliente = async (nome,email,celular,cidade) => {
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('email', email);  
    formData.append('celular', celular);
    formData.append('cidade', cidade);
    let url = 'http://127.0.0.1:5000/clientes';
    await fetch(url, {
      method: 'post',
      body: formData
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
      });
  }


const openModal = () => {
    console.log('Open modal')
    document.getElementById('modal').classList.add('active')}
const openModal2 = () => document.getElementById('modal2').classList.add('active')

const closeModal2 = () => {
    document.getElementById('modal2').classList.remove('active')
}

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient))

// CRUD - create read update delete
const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index, 1)
    console.log(dbClient)
    setLocalStorage(dbClient)
}



const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}

const saveClient = async () => {
    if (isValidFields()) {
        
        const nome= document.getElementById('nome').value
        const email= document.getElementById('email').value
        const celular= document.getElementById('celular').value
        const cidade= document.getElementById('cidade').value
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            await postCliente(nome,email,celular,cidade)
            await updateTable()
            closeModal()
        }
    }
}

const createRow = (client) => {
    const newRow = document.createElement('tr')
    console.log(client.nome)
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button red" id="delete-${client.id}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
    console.log("limpando tela")
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = async () => {
    clearTable()
    await getClientes()
}

const fillFields = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index
}


const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')
        console.log(action,index)
        if(action == 'delete'){
            let avisoDelete = document.querySelector('#avisoDelete')
            avisoDelete.textContent = `Deseja realmente excluir o cliente?`
            openModal2()

        // APAGAR O REGISTRO
            document.getElementById('apagar').addEventListener('click', async () => {
                await delClientes(index)
                await updateTable()
                closeModal2()
            })
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

// modal apagar
document.getElementById('modalClose2')
    .addEventListener('click', closeModal2)

document.getElementById('salvar')
    .addEventListener('click', saveClient)

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)

// modal apagar
document.getElementById('cancelar2')
    .addEventListener('click', closeModal2)
