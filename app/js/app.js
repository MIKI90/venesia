var conductores = [];
var clientes = [];
var contratos =[];
var transacciones=[];

// documento cargado
$(document).ready(function(){

  if(!web3.isConnected()) {
     alert("No se econtro un nodo para conectarse \n Configurelo en el archivo config.js en la variable nodo ejemplo: var nodo = 'http://localhost:8545';");
  }
    //eventos click
    // btn open Pasajero
    $(".eresPasajero").click(function(){
      $(".pasajero").show();
      $(".conductor").hide();
      $(".registro").hide();
      $(".inicio").hide();
    });

    // btn open Conductor
    $(".eresConductor").click(function(){
        $(".pasajero").hide();
        $(".conductor").show();
        $(".registro").hide();
        $(".inicio").hide();
    });

    // btn open Registro
    $(".btnBlockChain").click(function(){
      $(".pasajero").hide();
      $(".conductor").hide();
      $(".registro").show();
      $(".inicio").hide();
    });


    // btn close Pasajero
    $(".btnClosePasajero").click(function(){
        $(".pasajero").hide();
        $(".inicio").show();
    });

    // btn close Conductor
    $(".btnCloseConductor").click(function(){
        $(".conductor").hide();
        $(".inicio").show();
    });

    // btn close Registro
    $(".btnCloseRegistro").click(function(){
        $(".registro").hide();
        $(".inicio").show();
    });

    // registra conductor
    $("#registraConductor").click(function(){
          var nombre = $("#nombreConductor").val();
          var direccion =  $("#llaveConductor").val();
          ValidaConductor(direccion,nombre);
          //registraConductor(direccion,nombre);
          //actualizaListaConductor();
    });

    // Genera contrato
    $("#confirmacionViaje").click(function(){
          ValidaConfirmacion();
          //CrearContrato();
    });

    // Mostrar Registro
    $("#mostrarRegistros").click(function(){
      $(".divListaDeContractos3").hide();
      $(".divListaDeTransaciones").show();
        ActualizaListaTransacciones();
    });

    // Mostrar contrato
    $("#mostrarContratos").click(function(){
          $(".divListaDeTransaciones").hide();
          $(".divListaDeContractos3").show();
          ActualizaListaContratos();

    });

    //registra cambio en la clave de cliente
    $("#clientAddress").on("change",function(){
          var claveCliente = $("#clientAddress").val();

           ActualizaSaldoCliente();

          var result = $.grep(clientes, function(e){ return e.direccion == claveCliente;});
          if(result.length > 0){
            $.each(result, function(){
                 actualizaContratosCliente(this);
            });
          }else{
            $("#listaDeContratos").empty();
          }
    });

    //registra cambio en la clave de conductor
    $("#llaveConductor").on("change",function(){
          var claveConductor = $("#llaveConductor").val();

          ActualizaSaldoConductor();

          var result = $.grep(conductores, function(e){ return e.direccion == claveConductor;});
          if(result.length > 0){
            $.each(result, function(){
                 actualizaContratosConductor(this);
            });
          }else{
            $("#listaDeContratos2").empty();
          }
    });

});

// registra conductor
function registraConductor(address, nombreConductor){
  var conductor = {
    direccion: address,
    nombre : nombreConductor,
    contratos:[]
  };
  var result = $.grep(conductores, function(e){ return e.direccion == conductor.direccion; });
  if(result.length == 0)
  {
    conductores.push(conductor);
    alert("Se a registrado el conductor: "+nombreConductor+"\nCon Direccion: "+address);
  }else{
    alert("El conductor se encuentra registrado.");
  }
}

// registra Cliente
function registraCliente(pdireccionCliente, pOrigen, pDestino, pPrecio){
  var cliente = {
    direccion : pdireccionCliente,
    origen: pOrigen,
    destino: pDestino,
    precio: pPrecio,
    contratos: []
  }

  var result = $.grep(clientes, function(e){ return e.direccion == cliente.direccion; });
  if(result.length == 0)
  {
    clientes.push(cliente);
  }else{
    $.each(clientes, function() {
      if (this.direccion === cliente.direccion) {
          this.origen = cliente.origen;
          this.destino = cliente.origen;
          this.precio = cliente.precio;
         }
     });
  }
}

//Actualiza lista de contratos
function ActualizaListaContratos(){
  var allItems = '';
  for (var i=0; i< contratos.length; i++){
       allItems += '<li class="list-group-item clearfix" data-rowid="' + i + '"><div class="listContratoAddress"><label>Direccion: </label>'+contratos[i].address+'</div><div class="listContratoBuyer"><label>Cliente: </label>'+contratos[i].buyer+'</div><div class="listContratoSeller"><label>Conductor: </label>'+contratos[i].seller+'</div><div class="listContratoOrigen"><label>Origen: </label>'+contratos[i].origen+'</div><div class="listContratoDestino"><label>Destino: </label>'+contratos[i].destino+'</div><div class="listContratoPrecio"><label>Precio: </label>'+contratos[i].precio+'</div></li>';
  }
  $("#listaDeContratos3").empty().append(allItems);
}

//Actualiza lista de transacciones
function ActualizaListaTransacciones(){
  var allItems = '';
  for (var i=0; i< transacciones.length; i++){
       allItems += '<li class="list-group-item clearfix" data-rowid="' + i + '"><div class="listTransacionAddress"><label>Direccion: </label>'+transacciones[i].address+'</div><div class="listTransacionesBuyer"><label>Cliente: </label>'+transacciones[i].buyer+'</div><div class="listTransaccionesSeller"><label>Conductor: </label>'+transacciones[i].seller+'</div><div class="listTransaccionesEstado"><label>Concepto: </label>'+transacciones[i].estado+'</div><div class="listContratoPrecio"><label>Precio: </label>'+transacciones[i].precio+'</div></li>';
  }
  $("#listaDeTransacciones").empty().append(allItems);
}

//Actualiza las listas de conductores
function actualizaListaConductor(){
    var allItems = '';
    for (var i=0; i< conductores.length; i++){
         allItems += '<li class="list-group-item clearfix"  data-rowid="' + i + '"><div><div class="listNombreConductor">'+conductores[i].nombre+'</div><div class="listDireccionConductor">'+conductores[i].direccion+'</div><div class="btnSeleccionaConductor"><button class="btn btn-primary" value="'+conductores[i].nombre+'|'+conductores[i].direccion+'">Seleccionar</button></div></div></li>';
    }
    $("#listaConductores").empty().append(allItems);

    $("#listaConductores").on("click", "li button", function(e){
        e.stopImmediatePropagation();
        var rowid = $(this).parents("li").data("rowid");
        var btnText = $(this).val();
        var res = btnText.split("|");
        CalculaDistancia();
        informacionConfirmacion(res[0],res[1]);
        $(".divConfirmacionViaje").show();
    });
}

//Actuaiiza lista de contratos del Cliente
function actualizaContratosCliente(cliente){
  var allItems = '';
  var contratos = cliente.contratos;
  for (var i=0; i< contratos.length; i++){
       var con =  JSON.stringify(contratos[i]);
       var client =  JSON.stringify(cliente);
       allItems += '<li class="list-group-item clearfix"  data-client='+client+' data-con='+con+' data-rowid="' + i +'"><div class="listOrigenContrato"><label>Origen:</label>'+contratos[i].origen+'</div><div class="listDestinoContrato"><label>Destino:</label>'+contratos[i].destino+'</div><div class="listPrecioContrato"><label>Precio:</label>'+contratos[i].precio+'</div><div class="listllaveContrato"><label>Contrato:</label>'+contratos[i].address+'</div><div class="listLlaveConductor"><label>Conductor:</label>'+contratos[i].seller+'</div><div class="divconfirmaServicio"><button class="confirmaServicio btn btn-primary">Confirmar Servicio</button></div><div class="divcancelaServicio"><button class="cancelaServicio btn btn-secondary">Cancelar Servicio</button></div></li>';
  }
  $("#listaDeContratos").empty().append(allItems);

  $("#listaDeContratos").on("click", "li .confirmaServicio", function(e){
      e.stopImmediatePropagation();
      var rowid = parseInt($(this).parents("li").data("rowid"));
      var contrato = $(this).parents("li").data("con").address;
      var abi = $(this).parents("li").data("con").abi;
      var buyer = $(this).parents("li").data("con").buyer;
      var seller = $(this).parents("li").data("con").seller;
      var precio = $(this).parents("li").data("con").precio;
      var enviarCliente = $(this).parents("li").data("client").direccion;
      ContratoCumplido(contrato, abi, buyer, seller, precio);
      $("#listaDeContratos > li[data-rowid=" + rowid + "]").remove();
      RemoverContratoCliente(enviarCliente, contrato);
      RemoverContratoConductor(seller, contrato);
      RefrescaListas();
  });

  $("#listaDeContratos").on("click", "li .cancelaServicio", function(e){
      e.stopImmediatePropagation();
      var rowid = parseInt($(this).parents("li").data("rowid"));
      var contrato = $(this).parents("li").data("con").address;
      var abi = $(this).parents("li").data("con").abi;
      var buyer = $(this).parents("li").data("con").buyer;
      var seller = $(this).parents("li").data("con").seller;
      var enviarCliente = $(this).parents("li").data("client").direccion;
      CancelaContratoCliente(contrato, abi, buyer, seller);
      $("#listaDeContratos > li[data-rowid=" + rowid + "]").remove();
      RemoverContratoCliente(enviarCliente, contrato);
      RemoverContratoConductor(seller, contrato);
      RefrescaListas();
  });
}

//Actualiza lista de contratos del conductor

function actualizaContratosConductor(conductor){
  var allItems = '';
  var contratos = conductor.contratos;
  for (var i=0; i< contratos.length; i++){
       var con =  JSON.stringify(contratos[i]);
       var conduc =  JSON.stringify(conductor);
       allItems += '<li class="list-group-item clearfix"  data-conduc='+conduc+' data-con='+con+' data-rowid="' + i +'"><div class="listOrigenContrato"><label>Origen:</label>'+contratos[i].origen+'</div><div class="listDestinoContrato"><label>Destino:</label>'+contratos[i].destino+'</div><div class="listPrecioContrato"><label>Precio:</label>'+contratos[i].precio+'</div><div class="listllaveContrato"><label>Contrato:</label>'+contratos[i].address+'</div><div class="listLlaveConductor"><label>Conductor:</label> '+contratos[i].seller+'</div><div class="divconfirmaServicioConductor"><button class="confirmaServicioConductor btn btn-primary">Confirma Servicio</button></div><div class="divcancelaServicioConductor"><button class="cancelaServicioConductor btn btn-secondary">Cancelar Servicio</button></div></li>';
  }
  $("#listaDeContratos2").empty().append(allItems);

  $("#listaDeContratos2").on("click", "li .confirmaServicioConductor", function(e){
      e.stopImmediatePropagation();
      var rowid = parseInt($(this).parents("li").data("rowid"));
      var contrato = $(this).parents("li").data("con").address;
      var abi = $(this).parents("li").data("con").abi;
      var buyer = $(this).parents("li").data("con").buyer;
      var seller = $(this).parents("li").data("con").seller;
      var precio = $(this).parents("li").data("con").precio;
      ContratoCumplido(contrato, abi, buyer, seller, precio);
      $("#listaDeContratos > li[data-rowid=" + rowid + "]").remove();
      RemoverContratoCliente(buyer, contrato);
      RemoverContratoConductor(seller, contrato);
      RefrescaListas();
  });

  $("#listaDeContratos2").on("click", "li .cancelaServicioConductor", function(e){
      e.stopImmediatePropagation();
      var rowid = parseInt($(this).parents("li").data("rowid"));
      var contrato = $(this).parents("li").data("con").address;
      var abi = $(this).parents("li").data("con").abi;
      var buyer = $(this).parents("li").data("con").buyer;
      var seller = $(this).parents("li").data("con").seller;
      var enviarConductor = $(this).parents("li").data("conduc").direccion;
      CancelaContratoCliente(contrato, abi, buyer, seller);
      $("#listaDeContratos2 > li[data-rowid=" + rowid + "]").remove();
      RemoverContratoConductor(enviarConductor, contrato);
      RemoverContratoCliente(buyer, contrato);
      RefrescaListas();
  });
}

//remover contrato del cliente
function RemoverContratoCliente(cliente, contrato){
  $.each(clientes, function() {
    if (this.direccion === cliente) {
          this.contratos = $.grep(this.contratos, function(value) {
              return value.address != contrato;
          });
      }
   });
}

//remover contrato del conductor
function RemoverContratoConductor(conductor, contrato){
  $.each(conductores, function() {
    if (this.direccion === conductor) {
          this.contratos = $.grep(this.contratos, function(value) {
              return value.address != contrato;
          });
      }
   });
}
//actualiza saldo del clientes
function ActualizaSaldoCliente()
{
  var cliente = $("#clientAddress").val();
  if(web3.isAddress(cliente)){
    var account1 = cliente;
    var balanceWei1 = web3.eth.getBalance(account1).toNumber();
    var balance1 = web3.fromWei(balanceWei1, 'ether');
    $("#hdClientSaldo").val(balance1);
    $("#lblClientSaldo").empty();
    $("#lblClientSaldo").text(balance1);
 }else{
   $("#hdClientSaldo").val(0);
   $("#lblClientSaldo").empty();
   $("#lblClientSaldo").text(0);
 }
}

//actualiza saldo del conductor
function ActualizaSaldoConductor()
{
  var conductor = $("#llaveConductor").val();
  if(web3.isAddress(conductor)){
    var account1 = conductor;
    var balanceWei1 = web3.eth.getBalance(account1).toNumber();
    var balance1 = web3.fromWei(balanceWei1, 'ether');
    $("#hdConductorSaldo").val(balance1);
    $("#lblConductorSaldo").empty();
    $("#lblConductorSaldo").text(balance1);
 }else{
   $("#hdConductorSaldo").val(0);
   $("#lblConductorSaldo").empty();
   $("#lblConductorSaldo").text(0);
 }

}

//refresca listas
function RefrescaListas(){
  var claveCliente = $("#clientAddress").val();
  var result = $.grep(clientes, function(e){ return e.direccion == claveCliente;});
  if(result.length > 0){
    $.each(result, function(){
         actualizaContratosCliente(this);
    });
  }else{
    $("#listaDeContratos").empty();
  }

  var claveConductor = $("#llaveConductor").val();
  var resultConductor = $.grep(conductores, function(e){ return e.direccion == claveConductor;});
  if(result.length > 0){
    $.each(resultConductor, function(){
         actualizaContratosConductor(this);
    });
  }else{
    $("#listaDeContratos2").empty();
  }
}

// Calcula distancia
function CalculaDistancia(){
  var fromName = $("#inputOrigen").val();
  var destName = $("#inputDestino").val();

  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
        origins: [fromName],
        destinations: [destName],
        travelMode: 'DRIVING'
      }, callback);

      function callback(response, status) {
        if (status == 'OK') {
          var origins = response.originAddresses;
          var destinations = response.destinationAddresses;

          for (var i = 0; i < origins.length; i++) {
            var results = response.rows[i].elements;
            console.log(results);
          for (var j = 0; j < results.length; j++) {
            if(results[j].status == 'OK'){
            //var from = origins[i];
            //var to = destinations[j];
              var element = results[j];
              var distance = element.distance.text;
              var duration = element.duration.text;
              var distSplit1= distance.split(" ");
              var distSplit2= distSplit1[0].split(",");
              var distanciaTotal = parseInt(distSplit2[0]);
              if(parseInt(distSplit2[1]) > 5){
                distanciaTotal++;
              }
              var cuota = distanciaTotal * 0.5;
              $("#confPrecio").val(cuota);
              $("#confDistancia").val(distance);
             }else{
                 alert("no se pudo obtener la ruta deseada");
             }
            }
          }
        }else{
            alert("no se pudo obtener la ruta deseada");
        }
      }
}

// confirmacion Cliente
function informacionConfirmacion(nombreConductor,direccionConductor){

    $("#confDireccionCliente").val($("#clientAddress").val());
    $("#confOrigen").val($("#inputOrigen").val());
    $("#confDestino").val($("#inputDestino").val());
    //$("#confPrecio").val();
    $("#confCondutor").val(nombreConductor);
    $("#confDireccionConductor").val(direccionConductor);
}

//valida conductor
function ValidaConductor(direccion,nombre){
  var val1 = false;
  var val2 = false;
  var msg = "";

  if(web3.isAddress(direccion)){
      val1 = true;
  }else{
      msg += "La cuenta del conductor es incorrecta.\n";
  }

  if(!esVacio(nombre)){
      val2 = true;
  }else{
      msg += "Debe introducir un nombre para el conductor\n";
  }
  if(val1 && val2){
    registraConductor(direccion,nombre);
    actualizaListaConductor();
  }else{
    alert(msg);
  }
}

//valida confirmacion
function ValidaConfirmacion(){
  var val1 = false;
  var val2 = false;
  var val3 = false;
  var val4 = false;
  var val5 = false;
  var val6 = false;
  var val7 = false;
  var msn = "";

  if(web3.isAddress($("#confDireccionCliente").val())){
      val1 = true;
  }else{
      msn += "La cuenta del cliente es incorrecta.\n";
  }

  if(web3.isAddress($("#confDireccionConductor").val())){
      val2 = true;
  }else{
      msn += "La cuenta del conductor es incorrecta.\n";
  }

  if(!esVacio($("#confOrigen").val())){
    val3= true;
  }else{
      msn += "No se especifico un origen valido.\n";
  }

  if(!esVacio($("#confDestino").val())){
    val4= true;
  }else{
      msn += "No se especifico un destino valido.\n";
  }

  if(!esVacio($("#confCondutor").val())){
    val5= true;
  }

  if(!esVacio($("#confPrecio").val())){
    val6= true;
  }else{
      msn += "No se especifico un precio valido.\n";
  }

  if(web3.isAddress($("#confDireccionCliente").val())){
    var account1 = $("#confDireccionCliente").val();
    var balanceWei1 = web3.eth.getBalance(account1).toNumber();
    var balance1 = web3.fromWei(balanceWei1, 'ether');

    var precio = parseFloat($("#confPrecio").val());
    if(balance1 > precio)
    {
      val7 = true;
    }else{
      msn += "No cuenta con saldo suficiente para la transaccion.\n";
    }
  }

  if(val1 && val2 && val3 && val4 && val5 && val6 && val7){
    CrearContrato();
    $(".divConfirmacionViaje").hide();
  }else{
    alert(msn);
  }
}

// funcion de validacion para campos vacios
function esVacio(campo){
  return campo === null || campo.match(/^ *$/) !== null;
}

// Crear contrato

function CrearContrato(){
  var direccionCliente = $("#confDireccionCliente").val();
  var direccionConductor = $("#confDireccionConductor").val();
  var nombreConductor = $("#confCondutor").val();
  var origen = $("#confOrigen").val();
  var destino = $("#confDestino").val();
  var precio = parseInt($("#confPrecio").val());

  registraCliente(direccionCliente, origen, destino, precio);

  //web3.eth.accounts[0]
  var pagotransporte_sol_pagotransporteContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"seller","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"abort","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"value","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"buyer","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"confirmReceived","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"confirmPurchase","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[],"name":"cancel","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":true,"type":"constructor"},{"anonymous":false,"inputs":[],"name":"aborted","type":"event"},{"anonymous":false,"inputs":[],"name":"canceled","type":"event"},{"anonymous":false,"inputs":[],"name":"purchaseConfirmed","type":"event"},{"anonymous":false,"inputs":[],"name":"itemReceived","type":"event"}]);
  var pagotransporte_sol_pagotransporte = pagotransporte_sol_pagotransporteContract.new(
     {
       from: direccionConductor,
       data: '0x60606040525b33600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b6107ab806100576000396000f3006060604052361561008c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806308551a531461008e57806335a063b4146100e05780633fa4f245146100f25780637150d8ae1461011857806373fac6f01461016a578063c19d93fb1461017c578063d6960697146101b0578063ea8a1af0146101ba575bfe5b341561009657fe5b61009e6101cc565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156100e857fe5b6100f06101f2565b005b34156100fa57fe5b610102610342565b6040518082815260200191505060405180910390f35b341561012057fe5b610128610348565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561017257fe5b61017a61036e565b005b341561018457fe5b61018c6104be565b6040518082600281111561019c57fe5b60ff16815260200191505060405180910390f35b6101b86104d1565b005b34156101c257fe5b6101ca6105a7565b005b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561024f5760006000fd5b600180600281111561025d57fe5b600260149054906101000a900460ff16600281111561027857fe5b1415156102855760006000fd5b7f80b62b7017bb13cf105e22749ee2a06a417ffba8c7f57b665057e0f3c2e925d960405180905060405180910390a16002600260146101000a81548160ff021916908360028111156102d357fe5b0217905550600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6000549081150290604051809050600060405180830381858888f19350505050151561033c57fe5b5b5b505b565b60005481565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156103cb5760006000fd5b60018060028111156103d957fe5b600260149054906101000a900460ff1660028111156103f457fe5b1415156104015760006000fd5b7f64ea507aa320f07ae13c28b5e9bf6b4833ab544315f5f2aa67308e21c252d47d60405180905060405180910390a16002600260146101000a81548160ff0219169083600281111561044f57fe5b0217905550600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6000549081150290604051809050600060405180830381858888f1935050505015156104b857fe5b5b5b505b565b600260149054906101000a900460ff1681565b60008060028111156104df57fe5b600260149054906101000a900460ff1660028111156104fa57fe5b1415156105075760006000fd5b7f764326667cab2f2f13cad5f7b7665c704653bd1acc250dcb7b422bce726896b460405180905060405180910390a13460008190555033600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506001600260146101000a81548160ff0219169083600281111561059d57fe5b02179055505b5b50565b60006000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156106085760006000fd5b600180600281111561061657fe5b600260149054906101000a900460ff16600281111561063157fe5b14151561063e5760006000fd5b7f3f9942ff55ce06295e226805d1111cbbb08008776fc013584c6750cf8428439760405180905060405180910390a16002600260146101000a81548160ff0219169083600281111561068c57fe5b0217905550600260005481151561069f57fe5b04925060026000548115156106b057fe5b049150600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc849081150290604051809050600060405180830381858888f19350505050151561071557fe5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc839081150290604051809050600060405180830381858888f19350505050151561077757fe5b5b5b505b50505600a165627a7a72305820c719b156563b0205dd1929e74b7237c443b59dfd82742cb6404aae8d0269f9cb0029',
       gas: '4700000'
     }, function (e, contract){
       var caddress = '';
       var cabi = '';
       if (typeof contract.address !== 'undefined' && typeof contract.abi !== 'undefined') {
            //console.log(contract.address);
            caddress = contract.address;
            //console.log(contract.abi);
            cabi=contract.abi;

            var contrato = {
              address : caddress,
              abi: cabi,
              seller: direccionConductor,
              buyer: direccionCliente,
              origen: origen,
              destino: destino,
              precio: precio,
            };

            //agrega contrato a la lista de contratos
            contratos.push(contrato);

            //regista el contrato en el objeto del conductor
            var tempConductor = '';
            $.each(conductores, function() {
              if (this.direccion === direccionConductor) {
                 this.contratos.push(contrato);
                 tempConductor = this;
                }
             });

             // registra el contrato en el cliente
             var tempcliente = '';
             $.each(clientes, function() {
               if (this.direccion === direccionCliente) {
                   this.contratos.push(contrato);
                   tempcliente = this;
                  }
              });

              ConfirmaCompra(contrato,direccionCliente,direccionConductor,precio);
              actualizaContratosCliente(tempcliente);
              actualizaContratosConductor(tempConductor);
              alert("Se a creado el contrato: "+caddress+"\nPara el usuario: "+direccionCliente);
       }
   })
}

//confirmar compra
function ConfirmaCompra(contrato, direccionCliente, direccionConductor, precio){
  var contract = web3.eth.contract(contrato.abi).at(contrato.address);
  contract.confirmPurchase.sendTransaction(
             {
                 from: direccionCliente,
                 value: web3.toWei(precio, 'ether')
             },
             function(e, result) {

               var account1 = direccionCliente;
               var balanceWei1 = web3.eth.getBalance(account1).toNumber();
               var balance1 = web3.fromWei(balanceWei1, 'ether');

               var account2 = direccionConductor;
               var balanceWei2 = web3.eth.getBalance(account2).toNumber();
               var balance2 = web3.fromWei(balanceWei2, 'ether');

               console.log(balance1);
               console.log(balance2);
               console.log(result);
               console.log(e);
               var transaccion = {
                   address: contrato.address,
                   buyer: direccionCliente,
                   seller: direccionConductor,
                   precio: precio,
                   estado: "Confirma Compra"
                 };
               transacciones.push(transaccion);

               ActualizaSaldoCliente();
               ActualizaSaldoConductor();
             }
         );
}

// Contrato cumplido
function ContratoCumplido(address, abi, buyer, seller, precio){
  var contract = web3.eth.contract(abi).at(address);
  contract.confirmReceived.sendTransaction(
    {
        from: buyer
    },
    function(e, result) {

      var account1 = buyer;
      var balanceWei1 = web3.eth.getBalance(account1).toNumber();
      var balance1 = web3.fromWei(balanceWei1, 'ether');

      var account2 = seller;
      var balanceWei2 = web3.eth.getBalance(account2).toNumber();
      var balance2 = web3.fromWei(balanceWei2, 'ether');

      console.log(balance1);
      console.log(balance2);
      console.log(result);
      console.log(e);
       var transaccion = {
           address: address,
           buyer: buyer,
           seller: seller,
           precio: precio,
           estado: "Contrato Cumplido"
         };
       transacciones.push(transaccion);

       ActualizaSaldoCliente();
       ActualizaSaldoConductor();
      alert("Se a completado el viaje del contrato: "+address);
    }
  );
}



//cancela contrato cliente
function CancelaContratoCliente(address, abi, buyer, seller){
  var contract = web3.eth.contract(abi).at(address);
  contract.cancel.sendTransaction(
    {
        from: buyer
    },
    function(e, result) {

      var account1 = buyer;
      var balanceWei1 = web3.eth.getBalance(account1).toNumber();
      var balance1 = web3.fromWei(balanceWei1, 'ether');

      var account2 = seller;
      var balanceWei2 = web3.eth.getBalance(account2).toNumber();
      var balance2 = web3.fromWei(balanceWei2, 'ether');

      console.log(balance1);
      console.log(balance2);
      console.log(result);
      console.log(e);
      var transaccion = {
          address: address,
          buyer: buyer,
          seller: seller,
          precio: 0,
          estado: "Compra Cancelada"
        };
      transacciones.push(transaccion);
      ActualizaSaldoCliente();
      ActualizaSaldoConductor();
      alert("A cancelado el viaje del contrato: "+address);
    }
  );
}

//cancela contrato conductor
function CancelaContratoConductor(address, abi, buyer, seller){
  var contract = web3.eth.contract(abi).at(address);
  contract.abort.sendTransaction(
    {
        from: seller
    },
    function(e, result) {

      var account1 = buyer;
      var balanceWei1 = web3.eth.getBalance(account1).toNumber();
      var balance1 = web3.fromWei(balanceWei1, 'ether');

      var account2 = seller;
      var balanceWei2 = web3.eth.getBalance(account2).toNumber();
      var balance2 = web3.fromWei(balanceWei2, 'ether');

      console.log(balance1);
      console.log(balance2);
      console.log(result);
      console.log(e);

      var transaccion = {
          address: address,
          buyer: buyer,
          seller: seller,
          precio: 0,
          estado: "Compra Abortada por vendedor"
        };
      transacciones.push(transaccion);
      ActualizaSaldoCliente();
      ActualizaSaldoConductor();
      alert("A cancelado el viaje del contrato: "+address);
    }
  );
}
