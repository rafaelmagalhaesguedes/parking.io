
/************************************************************************************************
/
/ Classe Estacionamento
/
/*************************************************************************************************/

class Estacionamento {

  constructor() {
    this.initEventListeners();
    this.exibirVeiculos();
  }

  adicionarVeiculo(placa) {
    if (!placa || placa.trim() === "") {
      alert("Digite uma placa válida antes de adicionar o veículo!");
      return;
    }
    // Formata a placa para o padrão "RUU-3G45" independentemente do que o usuário digitar
    placa = placa.toUpperCase().replace(/-/g, "");

    // Cria um objeto "veiculo" com os dados da placa e a hora de entrada
    const veiculo = {
      placa: placa,
      entrada: new Date()
    };
    const veiculosEstacionados = this.obterVeiculos();
    veiculosEstacionados.push(veiculo);
    this.salvarVeiculos(veiculosEstacionados);
    this.exibirVeiculos();
    this.limparCampos();
  }

  obterVeiculos() {
    const veiculos = localStorage.getItem("veiculos");
    return veiculos ? JSON.parse(veiculos) : [];
  }

  removerVeiculo(placa) {
    const veiculosEstacionados = this.obterVeiculos();
    const indice = veiculosEstacionados.findIndex((veiculo) => veiculo.placa === placa);
    if (indice !== -1) {
      const veiculo = veiculosEstacionados[indice];
      const _placa = placa;
      const permanencia = this.calcularPermanencia(new Date(veiculo.entrada), new Date());
      const valorAPagar = this.calcularValorAPagar(permanencia);

      this.preencherModalDetalhes(_placa, permanencia, valorAPagar, () => {
        this.removerVeiculoDoEstacionamento(veiculosEstacionados, indice);
        this.exibirVeiculos();
      });
    }
  }

  preencherModalDetalhes(_placa, permanencia, valorAPagar, encerrarVeiculoCallback) {
    const modalPlaca = document.getElementById("placa");
    modalPlaca.textContent = `${_placa}`;

    const modalDetalhes = document.getElementById("detalhesPermanencia");
    modalDetalhes.textContent = `${permanencia.horas} horas, ${permanencia.minutos} minutos, ${permanencia.segundos} segundos`;

    const modalValorAPagar = document.getElementById("valorAPagar");
    modalValorAPagar.textContent = valorAPagar.toFixed(2);

    const encerrarBtn = document.getElementById("encerrarBtn");
    encerrarBtn.addEventListener("click", () => {
      encerrarVeiculoCallback();
      $("#modalPagamento").modal("hide");
    });

    $("#modalPagamento").modal("show");
  }

  removerVeiculoDoEstacionamento(veiculosEstacionados, indice) {
    veiculosEstacionados.splice(indice, 1);
    this.salvarVeiculos(veiculosEstacionados);
  }

  calcularPermanencia(entrada, saida) {
    const diff = Math.abs(saida - entrada) / 1000; // diferença em segundos
    const horas = Math.floor(diff / 3600);
    const minutos = Math.floor((diff % 3600) / 60);
    const segundos = Math.floor(diff % 60);
    return { horas, minutos, segundos };
  }

  calcularValorAPagar(permanencia) {
    // Verificar se a permanencia é um objeto válido com as propriedades necessárias
    if (!permanencia || typeof permanencia !== "object" || isNaN(permanencia.horas) || isNaN(permanencia.minutos) || isNaN(permanencia.segundos)) {
      return 0; // Retornar 0 ou outro valor padrão caso a permanência não seja válida
    }

    // Lógica para cálculo do valor a pagar, você pode personalizá-la conforme suas regras de cobrança
    const valorPorHora = 10;
    const totalHoras = permanencia.horas + permanencia.minutos / 60 + permanencia.segundos / 3600;
    const valorAPagar = valorPorHora * totalHoras;

    // Verificar se valorAPagar é um número válido
    if (isNaN(valorAPagar)) {
      return 0; // Retornar 0 ou outro valor padrão caso o cálculo resulte em NaN
    }

    return valorAPagar;
  }

  salvarVeiculos(veiculos) {
    localStorage.setItem("veiculos", JSON.stringify(veiculos));
  }

  formatarData(dataHora) {
    const data = new Date(dataHora);
    const dia = data.getDate().toString().padStart(2, "0");
    const mes = (data.getMonth() + 1).toString().padStart(2, "0");
    const ano = data.getFullYear();
    return { data: `${dia}/${mes}/${ano}` };
  }

  formatarHora(dataHora) {
    const data = new Date(dataHora);
    const hora = data.getHours().toString().padStart(2, "0");
    const minutos = data.getMinutes().toString().padStart(2, "0");
    return `${hora}:${minutos}`;
  }

  createTableCell(text) {
    const td = document.createElement("td");
    td.textContent = text;
    return td;
  }

  createEncerrarButton(placa) {
    const tdBotaoRemover = document.createElement("td"); // Criar célula da tabela para o botão
    const botaoRemover = document.createElement("button");
    botaoRemover.classList.add("btn", "btn-danger", "btn-sm", "btn-block");
    botaoRemover.textContent = "Dar saída";
    botaoRemover.addEventListener("click", () => {
      this.removerVeiculo(placa);
    });
    tdBotaoRemover.appendChild(botaoRemover); // Adicionar o botão à célula
    return tdBotaoRemover;
  }

  // Função para criar a linha da tabela com os dados do veículo
  createTableRow(veiculo) {
    const tr = document.createElement("tr");
    tr.appendChild(this.createTableCell(veiculo.placa));
    tr.appendChild(this.createTableCell(this.formatarData(veiculo.entrada).data));
    tr.appendChild(this.createTableCell(this.formatarHora(veiculo.entrada)));

    const tdPermanencia = this.createTableCell("");
    tr.appendChild(tdPermanencia);

    const tdValorAPagar = this.createTableCell("");
    tr.appendChild(tdValorAPagar);

    tr.appendChild(this.createEncerrarButton(veiculo.placa));
    tr.appendChild(this.createEditarButton(veiculo.placa, veiculo.entrada)); // Adicionar botão "Editar"

    setInterval(() => {
      const permanencia = this.calcularPermanencia(new Date(veiculo.entrada), new Date());
      const valorAPagar = this.calcularValorAPagar(permanencia);

      tdPermanencia.textContent = `${permanencia.horas} horas, ${permanencia.minutos} minutos, ${permanencia.segundos} segundos`;
      tdValorAPagar.textContent = `R$ ${valorAPagar.toFixed(2)}`;
    }, 1000); // 1000 milissegundos = 1 segundo

    return tr;
  }

  exibirVeiculos() {
    const listaVeiculos = document.getElementById("listaVeiculos");
    listaVeiculos.innerHTML = "";

    const veiculosEstacionados = this.obterVeiculos();
    veiculosEstacionados.forEach((veiculo) => {
      const tr = this.createTableRow(veiculo);
      listaVeiculos.appendChild(tr);
    });
  }

  buscarVeiculos() {
    const buscaPlacaInput = document.getElementById("placa");
    const termoBusca = buscaPlacaInput.value.trim().toLowerCase();

    if (termoBusca === "") {
      this.exibirVeiculos();
    } else {
      const veiculosFiltrados = this.obterVeiculos().filter((veiculo) => veiculo.placa.toLowerCase().includes(termoBusca));
      const listaVeiculos = document.getElementById("listaVeiculos");
      listaVeiculos.innerHTML = "";

      veiculosFiltrados.forEach((veiculo) => {
        const tr = this.createTableRow(veiculo);
        listaVeiculos.appendChild(tr);
      });
    }
  }

  // Função para criar o botão Editar
  createEditarButton(placa, entrada) {
    const tdBotaoEditar = document.createElement("td");
    const botaoEditar = document.createElement("button");
    botaoEditar.classList.add("btn", "btn-warning", "btn-sm", "btn-block");
    botaoEditar.textContent = "Editar";
    botaoEditar.addEventListener("click", () => {
      this.editarPlaca(placa, entrada);
    });
    tdBotaoEditar.appendChild(botaoEditar);
    return tdBotaoEditar;
  }

  // Função para permitir a edição da placa
  editarPlaca(placaAtual, entrada) {
    const novaPlaca = prompt("Digite a nova placa:", placaAtual);
    if (novaPlaca !== null) {
      const veiculosEstacionados = this.obterVeiculos();
      const indice = veiculosEstacionados.findIndex((veiculo) => veiculo.placa === placaAtual);
      if (indice !== -1) {
        // Atualizar a placa no objeto do veículo
        veiculosEstacionados[indice].placa = novaPlaca.toUpperCase().replace(/-/g, "");
        // Salvar a lista atualizada de veículos no localStorage
        this.salvarVeiculos(veiculosEstacionados);
        // Atualizar a tabela de veículos
        this.exibirVeiculos();
      }
    }
  }

  limparCampos() {
    document.getElementById("placa").value = "";
  }

  initEventListeners() {
    document.getElementById("adicionarBtn").addEventListener("click", () => {
      const placa = document.getElementById("placa").value;
      this.adicionarVeiculo(placa);
    });

    document.getElementById("buscarBtn").addEventListener("click", () => {
      this.buscarVeiculos();
    });

    document.getElementById("limparBtn").addEventListener("click", () => {
      this.limparCampos();
    });

    document.getElementById("atualizarBtn").addEventListener("click", () => {
      this.exibirVeiculos();
    });
  }
}

// Instantiate the EstacionamentoJS class
const estacionamento = new Estacionamento();
