class Veiculo {
  constructor(placa, entrada) {
    this.placa = placa;
    this.entrada = entrada;
  }
}

class Estacionamento {
  constructor() {
    this.veiculos = this.obterVeiculos();
  }

  adicionarVeiculo(placa) {
    if (placa !== "") {
      const veiculo = new Veiculo(placa, new Date());
      this.veiculos.push(veiculo);
      this.salvarVeiculos();
    }
  }

  obterVeiculos() {
    const veiculos = localStorage.getItem("veiculos");
    return veiculos ? JSON.parse(veiculos) : [];
  }

  removerVeiculo(placa) {
    const indice = this.veiculos.findIndex((veiculo) => veiculo.placa === placa);
    if (indice !== -1) {
      const veiculo = this.veiculos[indice];
      this.veiculos.splice(indice, 1);
      this.salvarVeiculos();

      const permanencia = this.calcularPermanencia(veiculo.entrada, new Date());
      const valorAPagar = this.calcularValorAPagar(permanencia);
      
      alert(`Tempo de permanência: ${permanencia.horas} horas, ${permanencia.minutos} minutos, ${permanencia.segundos} segundos\nValor a pagar: R$${valorAPagar.toFixed(2)}`);
    }
  }

  calcularPermanencia(entrada, saida) {
    const diff = Math.abs(saida - entrada) / 1000; // diferença em segundos

    const horas = Math.floor(diff / 3600);
    const minutos = Math.floor((diff % 3600) / 60);
    const segundos = Math.floor(diff % 60);

    return { horas, minutos, segundos };
  }

  calcularValorAPagar(permanencia) {
    // Lógica para cálculo do valor a pagar, você pode personalizá-la conforme suas regras de cobrança
    const valorPorHora = 10;
    const totalHoras = permanencia.horas + permanencia.minutos / 60 + permanencia.segundos / 3600;
    const valorAPagar = valorPorHora * totalHoras;
    return valorAPagar;
  }

  salvarVeiculos() {
    localStorage.setItem("veiculos", JSON.stringify(this.veiculos));
  }

  exibirVeiculos() {
    const listaVeiculos = document.getElementById("listaVeiculos");
    listaVeiculos.innerHTML = "";

    for (const veiculo of this.veiculos) {
      const itemLista = document.createElement("li");
      itemLista.classList.add("list-group-item");
      itemLista.textContent = "Placa: " + veiculo.placa;

      const botaoRemover = document.createElement("button");
      botaoRemover.classList.add("btn", "btn-danger", "btn-sm", "ml-2");
      botaoRemover.textContent = "Remover";
      botaoRemover.addEventListener("click", () => {
        this.removerVeiculo(veiculo.placa);
        this.exibirVeiculos();
      });

      itemLista.appendChild(botaoRemover);
      listaVeiculos.appendChild(itemLista);
    }
  }
}

const estacionamento = new Estacionamento();

// Função para carregar os dados na página inicial
function carregarDadosIniciais() {
  estacionamento.exibirVeiculos();
}
// Função para adicionar um veículo
function adicionarVeiculo() {
  const placa = document.getElementById("placa").value;
  estacionamento.adicionarVeiculo(placa);
  estacionamento.exibirVeiculos();
}

// Função para buscar veículos por placa
function buscarPlaca() {
  const buscaPlacaInput = document.getElementById("placa");
  const termoBusca = buscaPlacaInput.value.trim().toLowerCase();

  if (termoBusca === "") {
    // Se o campo de busca estiver vazio, exibir todos os veículos
    estacionamento.exibirVeiculos();
  } else {
    // Filtrar os veículos pelo número da placa
    const veiculosFiltrados = estacionamento.veiculos.filter(veiculo => veiculo.placa.toLowerCase().includes(termoBusca));

    // Atualizar a lista com os veículos filtrados
    const listaVeiculos = document.getElementById("listaVeiculos");
    listaVeiculos.innerHTML = "";

    for (const veiculo of veiculosFiltrados) {
      const itemLista = document.createElement("li");
      itemLista.classList.add("list-group-item");
      itemLista.textContent = veiculo.placa;

      const botaoRemover = document.createElement("button");
      botaoRemover.classList.add("btn", "btn-danger", "btn-sm", "ml-2");
      botaoRemover.textContent = "Remover";
      botaoRemover.addEventListener("click", () => {
        estacionamento.removerVeiculo(veiculo.placa);
        estacionamento.exibirVeiculos();
      });

      itemLista.appendChild(botaoRemover);
      listaVeiculos.appendChild(itemLista);
    }
  }
}

// Função para exibir todos os veículos
function exibirVeiculos() {
  estacionamento.exibirVeiculos();
}

// Carregar os dados iniciais ao carregar a página
document.addEventListener("DOMContentLoaded", carregarDadosIniciais);

