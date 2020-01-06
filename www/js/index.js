'use strict'

const toast = function (msg) {
    $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h3>" + msg + "</h3></div>")
        .css({
            display: "block",
            opacity: 0.95,
            position: "fixed",
            padding: "7px",
            "text-align": "center",
            width: "270px",
            left: ($(window).width() - 284) / 2,
            top: $(window).height() / 2,
            "-webkit-box-shadow": "5px 5px 5px 0px rgba(102,102,102,0.65)",
            "-moz-box-shadow": "5px 5px 5px 0px rgba(102,102,102,0.65)",
            "-ms-box-shadow": "5px 5px 5px 0px rgba(102,102,102,0.65)",
            "box-shadow": "5px 5px 5px 0px rgba(102,102,102,0.65)",
            "color": "whitesmoke"
        })

        .appendTo("body").delay(1500)
        .fadeOut(400, function () {
            $(this).remove();
        });
};

//*********************************************************************************************************

let bBtnLuz = false;
let bBtnFiltro = false;
let bBtnCalentador = false;
let bBtnAire = false;


const app = {


    _DEBUG_: true,
    deviceWidth: 0,
    deviceHeight: 0,
    idPop: 0,
    gaugeTemp: new Gauge({
        renderTo: 'gaugeTemp',
        //width: 250,
        //height: 250,
        glow: true,
        units: 'ºC',
        title: 'Temperatura',
        minValue: 0,
        maxValue: 60,
        valueFormat: { int: 2, dec: 1 },
        majorTicks: ['0', '10', '20', '30', '40', '50', '60'],
        minorTicks: 2,
        strokeTicks: false,
        highlights: [
            //{from: 0, to: 2, color: 'rgba(0,   255, 0, .15)'},
            { from: 0, to: 10, color: 'rgba(0, 0, 255, .15)' },
            { from: 10, to: 20, color: 'rgba(0, 0, 255, .25)' },
            { from: 20, to: 30, color: 'rgba(255, 0,225, .25)' },
            { from: 30, to: 40, color: 'rgba(255, 0,  0, .25)' },
            { from: 40, to: 50, color: 'rgba(255, 0,  0, .25)' },
            { from: 50, to: 60, color: 'rgba(255, 0,  0, .25)' }
        ],
        colors: {
            plate: '#222',
            majorTicks: '#f5f5f5',
            minorTicks: '#ddd',
            title: '#fff',
            units: '#ccc',
            numbers: '#eee',
            needle: { start: 'rgba(240, 128, 128, 1)', end: 'rgba(255, 160, 122, .9)' }
        }
    }),

    // Application Constructor
    initialize: () => {
        app.bindEvents();

        console.log("log:initialize");

    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {

        document.addEventListener('deviceready', this.onDeviceReady, false);
        $(document).on('pageshow', '#main', this.onPageShow);
        btnLuz.onclick = app.ControlReles;
        btnProgLuz.onclick = app.Programador;
        btnFiltro.onclick = app.ControlReles;
        btnProgFiltro.onclick = app.Programador;
        btnAire.onclick = app.ControlReles;
        btnProgAire.onclick = app.Programador;
        btnCalentador.onclick = app.ControlReles;
        btnAbout.onclick = app.about;
        popOK.onclick = app.enviaProg;
        btnStatus.onclick=app.estado;

        console.log("log:bindEvents" + localStorage.getItem('ReleLuz40'));
    },
    onPageShow: () => {
        app.deviceWidth = (window.orientation === 0) ? window.screen.width : window.screen.height;
        app.deviceHeight = (window.orientation === 90) ? window.screen.width : window.screen.height;
        console.log("Orientacion:" + window.orientation);
        console.log("PixelRatio: " + window.devicePixelRatio);
        console.log("Width: " + app.deviceWidth / window.devicePixelRatio);
        console.log("Heigth: " + app.deviceHeight / window.devicePixelRatio);

        app.gaugeTemp.draw();

        app.mideTemperatura();
        //
        setInterval(() => {
            app.mideTemperatura();
        }, 360000);

        console.log("log:onPageShow");
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: () => {

        toast("Iniciando...");
        // app.receivedEvent('deviceready');

        $(document).bind("resume", app.onResumedApp);
        console.log("onDeviceReady");
    },

    mideTemperatura: function () {

        $.get("http://192.168.1.220/temp", (data) => { app.gaugeTemp.setValue(data.temperatura) });

        console.log("Mide Temperatura");
    },



    ControlReles: function (e) {

        var id = $(this).attr('id');
        //navigator.notification.beep(1);

        //toast("Pulsado Rele "+id);

        switch (id) {

            case "btnLuz":

                bBtnLuz = !bBtnLuz;

                $.get(bBtnLuz ? "http://192.168.1.220/luzon" : "http://192.168.1.220/luzoff")

                    .done((data) => {
                        // function (data,status) {
                        toast("Pulsado Luz " + data.luz);
                        console.log(data);
                    })
                    .fail((error) => {
                        alert("Error: " + error.responseText);
                    });

                break;

            case "btnFiltro":

                bBtnFiltro = !bBtnFiltro;

                $.get(bBtnFiltro ? "http://192.168.1.220/filtroff" : "http://192.168.1.220/filtron")


                    .done((data) => {
                        // function (data,status) {
                        toast("Filtro " + data.filtro);
                        console.log(data);
                    })
                    .fail((error) => {
                        alert("Error: " + error.responseText);
                    });


                break;

            case "btnCalentador":

                bBtnCalentador = !bBtnCalentador;

                $.get(bBtnCalentador ? "http://192.168.1.220/calentadoroff" : "http://192.168.1.220/calentadoron")
                    .done((data) => {

                        toast("Calentador " + data.calentador);
                        console.log(data);
                    })
                    .fail((error) => {
                        alert("Error: " + error.responseText);
                    });

                break;

            case "btnAire":

                bBtnAire = !bBtnAire;

                $.get(bBtnAire ? "http://192.168.1.220/aireon" : "http://192.168.1.220/aireoff")

                    .done((data) => {

                        toast("Aire " + data.aireador);
                        console.log(data);
                    })
                    .fail((error) => {
                        alert("Error: " + error.responseText);
                    });

                break;

            default:
                break;
        }


        console.log("Pulsacion Reles");

    },

    Programador: function () {

        let id = $(this).attr('id');

        console.log("Pulsado: %s", id);

        switch (id) {

            case "btnProgLuz": $('#popupProg').popup('open');
                app.idPop = 1;

                console.log("popupProg btnProgLuz");
                break;
            case "btnProgFiltro":
                $('#popupProg').popup('open');
                app.idPop = 2;
                console.log("popupProg btnProgFiltro");
                break;
            case "btnProgAire":
                $('#popupProg').popup('open');
                app.idPop = 3;
                console.log("popupProg btnProgAire");
                break;


            default: break;
        }


    },

    enviaProg: () => {

        let horai, horaf;

        $('#popupProg').popup('close');

        horai = $('#iHoraOn').val();
        horaf = $('#iHoraOff').val();

        switch (app.idPop) {

            case 1:


                $.get("http://192.168.1.220/hora1luz?horai=" + horai + "&horaf=" + horaf)

                    .done((data) => {

                        toast("Hora luz " + data.hora_luz_1_on + "->" + data.hora_luz_1_off);
                        console.log(data);
                    })
                    .fail((error) => {
                        alert("Error: " + error.responseText);
                    });


                console.log("Luz Horai: %s,Horaf :%s", horai, horaf);
                break;

            case 2:
                $.get("http://192.168.1.220/horafiltro?horai=" + horai + "&horaf=" + horaf)

                    .done((data) => {

                        toast("Hora Filtro " + data.hora_filtro_on + "->" + data.hora_filtro_off);
                        console.log(data);
                    })
                    .fail((error) => {
                        alert("Error: " + error.responseText);
                    });


                console.log("Filtro Horai: %s,Horaf :%s", horai, horaf);
                break;

            case 3:
                $.get("http://192.168.1.220/horaire?horai=" + horai + "&horaf=" + horaf)

                    .done((data) => {

                        toast("Hora Aire " + data.hora_aire_on + "->" + data.hora_aire_off);
                        console.log(data);
                    })
                    .fail((error) => {
                        alert("Error: " + error.responseText);
                    });


                console.log("Aire Horai: %s,Horaf :%s", horai, horaf);
                break;

            default: break;
        }
    },

    estado:  () => {

        let aux="";

        $.get("http://192.168.1.220/status")


            .done( (data) => {

                $('#popupStatus').popup('open');

                aux="<tr><td>Temperatura:</td><td>"+data.temperatura+"</td></tr>";
                aux+="<tr><td>Hora:</td><td>"+data.hora+"</td></tr>";
                aux+="<tr><td>Hora Luz:</td><td>"+data.hora_luz_1_on+"->"+data.hora_luz_1_off+"</td></tr>";
                aux+="<tr><td>Hora Filtro:</td><td>"+data.hora_filtro_on+"->"+data.hora_filtro_off+"</td></tr>";
                aux+="<tr><td>Hora Aire:</td><td>"+data.hora_aire_on+"->"+data.hora_aire_off+"</td></tr>";  

                console.log(aux);

                $('#tblStatus').html(aux);

                console.log(data);
                
            })
            .fail( (error) => {
                alert("Error: " + error.responseText);
            });


    },

    about: () => {
        // $("#popupAbout").show();
        $('#popupAbout').popup('open');
        console.log("about");
        // $("#pRes").html("Resol. "+app.deviceHeight / window.devicePixelRatio + "x" + app.deviceWidth / window.devicePixelRatio);
    }
    ,
    Cerrar: function () {

        console.log("Cerrar");

        window.close();

    },
    onConfirmExit: function (buttonIndex) {
        if (buttonIndex === 1) {


            console.log("onConfirmExit");
        }
    }
    ,
    onResumedApp: function () {
        toast("Salida De Pausa de APP");
    }


};
