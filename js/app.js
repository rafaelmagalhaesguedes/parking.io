// Classe Estacionamento
class Estacionamento {

  // Método construtor, chamado ao criar uma instância da classe
  constructor() {
    this.initEventListeners(); // Inicia os event listeners dos botões
    this.exibirVeiculos(); // Exibe os veículos estacionados na tabela
  }

  // Método para adicionar um veículo ao estacionamento
  adicionarVeiculo(placa) {
    try {
      // Verifica se a placa foi digitada e se não está vazia
      if (!placa || placa.trim() === "") {
        throw new Error("Digite uma placa válida antes de adicionar o veículo!");
      }

      // Formata e verifica a placa
      placa = this.formatarPlaca(placa);

      // Insere o traço '-' no meio da placa, se ainda não estiver presente
      if (placa.length === 7) {
        placa = `${placa.substring(0, 3)}-${placa.substring(3)}`;
      } else { 
        throw new Error("Digite uma placa válida!"); 
      }
      
      // Verifica se a placa já existe no estacionamento
      const veiculosEstacionados = this.obterVeiculos();
      this.verificarPlacaExistente(veiculosEstacionados, placa);

      // Cria o objeto veículo e adiciona ao estacionamento
      const veiculo = this.criarObjetoVeiculo(placa);
      this.adicionarVeiculoAoEstacionamento(veiculosEstacionados, veiculo);
      this.salvarVeiculos(veiculosEstacionados);
      this.exibirVeiculos();
      this.limparCampos();
    } catch (error) {
      alert(error.message);
    }
  }

  // Método para verificar o formato da placa
  verificarFormatoPlaca(placa) {
    // Verifica se a placa tem o formato AAA-1234
    const formatoPlaca = /^[A-Z]{3}-\d{4}$/;
    return formatoPlaca.test(placa);
  }

  // Método para formatar a placa
  formatarPlaca(placa) {
    return placa.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  }

  // Método para verificar se a placa já existe no estacionamento
  verificarPlacaExistente(veiculosEstacionados, placa) {
    const placaExistente = veiculosEstacionados.find((veiculo) => veiculo.placa === placa);
    if (placaExistente) {
      throw new Error("Esta placa já está cadastrada no estacionamento!");
    }
  }

  // Método para criar o objeto veículo com a placa e hora de entrada
  criarObjetoVeiculo(placa) {
    return {
      placa: placa,
      entrada: new Date()
    };
  }

  // Método para adicionar o veículo à lista de veículos estacionados
  adicionarVeiculoAoEstacionamento(veiculosEstacionados, veiculo) {
    veiculosEstacionados.push(veiculo);
  }

  // Método para obter a lista de veículos estacionados no LocalStorage
  obterVeiculos() {
    const veiculos = localStorage.getItem("veiculos");
    return veiculos ? JSON.parse(veiculos) : [];
  }

  // Método para remover um veículo do estacionamento
  removerVeiculo(placa) {
    const veiculosEstacionados = this.obterVeiculos();
    const indice = veiculosEstacionados.findIndex((veiculo) => veiculo.placa === placa);
    if (indice !== -1) {
      const veiculo = veiculosEstacionados[indice];
      const p = placa;
      const permanencia = this.calcularPermanencia(new Date(veiculo.entrada), new Date());
      const valorAPagar = this.calcularValorAPagar(permanencia);

      this.preencherModalDetalhes(p, permanencia, valorAPagar, () => {
        this.removerVeiculoDoEstacionamento(veiculosEstacionados, indice);
        this.exibirVeiculos();
      });
    }
  }

  // Método para preencher os detalhes do modal ao encerrar o veículo
  preencherModalDetalhes(p, permanencia, valorAPagar, encerrarVeiculoCallback) {
    const modalPlaca = document.getElementById("detalhesPlaca");
    modalPlaca.textContent = `${p}`;

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

  // Método para remover o veículo da lista de veículos estacionados
  removerVeiculoDoEstacionamento(veiculosEstacionados, indice) {
    veiculosEstacionados.splice(indice, 1);
    this.salvarVeiculos(veiculosEstacionados);
  }

  // Método para calcular o tempo de permanência de um veículo
  calcularPermanencia(entrada, saida) {
    const diff = Math.abs(saida - entrada) / 1000; // diferença em segundos
    const horas = Math.floor(diff / 3600);
    const minutos = Math.floor((diff % 3600) / 60);
    const segundos = Math.floor(diff % 60);
    return { horas, minutos, segundos };
  }

  // Método para calcular o valor a pagar pelo tempo de permanência do veículo
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

  // Método para salvar a lista de veículos estacionados no LocalStorage
  salvarVeiculos(veiculos) {
    localStorage.setItem("veiculos", JSON.stringify(veiculos));
  }

  // Método para formatar a data para exibição na tabela
  formatarData(dataHora) {
    const data = new Date(dataHora);
    const dia = data.getDate().toString().padStart(2, "0");
    const mes = (data.getMonth() + 1).toString().padStart(2, "0");
    const ano = data.getFullYear();
    return { data: `${dia}/${mes}/${ano}` };
  }

  // Método para formatar a hora para exibição na tabela
  formatarHora(dataHora) {
    const data = new Date(dataHora);
    const hora = data.getHours().toString().padStart(2, "0");
    const minutos = data.getMinutes().toString().padStart(2, "0");
    return `${hora}:${minutos}`;
  }

  // Método para criar o botão "Dar saída" na tabela
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

  // Método para criar a célula da tabela com o texto fornecido
  createTableCell(text) {
    const td = document.createElement("td");
    td.textContent = text;
    return td;
  }

  // Método para criar a linha da tabela com os dados do veículo
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

    // Atualiza o tempo de permanência e o valor a pagar a cada segundo
    setInterval(() => {
      const permanencia = this.calcularPermanencia(new Date(veiculo.entrada), new Date());
      const valorAPagar = this.calcularValorAPagar(permanencia);

      tdPermanencia.textContent = `${permanencia.horas} horas, ${permanencia.minutos} minutos, ${permanencia.segundos} segundos`;
      tdValorAPagar.textContent = `R$ ${valorAPagar.toFixed(2)}`;
    }, 1000); // 1000 milissegundos = 1 segundo

    return tr;
  }

  // Método para exibir os veículos estacionados na tabela
  exibirVeiculos() {
    const listaVeiculos = document.getElementById("listaVeiculos");
    listaVeiculos.innerHTML = "";

    const veiculosEstacionados = this.obterVeiculos();
    veiculosEstacionados.forEach((veiculo) => {
      const tr = this.createTableRow(veiculo);
      listaVeiculos.appendChild(tr);
    });
  }

  // Método para buscar veículos na tabela com base na placa digitada
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

  // Método para criar o botão "Editar" na tabela
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

  // Método para permitir a edição da placa de um veículo
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

  // Método para limpar o campo da placa
  limparCampos() {
    document.getElementById("placa").value = "";
  }

  // Método para adicionar os event listeners aos botões
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

// Criando uma instância da classe Estacionamento
const estacionamento = new Estacionamento();
