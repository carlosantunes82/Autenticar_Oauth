(function () {
    var ui = {
        fields: document.querySelectorAll("input"),
        buttons: document.querySelector("button")
    };

    date = document.getElementById("dataNascimento")
    VMasker(date).maskPattern("99/99/9999");

    var validadeFields = function (event) {
        event.preventDefault();
    }

    // var getIdClient = function () {
    //     var urlString = window.location.href;
    //     var url = new URL(urlString);
    //     var id = url.searchParams.get("id");

    //     getClient(id);

    //     const endpoint = `http://192.1.1.70/terminalconsulta-servicos/aderenciaTratamento/medico/317700/RJ`
    // }

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

        var idCliente = getURLParameter('idCliente'); // window.location.search.replace( /^\D+/g, '');

        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const config = {
            method: "GET"
        };

        const endpoint = 'http://10.1.78.225:8080/tc-core-portlets_1.0/ValidarDadosClientePbmrServlet?acao=getDadosCadastraisCliente&idCliente=' + idCliente
        console.log('endpoint --> ' + endpoint);

        fetch(endpoint, Object.assign({
                header: headers
            }, config))
            .then(res => res.json())
            .then(getClientSucess)
            .catch(error => console.log(error));
    }

    var getClientSucess = function (client) {

        Object.keys(client).map((key) => {
            document.getElementById(`${key}`).value = client[`${key}`]

            if (client[`${key}`] == "null") {
                document.getElementById(`${key}`).value = ""
            }

        });

        document.getElementById("sexo").value = ''

        if (client.sexo === "M") {
            document.getElementById("sexoMasculino").checked = true;
        }

        if (client.sexo === "F") {
            document.getElementById("sexoFeminino").checked = true;
        }

    }
    var postClient = function () {

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

            if (document.getElementById("sexoMasculino").checked == true)
                client.sexo = "M"
                delete client.sexoFeminino

            if (document.getElementById("sexoFeminino").checked == true)
                client.sexo = "F"
                delete client.sexoMasculino

            console.log(client)

            const endpont = `http://localhost:8080/tc-core-portlets_1.0/ValidarDadosClientePbmrServlet?acao=gravarClient&idCliente=${id}&nome=${client.nome}&cpf=${client.cpf}&dataNascimento=${client.dataNascimento}&sexo=${client.sexo}&tipoLogradouro=&endereco=${client.rua}&numero=${client.numero}&complemento=${client.complemento}&cep=${client.cep}&bairro=${client.bairro}&cidade=${client.cidade}&uf=${client.uf}&dddTelefone=${client.dddFixo}&telefone=${client.telefoneFixo}&dddCelular=${client.dddCelular}&celular=${client.celular}&email=${client.email}&medicoCrm=${client.medicoCrm}&medicoNome=${client.medicoNome}&medicoUf=${client.medicoUf}&contatoEmail=${client.checkEmail}&contatoCelular=${client.checkCelular}&contatoCorreio=${client.checkCorreio}&contatoPermissao=${client.checkAutorizacao}&cdProduto=${cdProduto}&precoBruto=${precoBruto}&precoLiquido=${precoLiquido}&isContatos=${isContatos}&nrSequenciaEndereco=${seqEnd}&nroCartao=${nrCartao}&tipoInclusao=${tipoIncl}`

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

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const config = {
        method: "GET"
    };

    const endpoint = `http://192.1.1.70/terminalconsulta-servicos/aderenciaTratamento/medico/${doctorCrm}/${doctorUf}`;

    fetch(endpoint, Object.assign({
            header: headers
        }, config))
        .then(res => res.json())
        .then(getDoctorSucess)
        .catch(error => console.log(error));
}

function getDoctorSucess(doctor) {
    document.getElementById("medicoNome").value = doctor[0].nmProfissional
}