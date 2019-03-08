// var urlBaseServer = 'http://rdfastpass.herokuapp.com/pbm';
var urlBaseServer = 'http://10.1.78.166:8080';
var regexp = /^[a-zA-Z\u00C0-\u00FF]+(([',. -][a-zA-Z\u00C0-\u00FF ])?[a-zA-Z\u00C0-\u00FF]*)*$/g;
var regexNum = /^-?\d*\.?\d*$/;

var urlBaseServerToken = 'http://10.1.78.166:8090';
var accessToken = ''; 

(function () {

    var ui = {
        fields: document.querySelectorAll("input"),
        buttons: document.querySelector("button")
    };

    var idCliente = 0;

    date = document.getElementById("dataNascimento");
    VMasker(date).maskPattern("99/99/9999");

    var cpfObj = document.getElementById('cpf');
    cpfObj.addEventListener('keyup', function(){
        var cpf = cpfObj.value;
        var filter = regexNum;
        if(!filter.test(cpf)){
            cpfObj.value = cpf.substring(0,-1);
        }
    });

    var dddCelularObj = document.getElementById("dddCelular");
    dddCelularObj.addEventListener('keyup', function(){
        var dddCelular = dddCelularObj.value;
        var filter = regexNum;
        if(!filter.test(dddCelular)){
            dddCelularObj.value = dddCelular.substring(0,-1);
        }
    });

    var celularObj = document.getElementById("celular");
    celularObj.addEventListener('keyup', function(){
        var celular = celularObj.value;
        var filter = regexNum;
        if(!filter.test(celular)){
            celularObj.value = celular.substring(0,-1);
        }
    });

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

    autenticar = function(){
        var endpointToken = urlBaseServerToken + '/oauth/token'; 

        var data = {
            grant_type: 'password',
            username: 'RaiaDrogasil',
            password: 'UmFpYWRyb2dhc2lsMjAxOQ=='
        }

         $.ajax({
            type: 'POST',
            url: endpointToken, 
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", 'Basic cmQ6YzJWamNtVjBYM0poYVdGZlpISnZaMkZ6YVd4Zk1qQXhPUT09');
            },           
            dataType: 'json',
            contentType: "application/x-www-form-urlencoded; charset=utf-8",                     
            data: data,
            async: false,
            cache: false,                   
            success: function (data) {
                accessToken = data;
            },error: function (jqXHR, exception) {
                console.log(jqXHR + '  -  ' + exception);
                var msg = 'Ocorreu um erro ao gerar o token de acesso.';
                console.log(msg);
            }
        });
    }

    var getCliente = function () {
        
        autenticar();

        idCliente = getURLParameter('idCliente');

        var endpoint = urlBaseServer + '/v1/pbms/clientes?idCliente=' + idCliente;

        $.ajax({
            type: 'GET',
            async: false,
            cache: false,
            timeout: 5000,
            dataType: "json",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", 'Bearer ' + accessToken.access_token);
            },
            url: endpoint,
            success: function (data) {
                retorno = data;
                console.log(retorno);
                setDadosCliente(retorno);
            },error: function (jqXHR, exception) {
                console.log(jqXHR + '  -  ' + exception);
                var msg = 'Ocorreu um erro ao buscar informacoes do cliente [acao=getDadosCadastraisCliente&idCliente='+idCliente+'] ';
                console.log(msg);
            }
        });

    }

    var postCliente = function () {

        var cdProduto = getURLParameter('cdEan');
        var precoBruto = getURLParameter('precoBruto');
        var precoLiquido = getURLParameter('precoLiquido');

        ui.buttons.addEventListener("click", function (event) {
            event.preventDefault();

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

            for (var n = 0; n < ui.fields.length; n++) {
                var item = ui.fields[n];
                client[item.id] = item.value;
            }

            if (document.getElementById("sexoMasculino").checked == true) {
                client.sexo = "M";
            }

            if (document.getElementById("sexoFeminino").checked == true) {
                client.sexo = "F";
            }

            console.log(client);

            var submit = validarFormulario();

            if(submit){                
               
                var endpoint = urlBaseServer + '/v1/pbms/clientes';

                console.log('endpoint --> ' + endpoint);

                var data = {
                    idCliente: idCliente,
                    nome: client.nome,
                    cpf: client.cpf,
                    dataNascimento: client.dataNascimento,
                    sexo: client.sexo,
                    tipoLogradouro: '',
                    endereco: client.rua,
                    numero: client.numero,
                    complemento: client.complemento,
                    cep: client.cep,
                    bairro: client.bairro,
                    cidade: client.cidade,
                    uf: client.uf,
                    dddTelefone: client.dddFixo,
                    telefone: client.telefoneFixo,
                    dddCelular: client.dddCelular,
                    celular: client.celular,
                    email: client.email,
                    medicoCrm: client.medicoCrm,
                    medicoNome: client.medicoNome,
                    medicoUf: client.medicoUf,
                    contatoEmail: client.checkEmail,
                    contatoCelular: client.checkCelular,
                    contatoCorreio: client.checkCorreio,
                    contatoPermissao: client.checkAutorizacao,
                    cdProduto: cdProduto,
                    precoBruto: precoBruto,
                    precoLiquido: precoLiquido,
                    isContatos: client.isContatos,
                    nrSequenciaEndereco: client.sequencia
                }

                autenticar();

                $.ajax({
                    type: 'POST',
                    url: endpoint,
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",                     
                    data: JSON.stringify(data),
                    async: false,
                    cache: false,   
                    beforeSend: function(request) {
                        request.setRequestHeader("Authorization", 'Bearer ' + accessToken.access_token);
                    },                
                    success: function (data) {
                        alert('Cliente cadastrado com sucesso !');
                        window.close();
                    },error: function (jqXHR, exception) {
                        console.log(jqXHR + '  -  ' + exception);
                        var msg = 'Ocorreu um erro ao cadastrar o cliente [acao=gravarClientRaiaDrogasil&idCliente='+idCliente+'] ';
                        alert('Ocorreu um erro ao cadastrar o cliente!');
                        console.log(msg);
                    }
                });
            }
        })
    }

    var init = function () {
        document.getElementById("checkCorreio").value = 0;
        document.getElementById("checkEmail").value = 0;
        document.getElementById("checkCelular").value = 0;
        document.getElementById("checkAutorizacao").value = 0;
        getCliente();
        postCliente();
        // searchCrm(document.getElementById("medicoUfSelect"));
    }();

    function validarFormulario(){
        var retornoSubmit = true;        
        var regexDate = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
        var regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        function exibirMsgErro(obj, nomeCampo, idErro, tipoErro,tamPermit){
            retornoSubmit = false;
            obj.style.border='2px solid red';
            obj.focus();  
            if(tipoErro == "Null"){
                document.getElementById("errorMessage" + idErro)
                .innerHTML = 'Favor preencher o campo ' + nomeCampo;
            } else if (tipoErro == "Alfanumerico"){
                document.getElementById("errorMessage" + idErro)
                .innerHTML = 'Favor inserir somente letras.';
            } else if (tipoErro == "Numerico"){
                document.getElementById("errorMessage" + idErro)
                .innerHTML = 'Favor inserir somente numeros.';                
            } else if (tipoErro == "Email"){
                document.getElementById("errorMessage" + idErro)
                .innerHTML = 'Favor inserir um e-mail valido.';
            }else if (tipoErro == "DataNascimento"){
                document.getElementById("errorMessage" + idErro)
                .innerHTML = 'Favor inserir a data de nascimento no formato dd/mm/yyyy.';
            } else if(Number.isInteger(tipoErro)){
                document.getElementById("errorMessage" + idErro)
                .innerHTML = 'Favor inserir ate ' + tamPermit + ' digitos.';
            }
        }

        function exibirBordaPadrao(obj, idErro){
            obj.style.border='1px solid #D6D6D6';
            document.getElementById("errorMessage" + idErro)
                .innerHTML = '';
        }

        var nome = document.getElementById("nome");
        if(!nome || nome.value == ""){          
            exibirMsgErro(nome, "Nome.", "Nome", "Null", null);         
        } else {                
            if(!nome.value.match(regexp)){                
                exibirMsgErro(nome, null, "Nome", "Alfanumerico", null); 
            } else {
                exibirBordaPadrao(nome, "Nome");
            }                
        }

        var sexo = document.getElementById("sexo");
        if(!jQuery("#sexoMasculino") ||  
            (!jQuery("#sexoMasculino").attr("checked") && !jQuery("#sexoFeminino").attr("checked"))
            ){                
            exibirMsgErro(sexo, "Sexo.", "Sexo", "Null", null);         
        } else {
            exibirBordaPadrao(sexo, "Sexo");
        }

        var cpf = document.getElementById("cpf");
        if(!cpf || cpf.value == ""){          
            exibirMsgErro(cpf, "CPF.", "Cpf", "Null");         
        } else {
            if(!cpf.value.match(regexNum)){                
                exibirMsgErro(cpf, null, "Cpf", "Numerico", null); 
            } else {
                if(cpf.value.length > 11){
                    exibirMsgErro(cpf, null, "Cpf", cpf.value.length, 11);
                } else {
                    exibirBordaPadrao(cpf, "Cpf");
                }                    
            }   
        }

        var dataNascimento = document.getElementById("dataNascimento");
        if(!dataNascimento || dataNascimento.value == ""){         
            jQuery("#pularLinhaDatNasc").removeClass("none");      
            exibirMsgErro(dataNascimento, "Data de Nascimento.", "DataNascimento", "Null", null);         
        } else {
            if(!dataNascimento.value.match(regexDate)){    
                jQuery("#pularLinhaDatNasc").removeClass("none");            
                exibirMsgErro(dataNascimento, null, "DataNascimento", "DataNascimento", null); 
            } else {
                jQuery("#pularLinhaDatNasc").addClass("none");
                exibirBordaPadrao(dataNascimento, "DataNascimento");
            }                
        }
        
        var dddCelular = document.getElementById("dddCelular");
        if(!dddCelular || dddCelular.value == ""){          
            exibirMsgErro(dddCelular, "DDD/Celular.", "DDDTelefoneCelular", "Null", null);         
        } else {
            if(!dddCelular.value.match(regexNum)){                
                exibirMsgErro(dddCelular, null, "DDDTelefoneCelular", "Numerico", null); 
            } else {
                if(dddCelular.value.length > 2){
                    exibirMsgErro(dddCelular, null, "DDDTelefoneCelular", dddCelular.value.length, 2);
                } else {
                    exibirBordaPadrao(dddCelular, "DDDTelefoneCelular");
                }                    
            }                
        }

        var celular = document.getElementById("celular");
        if(!celular || celular.value == ""){          
            exibirMsgErro(celular, "Celular.", "TelefoneCelular", "Null", null);         
        } else {
            if(!celular.value.match(regexNum)){                
                exibirMsgErro(celular, null, "TelefoneCelular", "Numerico", null); 
            } else {
                if(celular.value.length > 9){
                    exibirMsgErro(celular, null, "TelefoneCelular", celular.value.length, 9);
                } else {
                    exibirBordaPadrao(celular, "TelefoneCelular");
                }                   
            }                 
        }
        
        var email = document.getElementById("email");
        if(!email || email.value == ""){          
            exibirMsgErro(email, "Email.", "Email", "Null", null);         
        } else {            
            if(!email.value.match(regexEmail)){                
                exibirMsgErro(email, null, "Email", "Email", null); 
            } else {
                exibirBordaPadrao(email, "Email");
            }
            
        }

        var rua = document.getElementById("rua");
        if(!rua || rua.value == ""){          
            exibirMsgErro(rua, "Rua.", "Rua", "Null", null);         
        } else {
            if(!rua.value.match(regexp)){                
                exibirMsgErro(rua, null, "Rua", "Alfanumerico", null); 
            } else {
                exibirBordaPadrao(rua, "Rua");
            }                
        }

        var bairro = document.getElementById("bairro");
        if(!bairro || bairro.value == ""){          
            exibirMsgErro(bairro, "Bairro.", "Bairro", "Null", null);         
        } else {
            if(!bairro.value.match(regexp)){                
                exibirMsgErro(bairro, null, "Bairro", "Alfanumerico", null); 
            } else {
                exibirBordaPadrao(bairro, "Bairro");
            }                
        }

        var cidade = document.getElementById("cidade");
        if(!cidade || cidade.value == ""){          
            exibirMsgErro(cidade, "Cidade.", "Cidade", "Null", null);         
        } else {
            if(!cidade.value.match(regexp)){                
                exibirMsgErro(cidade, null, "Cidade", "Alfanumerico", null); 
            } else {
                exibirBordaPadrao(cidade, "Cidade");
            }                
        }

        var numero = document.getElementById("numero");
        if(!numero || numero.value == ""){          
            jQuery("#pularLinhaNumero").removeClass("none");
            exibirMsgErro(numero, "Numero.", "Numero", "Null", null);         
        } else {
            if(!numero.value.match(regexNum)){ 
                jQuery("#pularLinhaNumero").removeClass("none");               
                exibirMsgErro(numero, null, "Numero", "Numerico", null); 
            } else {
                jQuery("#pularLinhaNumero").addClass("none"); 
                exibirBordaPadrao(numero, "Numero");
            }                
        }

        var cep = document.getElementById("cep");
        if(!cep || cep.value == ""){ 
            jQuery("#pularLinhaCep").removeClass("none");         
            exibirMsgErro(cep, "Cep.", "Cep", "Null", null);         
        } else {
            if(!cep.value.match(regexNum)){       
                jQuery("#pularLinhaCep").removeClass("none");         
                exibirMsgErro(cep, null, "Cep", "Numerico", 8); 
            } else {
                jQuery("#pularLinhaCep").addClass("none");
                exibirBordaPadrao(cep, "Cep");
            }                
        }

        var uf = document.getElementById("uf");
        if(!uf ||  uf.value == ""){          
            jQuery("#pularLinhaUF").removeClass("none");  
            exibirMsgErro(uf, "UF.", "Uf", "Null", null);         
        } else {
            if(!uf.value.match(regexp)){  
                jQuery("#pularLinhaUF").removeClass("none");                
                exibirMsgErro(uf, null, "Uf", "Alfanumerico", null); 
            } else {
                jQuery("#pularLinhaUF").addClass("none");  
                exibirBordaPadrao(uf, "Uf");
            }
        }

        var medicoCrm = document.getElementById("medicoCrm");
        if(!medicoCrm || medicoCrm.value == ""){          
            exibirMsgErro(medicoCrm, "CRM.", "MedicoCRM", "Null", null);         
        } else {
            if(!medicoCrm.value.match(regexNum)){                
                exibirMsgErro(medicoCrm, null, "MedicoCRM", "Numerico", null); 
            } else {
                exibirBordaPadrao(medicoCrm, "MedicoCRM");
            }                
        }

        var medicoUfSelect = document.getElementById("medicoUfSelect");
        if(!medicoUfSelect || medicoUfSelect.value == "" || medicoUfSelect.value == "0"){          
            exibirMsgErro(medicoUfSelect, "UF do médico.", "MedicoUf", "Null", null);         
        } else {
            exibirBordaPadrao(medicoUfSelect, "MedicoUf");
        }

        var medicoNome = document.getElementById("medicoNome");
        if(!medicoNome || medicoNome.value == ""){          
            exibirMsgErro(medicoNome, "Nome do médico.", "MedicoNome", "Null", null);         
        } else {
            if(!medicoNome.value.match(regexp)){                
                exibirMsgErro(medicoNome, null, "MedicoNome", "Alfanumerico", null); 
            } else {
                exibirBordaPadrao(medicoNome, "MedicoNome");
            }
        }

        return retornoSubmit;
    }

})();

function searchCrm(uf) {

    var doctorCrm = document.getElementById("medicoCrm").value;
    var doctorUf = uf.value;

    getMedico(doctorCrm, doctorUf)

};

function getMedico(medicoCrm, medicorUf) {

    autenticar();
    
    var endpoint = urlBaseServer + '/v1/medico/crm/'+medicoCrm+'/uf/'+medicorUf;

    $.ajax({
        type: 'GET',
        async: false,
        cache: false,
        timeout: 5000,
        dataType: "json",
        url: endpoint,
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", 'Bearer ' + accessToken.access_token);
        },
        success: function (data) {
            retorno = data;
            console.log(retorno);
            setDadosMedico(retorno);
        },error: function (jqXHR, exception) {
            console.log(jqXHR + '  -  ' + exception);
            var msg = 'Ocorreu um erro ao buscar o médico[endpoint='+endpoint+'] ';
            console.log(msg);
        }
    });
}

function setDadosMedico(medico) {
    document.getElementById("medicoNome").value = medico[0].nmProfissional;
    document.getElementById("medicoUf").value = document.getElementById("medicoUfSelect").value;
}

function setDadosCliente(cliente) {
    document.getElementById("sequencia").value = (cliente.sequencia) ? cliente.sequencia : '';
    document.getElementById("isContatos").value = (cliente.isContatos) ? cliente.isContatos : '';
    document.getElementById("nome").value = (cliente.nome) ? cliente.nome : '';
    document.getElementById("cpf").value = (cliente.cpf) ? cliente.cpf : '';
    document.getElementById("dataNascimento").value = cliente.dataNascimento  ? cliente.dataNascimento : '';
    document.getElementById("sexo").value = ''
    if (cliente.sexo === "M") {
        document.getElementById("sexoMasculino").checked = true;
    }
    if (cliente.sexo === "F") {
        document.getElementById("sexoFeminino").checked = true;
    }
    document.getElementById("dddFixo").value = (cliente.dddFixo)  ? cliente.dddFixo : '';
    document.getElementById("telefoneFixo").value = (cliente.telefoneFixo)  ? cliente.telefoneFixo : '';
    document.getElementById("dddCelular").value = (cliente.dddCelular)  ? cliente.dddCelular : '';
    document.getElementById("celular").value = (cliente.celular)  ? cliente.celular : '';
    document.getElementById("email").value = (cliente.email)  ? cliente.email : '';
    document.getElementById("rua").value = (cliente.rua)  ? cliente.rua : '';
    document.getElementById("complemento").value = (cliente.complemento)  ? cliente.complemento : '';
    document.getElementById("bairro").value = (cliente.bairro) ? cliente.bairro : '';
    document.getElementById("cidade").value = (cliente.cidade) ? cliente.cidade : '';
    document.getElementById("numero").value = (cliente.numero) ? cliente.numero : '';
    document.getElementById("cep").value = (cliente.cep) ? cliente.cep : '';
    document.getElementById("uf").value = (cliente.uf) ? cliente.uf : '';
}