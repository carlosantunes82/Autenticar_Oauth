(function () {
    var ui = {
        fields: document.querySelectorAll("input"),
        buttons: document.querySelector("button")
    };

    var idCliente = 0;

    date = document.getElementById("dataNascimento")
    VMasker(date).maskPattern("99/99/9999");

    var validadeFields = function (event) {
        event.preventDefault();
    }

    var getURLParameter = function (sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
    }

    var getClient = function () {

        idCliente = getURLParameter('idCliente');

        var headers = new Headers();
        headers.append("Content-Type", "application/json");

        var config = {
            method: "GET"
        };

        // TODO Parametrizar endpoint ValidarDadosClientePbmrServlet?acao=getDadosCadastraisCliente
        var endpoint = 'http://localhost:8080/tc-core-portlets_1.0/ValidarDadosClientePbmrServlet?acao=getDadosCadastraisCliente&idCliente=' + idCliente

        fetch(endpoint, Object.assign({header: headers}, config))
            .then(function(response) {
                return response.json();
            })
            .then(function(client) {
                setClientDados(client);

            })
            .catch(function(error) {
                console.log('Ocorreu um erro ao buscar informacoes do cliente [acao=getDadosCadastraisCliente&idCliente='+idCliente+'] ' + error);
            });

    }

    var postClient = function () {

        var cdProduto = getURLParameter('cdEan');
        var precoBruto = getURLParameter('precoBruto');
        var precoLiquido = getURLParameter('precoLiquido');

        ui.buttons.addEventListener("click", function (event) {
            event.preventDefault();

            console.log(event)

            if (document.getElementById("checkCorreio").checked == true) {
                document.getElementById("checkCorreio").value = 1
            } else {
                document.getElementById("checkCorreio").value = 0
            }

            if (document.getElementById("checkEmail").checked == true) {
                document.getElementById("checkEmail").value = 1
            } else {
                document.getElementById("checkEmail").value = 0
            }

            if (document.getElementById("checkCelular").checked == true) {
                document.getElementById("checkCelular").value = 1
            } else {
                document.getElementById("checkCelular").value = 0
            }

            if (document.getElementById("checkAutorizacao").checked == true) {
                document.getElementById("checkAutorizacao").value = 1
            } else {
                document.getElementById("checkAutorizacao").value = 0
            }

            var client = {}

            ui.fields.forEach(function(item, index){

                client[item.id] = item.value

            })

            console.log(client)

            // TODO Parametrizar endpoint ValidarDadosClientePbmrServlet?acao=gravarClientRaiaDrogasil
            var endpoint = 'http://localhost:8080/tc-core-portlets_1.0/ValidarDadosClientePbmrServlet?acao=gravarClientRaiaDrogasil'
                + '&idCliente='+idCliente+'&nome='+client.nome+'&cpf='+client.cpf+'&dataNascimento='+client.dataNascimento
                + '&sexo='+client.sexo+'&tipoLogradouro=&endereco='+client.rua+'&numero=' + client.numero
                + '&complemento='+client.complemento+'&cep='+client.cep+'&bairro='+client.bairro+'&cidade=' + client.cidade
                + '&uf='+client.uf+'&dddTelefone='+client.dddFixo+'&telefone=' + client.telefoneFixo
                + '&dddCelular='+client.dddCelular+'&celular='+client.celular+'&email=' + client.email
                + '&medicoCrm='+client.medicoCrm+'&medicoNome='+client.medicoNome+'&medicoUf=' + client.medicoUf
                + '&contatoEmail='+client.checkEmail+'&contatoCelular=' + client.checkCelular
                + '&contatoCorreio='+client.checkCorreio+'&contatoPermissao='+client.checkAutorizacao+'&cdProduto=' + cdProduto
                + '&precoBruto='+precoBruto+'&precoLiquido='+precoLiquido+'&isContatos='+client.isContatos+'&nrSequenciaEndereco=' + client.sequencia;

            console.log('endpoint --> ' + endpoint);

            var headers = new Headers();
            headers.append("Content-Type", "text/html");

            var config = {
                method: "POST"
            };

            fetch(endpoint, Object.assign({header: headers}, config))
                .then(function(response) {
                    return response;
                })
                .then(function(client) {
                    alert('Cliente cadastrado com sucesso !');
                    window.close()

                })
                .catch(function(error) {
                    console.log('Ocorreu um erro ao realizar o cadastro do cliente [acao=gravarClientRaiaDrogasil - idCliente='+idCliente+'] ' + error);
                });
        })
    }

    var init = function () {
        document.getElementById("checkCorreio").value = 0;
        document.getElementById("checkEmail").value = 0;
        document.getElementById("checkCelular").value = 0;
        document.getElementById("checkAutorizacao").value = 0;
        getClient();
        postClient();
        searchCrm();
    }();


})();

function searchCrm(crm) {

    var doctorCrm = document.getElementById("medicoCrm").value;
    var doctorUf = crm.value;

    getDoctor(doctorCrm, doctorUf)

};

function getDoctor(doctorCrm, doctorUf) {

    var headers = new Headers();
    headers.append("Content-Type", "application/json");

    var config = {
        method: "GET"
    };

    // TODO Parametrizar endpoint terminalconsulta-servicos
    var endpoint = `http://192.1.1.70/terminalconsulta-servicos/aderenciaTratamento/medico/${doctorCrm}/${doctorUf}`;

    fetch(endpoint, Object.assign({
        header: headers
    }, config))
        .then(res => res.json())
        .then(getDoctorSucess)
        .catch(error => console.log(error));
}

function getDoctorSucess(doctor) {
    document.getElementById("medicoNome").value = doctor[0].nmProfissional;
    document.getElementById("medicoUf").value = document.getElementById("medicoUfSelect").value;
}

function setClientDados(client) {
    document.getElementById("sequencia").value = client.sequencia;
    document.getElementById("isContatos").value = client.isContatos;
    document.getElementById("nome").value = client.nome;
    document.getElementById("cpf").value = client.cpf;
    document.getElementById("dataNascimento").value = client.dataNascimento;
    document.getElementById("sexo").value = ''
    if (client.sexo === "M") {
        document.getElementById("sexoMasculino").checked = true;
    }
    if (client.sexo === "F") {
        document.getElementById("sexoFeminino").checked = true;
    }
    document.getElementById("dddFixo").value = client.dddFixo;
    document.getElementById("telefoneFixo").value = client.telefoneFixo;
    document.getElementById("dddCelular").value = client.dddCelular;
    document.getElementById("celular").value = client.celular;
    document.getElementById("email").value = client.email;
    document.getElementById("rua").value = client.rua;
    document.getElementById("complemento").value = client.complemento;
    document.getElementById("bairro").value = client.bairro;
    document.getElementById("cidade").value = client.cidade;
    document.getElementById("numero").value = client.numero;
    document.getElementById("cep").value = client.cep;
    if (client.uf == null || client.uf == '') {
        document.getElementById("uf").value = '';
    }
}