'use strict';

import columnData from "./GridBoxData.js";

var GridBox = Vue.component('gridbox-app',{

    props: ["data", "url", "headJson" ,"show", "edit", "delete", "buttons", "buttonsDisable"],

    // datos del componente
    data: function(){
        return {resources: [], headers: null, loading: false, page: 1, search: ""};
    },

    created: function(){

        // obtiene la cabezera para 
        // desplegar informacion
        this.getHeaders();

        // obteniendo datos
        this.getData();
    },

    methods: {

        // recarga para hacer una busqueda desde el inicial 
        // de la solucion del problema
        reload: function(){
            this.page  = 1;
            this.getData();
        },

        // llamada de algun metodo determinado
        callback: function(name){
            return typeof this[name] == "function" ? this[name] : null;
        },

        // funcion que se encarga de evaluar 
        // y obtener los datos relacionados 
        getData: function(){
            
            if( this.data != null )
                this.resources = this.data;
            else{
                // obteniendo datos desde el url indicado
                if( this.url != null ){
                    this.resources = [];
                    this.loading = true;
                    fetch(`${this.url}&page=${this.page - 1}&q=${this.search}`).then((response)=>{
                        return response.json();
                    }).then((resources) => {
                        this.loading  = false;
                        this.resources = resources;
                    });
                }
            }
        },

        // obtiene los datos de la cabezera a mostras
        getHeaders: function(){
            let headers = this.headJson;
            switch( typeof headers ){
                case "object": this.headers = headers; break;
                default:
                    fetch(headers).then((response)=>{
                        return response.json();
                    }).then((data)=> {
                        this.headers = data;
                    });
                break;
            }
        }
    },

    watch: {

        // evaluando los cambios de una variable 
        // en tiempo de ejecucion
        search: function(){
            if(window.activeSearch != null)
                window.clearInterval( window.activeSearch );
            window.activeSearch = window.setTimeout(()=>{
                this.page = 1;
                this.getData();
            }, 1000);
        },

        // evaluando cualquier cambio de pagina
        // para la busqueda y ausmicion de datos
        page: function(){
            this.getData();
        }
    },


    template: `
        <div class = "gridbox" style = "margin-bottom: 80px;">

            <v-row>
                <v-col cols = "12">
                    <v-text-field v-model = "search" append-icon = "mdi-magnify" style = "margin: 0px; padding: 0px;"  label="Buscar" outlined>
                    </v-text-field>
                </v-col>
                <v-col cols = "12" class = "text-right" style = "margin-top: -35px;">
                    <span>Pagina {{ page }}</span>
                    <v-btn icon color = "green" v-on:click = "reload">
                        <v-icon>mdi-reload</v-icon>
                    </v-btn>
                </v-col>
            </v-row>


            
            <v-row v-if = "(resources != null ? (resources.length == 0) : true) || headers == null " justify="center" align="center" dense>
                
                <v-col cols = "12">

                    <div v-if = "loading" class="text-center ma-12">
                        <progress-loading>
                        </progress-loading>
                    </div>

                    <div v-else>
                        <h4 class= "text-center" style = "color: #555;" >
                            <v-icon>mdi-magnify</v-icon>
                            <span>No hay resultados.</span>
                        </h4>
                    </div>
                </v-col>

            </v-row>

            <v-row v-else dense>
                <gridbox-data-row
                    v-if = " headers "
                    :head = "headers" 
                    :buttons = "buttons" 
                    :buttonsDisable = "buttonsDisable"
                    v-for = "item in resources" 
                    :item = "item"
                    :key = "item.id"
                    :delete = "callback('delete')"
                    :edit = "callback('edit')"
                    :show = "callback('show')"
                >
                    <template slot= "details-data">
                        <slot name = "details-data" v-bind:item = "item">
                        </slot>
                    </template>
                </gridbox-data-row>
            </v-row>

            <v-row v-if = "!loading">
                <v-col v-if = "page > 1">
                    <v-btn color = "purple" v-on:click = "page = page - 1">
                        <v-icon color = "white">mdi-arrow-left</v-icon>
                        <span style = "color: white;">Atras</span>
                    </v-btn>
                </v-col>
                <v-col  class = "text-right text-white">
                    <v-btn color = "purple" v-on:click = "page = page + 1" v-if = "resources.length >= 20">
                        <span style = "color: white;">Siguente</span>
                        <v-icon color = "white">mdi-arrow-right</v-icon>
                    </v-btn>
                </v-col>
            </v-row>

        </div>
    `
});

export default GridBox;