const botaoAdicionarTarefa = document.querySelector('.app__button--add-task')
const formularioAdicionarTarefa = document.querySelector('.app__form-add-task')
const textarea = document.querySelector('.app__form-textarea')
const ulTarefas = document.querySelector('.app__section-task-list')
const botaoCancelarTarefa = document.querySelector('.app__form-footer__button--cancel')
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description')
const botaoRemoverConcluidas = document.querySelector('#btn-remover-concluidas')
const botaoRemoverTodas = document.querySelector('#btn-remover-todas')


let tarefas = JSON.parse(localStorage.getItem('tarefas')) || []
let tarefaSelecionada = null
let liTarefaSelecionada = null

function atualizarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')

    const svg = document.createElement('svg')
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `

    const descricaoTarefa = document.createElement('p')
    descricaoTarefa.classList.add('app__section-task-list-item-description')
    descricaoTarefa.textContent = tarefa.descricao

    const botaoEditar = document.createElement('button')
    botaoEditar.classList.add('app_button-edit')

    botaoEditar.onclick = () => {
        // debugger
        const novaDescricao = prompt('Qual é o novo nome da tarefa?')
        if (novaDescricao) { 
            descricaoTarefa.textContent = novaDescricao 
            tarefa.descricao = novaDescricao 
            atualizarTarefas() 
        }   
    }

    const imagemBotaoEditar = document.createElement('img')
    imagemBotaoEditar.setAttribute('src', '/imagens/edit.png')

    botaoEditar.append(imagemBotaoEditar)

    li.append(svg)
    li.append(descricaoTarefa)
    li.append(botaoEditar)

    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete')
        botaoEditar.setAttribute('disabled', 'disabled')
    } else {
         li.onclick= () => {
        document.querySelectorAll('.app__section-task-list-item-active')
        .forEach(elemento => {
            elemento.classList.remove('app__section-task-list-item-active')
        })

        if (tarefaSelecionada == tarefa) {
            paragrafoDescricaoTarefa.textContent = ''
            tarefaSelecionada = null
            liTarefaSelecionada = null
            return //early return
        }

        tarefaSelecionada = tarefa
        liTarefaSelecionada = li
        paragrafoDescricaoTarefa.textContent = tarefa.descricao

        li.classList.add('app__section-task-list-item-active')
        }
    }

   

    return li
}

botaoAdicionarTarefa.addEventListener('click', () => {
    formularioAdicionarTarefa.classList.toggle('hidden')
})

botaoCancelarTarefa.addEventListener('click', () => {
    textarea.value = ''
    formularioAdicionarTarefa.classList.toggle('hidden')
})

formularioAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const tarefa = {
        descricao: textarea.value
    }
    tarefas.push(tarefa)
    const elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)
    atualizarTarefas()
    textarea.value = ''
    formularioAdicionarTarefa.classList.add('hidden')
})

tarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)
});

document.addEventListener('FocoFinalizado', () => {
    if ( tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active')
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete')
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled')
        tarefaSelecionada.completa = true
        atualizarTarefas()
    }
})

const removerTarefas = (somenteConcluidas) => {
    const seletor = somenteConcluidas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item'
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove()
    })
    tarefas = somenteConcluidas ? tarefas.filter(tarefa => !tarefa.completa) : []
    atualizarTarefas()
}

botaoRemoverConcluidas.onclick = () => removerTarefas(true)

botaoRemoverTodas.onclick = () => removerTarefas(false)

