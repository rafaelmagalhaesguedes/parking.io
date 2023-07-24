# Estacionamento JS

Este é um projeto simples de um sistema de estacionamento desenvolvido em JavaScript utilizando a funcionalidade de LocalStorage para armazenar os veículos estacionados.

# Live link

https://rafaelmagalhaesguedes.github.io/estacionamento.io/

# Funcionalidades

1. Adicionar um veículo: Permite adicionar um veículo ao estacionamento informando sua placa. O sistema registra automaticamente a data e hora de entrada do veículo.

2. Remover um veículo: Permite remover um veículo do estacionamento informando sua placa. O sistema calcula automaticamente o tempo de permanência do veículo e o valor a ser pago com base em uma taxa por hora configurável.

3. Buscar veículos: Permite buscar veículos no estacionamento por placa. O sistema exibe os resultados em uma tabela com as informações de placa, data e hora de entrada, valor a pagar e um botão para encerrar o estacionamento do veículo.

# Tecnologias Utilizadas

- HTML
- CSS (Bootstrap)
- JavaScript

# Como Utilizar

1. Clone o repositório para o seu computador usando o seguinte comando:
    git clone https://github.com/seu-usuario/estacionamento-js.git

2. Abra o arquivo index.html em um navegador da web para acessar o sistema de estacionamento.

# Personalização

Você pode personalizar o sistema de estacionamento alterando as seguintes configurações no arquivo js/app.js:

1. Taxa por hora: A taxa a ser cobrada por hora de estacionamento, que pode ser modificada na função calcularValorAPagar.

2. Layout e estilos: O sistema utiliza o framework Bootstrap para estilos e layout. Você pode personalizar o visual alterando as classes CSS nos elementos HTML.

# Observações

Este é apenas um projeto de exemplo e não possui recursos avançados de segurança ou autenticação. É recomendado utilizá-lo apenas para fins de aprendizado e teste.

# Autor

Nome: Rafael Magalhães Guedes

Email: cyberrminfo@gmail.com

# Licença

Este projeto é livre. Pode ser usado e baixado por qualquer pessoa.
