'use strict';

import radarSales from "./graphics/radarSales.js";

// componente de inicio
var Home = Vue.component('home-app', {

    // datos del componente
    data: function(){
        return {
            invoices: null,
            year: null,
            years: [],
            seller: "",
            seeDialogCategory: 1,
            clients_graphic: null,
            dialogGroupClients: false,
            colorDialog: "black",
            group_clients_sales: null,
            month: "Enero",
            months: [
                "Enero", "Febrero", "Marzo", 
                "Abril", "Mayo", "Junio", 
                "Julio", "Agosto", "Septiembre", 
                "Octubre", "Noviembre", "Diciembre"
            ]
        };
    },

    // antes de crear el componente
    created: function(){
        this.fetchInvoicesGraphics();
    },

    watch: {

        // evaluando el cambio de valor
        dialogGroupClients: function(value){
            console.log(value)
        },

        // cambio de año de busqueda
        year: function(year){
            this.fetchInvoicesGraphics();
        },

        // funcion que se encarga de 
        // enviar datos del mes
        month: function(){
            this.fetchClientsGraphics();
        },

    },

    methods: {

        // funcion que agregar un vendedor a la lista de busqueda de vendedores
        addSeller: function(seller){
            this.seeDialogCategory = 2;
            this.seller = seller.seller_id;
        },

        // funcion que devuelve los graficos
        fetchInvoicesGraphics: function(){
            this.invoices = null;

            // obteniendo datos para los graficos
            fetch(`./controllers/Graphics.php?call=index&year=${this.year ? this.year : ""}`).then((response)=>{
                return response.json();
            }).then((invoices)=>{
                this.invoices = invoices;
                this.year = invoices.year;
                this.years = invoices.years.map((year)=>{ return parseInt(year.text); });
                this.fetchClientsGraphics();
            });
        },

        // este fetch evalua el cliente mostrar
        fetchClientsGraphics: function(){
            this.clients_graphic = null;
            let mount = (this.months.indexOf( this.month ) + 1);
            fetch(`./controllers/Graphics.php?call=clients&year=${this.year ? this.year : ""}&month=${mount}`).then((response)=>{
                return response.json();
            }).then((clients) => {
                this.clients_graphic = clients;
            });
        },

        // funcion que se encarga de
        // devolver el mes en español
        getMountSpanish: function(mount){
            let mounts = {
                January: "Enero",
                February: "Febrero",
                March: "Marzo",
                April: "Abril",
                May: "Mayo",
                June: "Junio",
                July: "Julio",
                August: "Agosto",
                September: "Septiembre",
                October: "Octubre",
                November: "Noviembre",
                December: "Diciembre"
            };

            return mounts[mount];
        },

        // funcion que devuelve las
        getDataGraphicsInvoices: function(){
            
            if( !Array.isArray(this.invoices.routes)  )
                return false;

            let routes = this.invoices.routes;
            let colors = [];
            let color = getColorRandom();
            let labels = [];
            let datasets = [];
            let routes_zone = [];
            let months = [];
            let code_zone = [];
            let temp = null;

            // agregando los meses a mostrar
            routes.forEach((invoice) => {

                // evitamos repetir un color de forma aleatoria
                while( colors.indexOf( color ) != (-1)  )
                    color = getColorRandom();

                colors[ colors.length ] = color;

                if( routes_zone.indexOf( invoice.route_name ) === (-1) )
                    routes_zone[  routes_zone.length ] = invoice.route_name;

                if( labels.indexOf( this.getMountSpanish(invoice.month) ) === (-1) )
                    labels[ labels.length  ] = this.getMountSpanish(invoice.month);
            });

            routes_zone.forEach(( zone, key )=>{

                months = [];

                // organizando datos de mes
                labels.forEach((label, index) => {
                    for(var i = 0; i < routes.length; i++){

                        if( routes[i].route_name == zone && this.getMountSpanish( routes[i].month ) == label )
                            months[index] = parseInt(routes[i].total_units);
                    }
                });

                // datos a evaluar
                temp = zone.split(" ");
                code_zone = "";

                if( temp.length == 1 )
                    code_zone = temp[0].slice(0, 4);
                else {
                    for(var i = 0; i < temp.length; i++)
                        code_zone = `${code_zone}${temp[i].slice(0, parseInt( 4 / temp.length ) )}`;
                }

                // insertando la relacion de datos
                datasets[ datasets.length ] = {
                    label: code_zone,
                    stack: `Stack ${key}`,
                    type:  (labels.length > 2 ? 'line' : 'bar'),
                    fill:  false,
                    backgroundColor: colors[key],
                    data: months
                };
            });

            return {
                labels: labels,
                datasets: datasets
            };
        },

        // funcion que devuelve los graficos
        // las opcionde una factura
        getOptionsGraphicsInvoices: function(){
            return {
                scales: {
                    yAxes: [{ stacked: true }],
                    xAxes: [{ stacked: true, categoryPercentage: 0.5, barPercentage: 1 }]
                },
                legend: {display: true},
                responsive: true,
                maintainAspectRatio: false
            };
        },

        // funcion que devuelve en formato numerico la
        // cantidad
        getFormatNumeric: function(number){
            return window.formatMoney( number );
        },

        getLastDays: function(){
            let labels = [];
            let datasets = [{type: "line", fill: false, label: "Ventas", backgroundColor: getColorRandom(), data: [] }];
            let days = [];
            this.invoices.last_days.forEach((day, key) => {labels[ labels.length ] = day.day; days.push( day.total ); });
            datasets[0].data = days;

            return {
                labels: labels,
                datasets: datasets
            };
        },

        getOptionsLastDays: function(){
            return {};
        },

        getOptionsClients: function(){
            return {
                responsive: true,
                legend: {
                    position: 'top',
                    align: 'center'
                },
                title: { display: true, text: 'Rango de unidades compradas'},
                animation: { animateScale: true, animateRotate: true },
                onClick: (event, ctx)=>{
                    if( ctx[0] != null ){
                        console.log( ctx[0] );
                        this.group_clients_sales = ctx[0]._view.label;
                        this.colorDialog = ctx[0]._view.backgroundColor;
                        this.dialogGroupClients = true;
                    }
                }
            };
        },

        // funcion que cierra el dialogo
        closeDialogGroup: function(){
            this.seeDialogCategory = 1;
            this.group_clients_sales = null;
            this.dialogGroupClients = false;
        },

        // obteniendo los clientes
        getDataClients: function(){

            let datasets = [{ 
                data: [],
                backgroundColor: []
            }];

            let labels = [];
            let colors = [];
            let color = getColorRandom();
            let text = "";

            // datos para la graficas de clientes
            this.clients_graphic.forEach((client, key) => {

                // evitamos que se repitan las colores a mostrar
                while( colors.indexOf( color ) != (-1) )
                    color = getColorRandom();

                if( labels.indexOf(client.ndx1) == (-1) ){

                    labels.push( client.ndx1 );
                    datasets[0].data.push( parseInt(client.customers) );
                    datasets[0].backgroundColor.push( color );
                    colors.push( color );
                }
                else {
                    let index = labels.indexOf(client.ndx1);
                    datasets[0].data[index] += parseInt(client.customers);
                }
            });

            return {
                datasets: datasets,
                labels: labels
            };
        }
    },



    template: `
        <div>
            <template-basic :disableNew = "true">

                <template slot = "dialog-template-basic">
                    <dialog-full-screen :color = "colorDialog" :active = "dialogGroupClients" :hide = "closeDialogGroup">
                        
                        <template slot = "dialog-title">
                            <h4>Clientes Grupo {{ group_clients_sales }}</h4>
                        </template>
                        
                        <template slot = "dialog-content" v-if = "group_clients_sales">

                            <v-container>

                                <v-expand-transition>
                                    <v-container  v-show = "seeDialogCategory == 1">

                                        <div style = "color: #666; text-align: center; width: 100%; font-size: 18px; margin-bottom: 10px;">
                                            <strong>Televentas</strong>
                                        </div>

                                        <gridbox-app
									        :url = " './controllers/Graphics.php?call=telemarketing_group_clients&group=' + group_clients_sales + '&year=' + year +'&month='+ (months.indexOf( month ) + 1) "
                                            headJson = "./application/headers/group_clients_sales/telemarketing.json"
                                            :buttonsDisable = "['edit','delete']"
                                            :show = "addSeller"  
                                        >
                                            <template slot = "details-data" slot-scope = "slotProps">
                                                <radar-sales-graphics
                                                    :seller = "slotProps.item.seller_id"
                                                    :year = "year"
                                                    :group = " group_clients_sales"
                                                    :month = "(months.indexOf( month ) + 1)"
                                                />
                                            </template>

							    	    </gridbox-app>
                                    </v-container>
                                </v-expand-transition>

                                <v-expand-transition>
                                    <v-container  v-show = "seeDialogCategory == 2">
                                    
                                        <gridbox-app
                                            v-if = "seeDialogCategory == 2"
                                            :url = " './controllers/Graphics.php?call=group_clients_sales&seller='+ seller +'&group=' + group_clients_sales + '&year=' + year +'&month='+ (months.indexOf( month ) + 1) "
                                            headJson = "./application/headers/group_clients_sales/clients.json"
                                            :buttonsDisable = "['show','edit','delete']"
                                        >

                                            <template slot = "details-data" slot-scope = "slotProps">
                                                <radar-sales-graphics
                                                    :customer = "slotProps.item.customer_id"
                                                    :year = "year"
                                                    :group = " group_clients_sales"
                                                    :month = "(months.indexOf( month ) + 1)"
                                                />
                                            </template>

                                        </gridbox-app>
                                        
                                    </v-container>
                                </v-expand-transition>


                            </v-container>


                            <v-bottom-navigation fixed :value = "true" :color = "colorDialog">
                                <v-btn v-on:click = "seeDialogCategory = 1">
                                    <span>Televentas</span>
                                    <v-icon>mdi-history</v-icon>
                                </v-btn>
                                <v-btn v-on:click = "seeDialogCategory = 2">
                                    <span>Clientes</span>
                                    <v-icon>mdi-content-save</v-icon>
                                </v-btn>
                            </v-bottom-navigation>

                        </template>

                    </dialog-full-screen>
                </template> 

            	<template slot = "content-template-basic">

                    <div v-if = "invoices">

                        <v-container>
                            <v-row color = "white" style = "padding: 10px; border: 1px solid #ddd;backgroundColor: #fff;borderRadius: 10px;">
                                <v-col class = "text-center" cols = "12">
                                    <v-select
                                        v-model = "year"
                                        :items = "invoices.years"
                                        append-outer-icon = "mdi-calendar"
                                        menu-props = "auto"
                                        hide-details
                                        label = "Año"
                                        single-line
                                    >
                                    </v-select>
                                </v-col>

                                <v-col cols  = "4" class = "text-center">
                                    <strong>Pedidos</strong>
                                    <span>{{ getFormatNumeric(invoices.saleorder.total) }}</span>
                                </v-col>

                                <v-col cols  = "4" class = "text-center">
                                    <strong>Facturas</strong>
                                    <span>{{ getFormatNumeric(invoices.invoices.total) }}</span>
                                </v-col>

                                <v-col cols = "4" class = "text-center">
                                    <strong></strong>
                                </v-col>

                            </v-row>
                        </v-container>

                        <v-container>
                            <v-row>
                                <v-col class = "text-center" cols = "12">
                                    <h4>Ventas por Regiones</h4>
                                </v-col> 
                            </v-row>
                            <graphics-bar v-if = "invoices" :chartdata = "getDataGraphicsInvoices()" :setOptions = "getOptionsGraphicsInvoices()" >
                            </graphics-bar>
                        </v-container>

                        <v-container>
                            <v-row>
                                <v-col cols = "12" class = "text-center">
                                    <h4>Ventas de los ultimos 15 días</h4>
                                </v-col>
                                <v-col cols = "12" class = "text-center">
                                    <graphics-bar :chartdata = "getLastDays()" :setOptions = "getOptionsLastDays()">
                                    </graphics-bar>
                                </v-col>
                            </v-row>
                        </v-container>

                        <v-container>
                            <v-row>
                                <v-col cols = "12" class = "text-center">
                                    <h4>Clasificacion de clientes por compras</h4>
                                </v-col>
                                <v-col cols = "12" class = "text-center">
                                    <graphics-doughnut v-if = "clients_graphic" :chartdata = "getDataClients()" :setOptions = "getOptionsClients()">
                                    </graphics-doughnut>
                                </v-col>
                                <v-col cols = "12" class = "text-center">
                                    <v-select
                                        v-model = "month"
                                        :items = "months"
                                        append-outer-icon = "mdi-calendar"
                                        menu-props = "auto"
                                        hide-details
                                        label = "Mes"
                                        single-line
                                    >
                                    </v-select>
                                </v-col>
                            </v-row>
                        </v-container>

                    </div>
            	
                </template>
            </template-basic>
        </div>
    `
});

export default Home;