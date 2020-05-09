// capa base
var basemaps = {
   Grayscale: L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
   {
     maxZoom: 18,
     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
   }),

   Streets: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
   {
     maxZoom: 19,
     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
   })

 }

//var mymap = L.map('map').setView([ 3.9610648 , -76.5363028 ], 9);
// zoom del mapa
var mymap = L.map('map', {
    center: [3.43357, -76.52149],
    zoom: 12
});


//capas utilizadas para hacer consultas espaciales
 var wmsLayer1 = L.tileLayer.wms('http://localhost:8080/geoserver/vectores/wms?', {
   layers: 'vectores:barrios',
   attribution: 'barrios',
   format: 'image/png',
   transparent: true
 });

 var wmsLayer2 = L.tileLayer.wms('http://localhost:8080/geoserver/vectores/wms?', {
   layers: 'vectores:mallvcali',
   attribution: 'mallvcali',
   format: 'image/png',
   transparent: true
 });

 var wmsLayer3 = L.tileLayer.wms('http://localhost:8080/geoserver/vectores/wms?', {
   layers: 'vectores:manzanas-cali',
   attribution: 'manzanas-cali',
   format: 'image/png',
   transparent: true
 });

 var wmsLayer4 = L.tileLayer.wms('http://localhost:8080/geoserver/vectores/wms?', {
   layers: 'vectores:comunas',
   attribution: 'comunas',
   format: 'image/png',
   transparent: true
 });
 var wmsLayer5 = L.tileLayer.wms('http://localhost:8080/geoserver/vectores/wms?', {
   layers: 'vectores:dengue',
   attribution: 'dengue',
   format: 'image/png',
   transparent: true
 });

 var wmsLayer6 = L.tileLayer.wms('http://localhost:8080/geoserver/vectores/wms?', {
   layers: 'vectores:sumideros',
   attribution: 'sumideros',
   format: 'image/png',
   transparent: true




 });


 basemaps.Grayscale.addTo(mymap);
  wmsLayer1.addTo(mymap);
  wmsLayer2.addTo(mymap);
  wmsLayer3.addTo(mymap);
  wmsLayer4.addTo(mymap);
  wmsLayer5.addTo(mymap);
  wmsLayer6.addTo(mymap);




 var groupedOverlays = {
  "Capas municipales": {
     "barrios": wmsLayer1,
     "mallvcali": wmsLayer2,
     "manzanas-cali": wmsLayer3,
     "comunas": wmsLayer4,
     "dengue": wmsLayer5,
     "sumideros": wmsLayer6,
     }
 };

 L.control.groupedLayers(basemaps, groupedOverlays).addTo(mymap);

 var popup = L.popup();

// Captura de coordenadas, fecha y hora
 function onMapClick(e) {

   var lat =e.latlng.lat.toFixed(5);
   var lon =e.lonlng.lng.toFixed(5);

   var tabla = $("#input_tabla_insertar").val();
    // console.log(tabla);

   $('#formulariomodal').modal();

   $("#titulomodal").text("Formulario para ("+lat+","+lon+")");

   $("#input_lat").val(lat);
   $("#input_lat").prop('disabled', true);

   $("#input_lon").val(lon);
   $("#input_lon").prop('disabled', true);

   var now = new Date();
   var day = ("0" + now.getDate()).slice(-2);
   var month = ("0" + (now.getMonth() + 1)).slice(-2);
   var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
   $('#input_fecha').val(today);
 }

 $("#botonformulario").on("click",function(){
   mymap.once('click', onMapClick);
 })

// guarda las variables del formulario de agregar o
$("#enviarform").click(function(){


   var lat = $("#input_lat").val();
   var lon = $("#input_lon").val();
   var comuna = $("#input_comuna").val();
   var estado_del_sumidero = $("#input_estado_del_sumidero").val();
   var barrio = $("#input_barrio").val();
   var hora = $("#input_hora").val();
   var fecha = $("#input_fecha").val();
   var tipo_de_sumidero = $("#input_tipo_de_sumidero").val();
   var densidad = $("#input_desnsidad").val();
   var tipo_de_larvicida = $("#input_tipo_de_larvicida").val();
   var descripcion = $("#input_descripcion").val();
   // var desc = $("#input_desc").val();

  function getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      var base64 = reader.result;
      lecturadatos(base64);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  var file = document.getElementById('input_foto').files[0];

  if(file){
    getBase64(file);
  }else{
    lecturadatos('Sin Foto')
  }

  function lecturadatos(img){
    var datos = {
      lat :lat,
      lon :lon,
      comuna:comuna,
      estado_del_sumidero :estado_del_sumidero,
      barrio :barrio,
      hora :hora,
      fecha :fecha,
      tipo_de_sumidero :tipo_de_sumidero,
      densidad :densidad,
      tipo_de_larvicida :tipo_de_larvicida,
      descripcion :descripcion,
      // desc :desc,
      foto:img
    };

    console.log(img);

    $.ajax({
      url: "php/form_sumidero.php",
      type: "post",
      data: datos,
      success: function (response) {
        console.log(response);
        window.location.reload(true);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
    });
  }
})
