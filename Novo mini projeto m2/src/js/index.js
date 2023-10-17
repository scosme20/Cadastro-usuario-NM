'use strict'

const abrirModal = () => document.getElementById('modal')
    .classList.add('active')

const fecharModal = () => {
    novosDados()
    document.getElementById('modal').classList.remove('active')
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('nm_membro')) ?? []
const setLocalStorage = (nmMembro) => localStorage.setItem("nm_membro", JSON.stringify(nmMembro))

const deletarMembro = (index) => {
    const nmMembro = lerDados()
    nmMembro.splice(index, 1)
    setLocalStorage(nmMembro)
}

const atualizarMembro = (index, outlier) => {
    const nmMembro = lerDados()
    nmMembro[index] = outlier
    setLocalStorage(nmMembro)
}

const lerDados = () => getLocalStorage()

const criarMembro = (outlier) => {
    const nmMembro = getLocalStorage()
    nmMembro.push (outlier)
    setLocalStorage(nmMembro)
}

const validacao = () => {
    return document.getElementById('form').reportValidity()
}

const novosDados = () => {
    const dadosMembros = document.querySelectorAll('.modal-dados')
    dadosMembros.forEach(field => field.value = "")
    document.getElementById('nome').dataset.outlier = 'new'
    document.querySelector(".modal-header>h2").textContent  = 'Novo Membro'
}

const salvarMembro = () => {
    if (validacao()) {
        const outlier = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            patrimonio: document.getElementById('patrimonio').value,
            modo: document.getElementById('modo').value,
            pais: document.getElementById('pais').value,
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            criarMembro(outlier)
            atualizarTabela()
            fecharModal()
        } else {
            atualizarMembro(index, outlier)
            atualizarTabela()
            fecharModal()
        }
    }
}

const criarDados = (outlier, index) => {
    const novaLinha = document.createElement('tr')
    novaLinha.innerHTML = `
        <td>${outlier.nome}</td>
        <td>${outlier.email}</td>
        <td>${outlier.patrimonio}</td>
        <td>${outlier.modo}</td>
        <td>${outlier.pais}</td>
        <td>
            <button type="button" class="button green" id="editar-${index}">Editar</button>
            <button type="button" class="button red" id="deletar-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(novaLinha)
}

const removerTabela = () => {
    const linhaDados = document.querySelectorAll('#tableClient>tbody tr')
    linhaDados.forEach(row => row.parentNode.removeChild(row))
}

const atualizarTabela = () => {
    const nmMembro = lerDados()
    removerTabela()
    nmMembro.forEach(criarDados)
}

const novosMilionarios = (outlier) => {
    document.getElementById('nome').value = outlier.nome
    document.getElementById('email').value = outlier.email
    document.getElementById('patrimonio').value = outlier.patrimonio
    document.getElementById('nome').dataset.index = outlier.index
    document.getElementById('modo').value = outlier.modo
    document.getElementById('pais').value = outlier.pais
}

const editarMembro = (index) => {
    const outlier = lerDados()[index]
    outlier.index = index
    novosMilionarios(outlier)
    document.querySelector(".modal-header>h2").textContent  = `Editando ${outlier.nome}`
    abrirModal()
}

const duplaOpcao = (event) => {
    if (event.target.type == 'button') {

        const [opcao, index] = event.target.id.split('-')

        if (opcao == 'editar') {
            editarMembro(index)
        } else {
            const outlier = lerDados()[index]
            const afirmacao = confirm(`Você realmente quer sair do grupo dos 1% ? ${outlier.nome}`)
            if (afirmacao) {
                deletarMembro(index)
                atualizarTabela()
            }
        }
    }
}

atualizarTabela()

// Eventos
document.getElementById('cadastrarCliente')
    .addEventListener('click', abrirModal)

document.getElementById('modalClose')
    .addEventListener('click', fecharModal)

document.getElementById('salvar')
    .addEventListener('click', salvarMembro)

document.querySelector('#tableClient>tbody')
    .addEventListener('click', duplaOpcao)

document.getElementById('cancelar')
    .addEventListener('click', fecharModal)