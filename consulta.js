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
        var endpoint = 'http://10.1.55.90:8080/tc-core-portlets_1.0/ValidarDadosClientePbmrServlet?acao=getDadosCadastraisCliente&idCliente=' + idCliente;

        fetch(endpoint, Object.assign({header: headers}, config))
            .then(function(response) {
                return response.json();
            })
            .then(function(client) {
                setDadosCliente(client);

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
            var endpoint = 'http://10.1.55.90:8080/tc-core-portlets_1.0/ValidarDadosClientePbmrServlet?acao=gravarClientRaiaDrogasil'
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
                    window.close();

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
    var endpoint = 'http://192.1.1.70/terminalconsulta-servicos/aderenciaTratamento/medico/'+doctorCrm+'/'+doctorUf;

    fetch(endpoint, Object.assign({header: headers}, config))
        .then(function(response) {
            return response.json();
        })
        .then(function(medico) {
            setDadosMedico(medico);

        })
        .catch(function(error) {
            console.log('Ocorreu um erro ao buscar o médico[endpoint='+endpoint+'] ' + error);
        });
}

function setDadosMedico(medico) {
    document.getElementById("medicoNome").value = medico[0].nmProfissional;
    document.getElementById("medicoUf").value = document.getElementById("medicoUfSelect").value;
}

function setDadosCliente(cliente) {
    document.getElementById("sequencia").value = cliente.sequencia;
    document.getElementById("isContatos").value = cliente.isContatos;
    document.getElementById("nome").value = cliente.nome;
    document.getElementById("cpf").value = cliente.cpf;
    document.getElementById("dataNascimento").value = cliente.dataNascimento;
    document.getElementById("sexo").value = ''
    if (cliente.sexo === "M") {
        document.getElementById("sexoMasculino").checked = true;
    }
    if (cliente.sexo === "F") {
        document.getElementById("sexoFeminino").checked = true;
    }
    document.getElementById("dddFixo").value = cliente.dddFixo;
    document.getElementById("telefoneFixo").value = cliente.telefoneFixo;
    document.getElementById("dddCelular").value = cliente.dddCelular;
    document.getElementById("celular").value = cliente.celular;
    document.getElementById("email").value = cliente.email;
    document.getElementById("rua").value = cliente.rua;
    document.getElementById("complemento").value = cliente.complemento;
    document.getElementById("bairro").value = cliente.bairro;
    document.getElementById("cidade").value = cliente.cidade;
    document.getElementById("numero").value = cliente.numero;
    document.getElementById("cep").value = cliente.cep;
    if (cliente.uf == null || cliente.uf == '') {
        document.getElementById("uf").value = '';
    }
}