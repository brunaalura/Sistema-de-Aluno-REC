
const formAluno = document.getElementById("formAluno");
const tabelaAlunos = document.getElementById("tabelaAlunos");
const pesquisa = document.getElementById("pesquisa");

let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

// SALVAR NO LOCALSTORAGE
function salvarDados() {
    localStorage.setItem("alunos", JSON.stringify(alunos));
}

// EXIBIR ALUNOS
function listarAlunos(lista = alunos) {

    tabelaAlunos.innerHTML = "";

    lista.forEach(aluno => {

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${aluno.matricula}</td>
            <td>${aluno.nome}</td>
            <td>${aluno.turma}</td>
            <td>${aluno.email || "-"}</td>
            <td>
                <button class="btnEditar" onclick="editarAluno('${aluno.id}')">
                    Editar
                </button>

                <button class="btnExcluir" onclick="excluirAluno('${aluno.id}')">
                    Excluir
                </button>
            </td>
        `;

        tabelaAlunos.appendChild(linha);
    });

    atualizarDashboard();
}

// CADASTRAR ALUNO
formAluno.addEventListener("submit", function(event) {

    event.preventDefault();

    const id = document.getElementById("idAluno").value;

    const aluno = {
        id: id || Date.now().toString(),
        nome: document.getElementById("nome").value,
        matricula: document.getElementById("matricula").value,
        nascimento: document.getElementById("nascimento").value,
        email: document.getElementById("email").value,
        telefone: document.getElementById("telefone").value,
        turma: document.getElementById("turma").value
    };

    // VERIFICAR MATRÍCULA DUPLICADA
    const matriculaExistente = alunos.some(a =>
        a.matricula === aluno.matricula && a.id !== aluno.id
    );

    if (matriculaExistente) {
        alert("Esta matrícula já está cadastrada!");
        return;
    }

    if (id) {

        // EDITAR ALUNO
        alunos = alunos.map(a =>
            a.id === id ? aluno : a
        );

        alert("Aluno atualizado com sucesso!");

    } else {

        // NOVO CADASTRO
        alunos.push(aluno);

        alert("Aluno cadastrado com sucesso!");
    }

    salvarDados();
    listarAlunos();
    formAluno.reset();

    document.getElementById("idAluno").value = "";
    document.getElementById("btnSalvar").textContent = "Cadastrar Aluno";
});

// EDITAR ALUNO
function editarAluno(id) {

    const aluno = alunos.find(a => a.id === id);

    if (!aluno) return;

    document.getElementById("idAluno").value = aluno.id;
    document.getElementById("nome").value = aluno.nome;
    document.getElementById("matricula").value = aluno.matricula;
    document.getElementById("nascimento").value = aluno.nascimento;
    document.getElementById("email").value = aluno.email;
    document.getElementById("telefone").value = aluno.telefone;
    document.getElementById("turma").value = aluno.turma;

    document.getElementById("btnSalvar").textContent = "Atualizar Aluno";

    document.getElementById("cadastro").scrollIntoView({
        behavior: "smooth"
    });
}

// EXCLUIR ALUNO
function excluirAluno(id) {

    const confirmar = confirm("Deseja realmente excluir este aluno?");

    if (!confirmar) return;

    alunos = alunos.filter(a => a.id !== id);

    salvarDados();
    listarAlunos();
}

// PESQUISAR ALUNO
pesquisa.addEventListener("input", function() {

    const termo = pesquisa.value.toLowerCase();

    const resultado = alunos.filter(aluno =>
        aluno.nome.toLowerCase().includes(termo) ||
        aluno.matricula.toLowerCase().includes(termo)
    );

    listarAlunos(resultado);
});

// ATUALIZAR DASHBOARD
function atualizarDashboard() {

    document.getElementById("totalAlunos").textContent = alunos.length;

    document.getElementById("alunosAtivos").textContent = alunos.length;

    const turmas = new Set(alunos.map(aluno => aluno.turma));

    document.getElementById("totalTurmas").textContent = turmas.size;
}

// INICIALIZAR SISTEMA
listarAlunos();
