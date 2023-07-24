/*
  Sistema Estacionamento JS

  Autor: Rafael Guedes -> cyberrminfo@gmail.com

*/

// Função para adicionar um veículo
const adicionarVeiculo = (placa) => {
  if (placa !== "") {
    // Cria um objeto "veiculo" com os dados da placa e a hora de entrada
    const veiculo = {
      placa: placa,
      entrada: new Date()
    };
    const veiculosEstacionados = obterVeiculos();
    veiculosEstacionados.push(veiculo);
    salvarVeiculos(veiculosEstacionados);
    exibirVeiculos();
    limparCampos();
  }
};

// Função para obter a lista de veículos estacionados do localStorage
const obterVeiculos = () => {
  const veiculos = localStorage.getItem("veiculos");
  return veiculos ? JSON.parse(veiculos) : [];
};

// Função para remover um veículo pelo número da placa
const removerVeiculo = (placa) => {
  const veiculosEstacionados = obterVeiculos();
  const indice = veiculosEstacionados.findIndex((veiculo) => veiculo.placa === placa);
  if (indice !== -1) {
    const veiculo = veiculosEstacionados[indice];
    veiculosEstacionados.splice(indice, 1);
    salvarVeiculos(veiculosEstacionados);

    // Calcula a permanência do veículo e o valor a pagar
    const permanencia = calcularPermanencia(new Date(veiculo.entrada), new Date());
    const valorAPagar = calcularValorAPagar(permanencia);
    alert(`Tempo de permanência: ${permanencia.horas} horas, ${permanencia.minutos} minutos, ${permanencia.segundos} segundos\nValor a pagar: R$${valorAPagar.toFixed(2)}`);
    exibirVeiculos();
  }
};

// Função para calcular a permanência de um veículo
const calcularPermanencia = (entrada, saida) => {
  const diff = Math.abs(saida - entrada) / 1000; // diferença em segundos
  const horas = Math.floor(diff / 3600);
  const minutos = Math.floor((diff % 3600) / 60);
  const segundos = Math.floor(diff % 60);
  return { horas, minutos, segundos };
};

// Função para calcular o valor a pagar pela permanência do veículo
const calcularValorAPagar = (permanencia) => {
  // Lógica para cálculo do valor a pagar, você pode personalizá-la conforme suas regras de cobrança
  const valorPorHora = 10;
  const totalHoras = permanencia.horas + permanencia.minutos / 60 + permanencia.segundos / 3600;
  const valorAPagar = valorPorHora * totalHoras;
  return valorAPagar;
};

// Função para salvar a lista de veículos no localStorage
const salvarVeiculos = (veiculos) => {
  localStorage.setItem("veiculos", JSON.stringify(veiculos));
};

// Função para criar um elemento HTML com classe e texto
const createElementWithClassAndText = (tag, className, text) => {
  const element = document.createElement(tag);
  element.classList.add(className);
  element.textContent = text;
  return element;
};

// Função para formatar a data da entrada do veículo
const formatarData = (dataHora) => {
  const data = new Date(dataHora);
  const dia = data.getDate().toString().padStart(2, "0");
  const mes = (data.getMonth() + 1).toString().padStart(2, "0");
  const ano = data.getFullYear();
  return { data: `${dia}/${mes}/${ano}` };
};

// Função para formatar a hora da entrada do veículo
const formatarHora = (dataHora) => {
  const data = new Date(dataHora);
  const hora = data.getHours().toString().padStart(2, "0");
  const minutos = data.getMinutes().toString().padStart(2, "0");
  return `${hora}:${minutos}`;
};

// Função para criar a célula da tabela com texto
const createTableCell = (text) => {
  const td = document.createElement("td");
  td.textContent = text;
  return td;
};

// Função para criar o botão Encerrar
const createEncerrarButton = (placa) => {
  const botaoRemover = createElementWithClassAndText("button", "btn btn-danger btn-sm", "Encerrar");
  botaoRemover.addEventListener("click", () => {
    removerVeiculo(placa);
  });
  return botaoRemover;
};

// Função para criar a linha da tabela com os dados do veículo
const createTableRow = (veiculo) => {
  const tr = document.createElement("tr");
  tr.appendChild(createTableCell(veiculo.placa));
  tr.appendChild(createTableCell(formatarData(veiculo.entrada).data));
  tr.appendChild(createTableCell(formatarHora(veiculo.entrada)));
  tr.appendChild(createTableCell(`R$ ${calcularValorAPagar(veiculo.entrada).toFixed(2)}`));
  tr.appendChild(createEncerrarButton(veiculo.placa));
  return tr;
};

// Função para exibir a lista de veículos na página
function exibirVeiculos() {
  const listaVeiculos = document.getElementById("listaVeiculos");
  listaVeiculos.innerHTML = "";

  const veiculosEstacionados = obterVeiculos();
  veiculosEstacionados.forEach((veiculo) => {
    const tr = createTableRow(veiculo);
    listaVeiculos.appendChild(tr);
  });
}

// Função para buscar veículos por placa e exibir na tabela
const buscarVeiculos = () => {
  const buscaPlacaInput = document.getElementById("placa");
  const termoBusca = buscaPlacaInput.value.trim().toLowerCase();

  if (termoBusca === "") {
    exibirVeiculos();
  } else {
    const veiculosFiltrados = obterVeiculos().filter((veiculo) => veiculo.placa.toLowerCase().includes(termoBusca));
    const listaVeiculos = document.getElementById("listaVeiculos");
    listaVeiculos.innerHTML = "";

    veiculosFiltrados.forEach((veiculo) => {
      const tr = createTableRow(veiculo);
      listaVeiculos.appendChild(tr);
    });
  }
};

// Função para limpar o campo input
const limparCampos = () => {
  document.getElementById("placa").value = "";
};

//
// Event listeners para os botões e carregamento inicial da página
//

// Adicionar evento de busca ao botão "Adicionar"
document.getElementById("adicionarBtn").addEventListener("click", () => {
  const placa = document.getElementById("placa").value;
  adicionarVeiculo(placa);
});

// Adicionar evento de busca ao botão "Buscar"
document.getElementById("buscarBtn").addEventListener("click", buscarVeiculos);

// Adicionar evento de busca ao botão "Limpar"
document.getElementById("limparBtn").addEventListener("click", () => {
  limparCampos();
});

// Adicionar evento de busca ao botão "Atualizar"
document.getElementById("atualizarBtn").addEventListener("click", () => {
  exibirVeiculos();
});

// Carregar os dados iniciais ao carregar a página
document.addEventListener("DOMContentLoaded", exibirVeiculos);
