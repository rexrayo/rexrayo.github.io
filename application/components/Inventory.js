'use strict';

import radarProducts from "./graphics/radarInventoryProduct.js";

// componente que se encarga del iventario
let inventory = Vue.component('inverory-app',{

    data: function(){
        return {
            loading: false,
            groupSelect: null,
            groups: [],
            year: "",
            years: [],
            month: "",
            months: [
                "Enero", "Febrero", "Marzo", 
                "Abril", "Mayo", "Junio", 
                "Julio", "Agosto", "Septiembre", 
                "Octubre", "Noviembre", "Diciembre"
            ]
        };
    },

    // despues de ser creado el componente
    created: function(){
        this.fetchDataGraph();
    },

    watch: {
        year: function(){
            this.fetchDataGraph();
        },

        month: function(){
            this.fetchDataGraph();
        },

        groupSelect: function(value = null){
            if( value )
                this.dialogGroup = true;
        }

    },

    // metodos del componente
    methods: {

        fetchDataGraph: function(){

            this.loading = true;
            this.groups = [];

            // llamada al servidor para obtener los datos
            fetch(`./controllers/Inventory.php?call=group_sales&year=${this.year}&month=${ (this.months.indexOf(this.month) + 1) }`).then((response)=>{
                return response.json();
            }).then((data)=>{
                let years = [];
                
                data.years.forEach(year => {  years.push( year.year ) });
                this.loading = false;
                this.years = years;
                this.month = this.months[  data.month - 1 ];
                this.year = data.year;
                this.groups = data.result;
            });
        },
        
        // funcion que devuelve los graficos
        // las opcionde una factura
        getOptionsGraphics: function(){
            return {
				responsive: true,
				legend: { position: 'top', },
				title: {display: true, text: 'Grupos de Venta'},
                animation: { animateScale: true, animateRotate: true },
                onClick: (event, ctx)=>{
                    let _model = 0;
                    if( ctx[0] != null )
                        this.groupSelect = ctx[0]._model.label;
                }
			};
        },

        // datos relacionados
        getDataGraphics: function(){

            let labels = [];
            let color = window.getColorRandom();
            let datasets = [{ backgroundColor: [], data: []}];

            this.groups.forEach((group)=>{
                while(  datasets[0].backgroundColor.indexOf( color ) != (-1)  )
                    color = window.getColorRandom();
                
                datasets[0].backgroundColor.push( color );
                datasets[0].data.push( group.products );
                labels.push( group.ndx1 ); 
            });


            return  {labels, datasets};
        },

        closeDialog: function(){
            this.groupSelect = null;
        }
    },
    

    template: `
        <template-basic :disableNew = "true">
        
            <template slot = "dialog-template-basic">
                <dialog-full-screen :active = "groupSelect" color = "purple" :hide = "closeDialog">
                    
                    <template slot = "dialog-title">
                        <h3>Ventas de  {{ groupSelect }}</h3>
                    </template>
                    
                    <template slot = "dialog-content" v-if = "groupSelect">
                    
                        <v-container>
                            <gridbox-app
                                :url = " './controllers/Inventory.php?call=products&group='+ groupSelect +'&year=' + year + '&month=' + (months.indexOf(month) + 1)"
                                headJson = "./application/headers/inventory/products.json"
                                :buttonsDisable = "['edit', 'delete', 'show']" 
                            >
                                <template slot = "details-data" slot-scope = "slotProps">
                                    <radar-inventory-product-graphics
                                        :product = "slotProps.item.product_id"
                                        :year = "year"
                                        :month = "(months.indexOf( month ) + 1)"
                                    />
                                </template>
                            </gridbox-app>

                        </v-container>


                    </template>

                </dialog-full-screen>
            </template>

            <template slot = "content-template-basic">

                <v-container>
                    <v-row color = "white" style = "padding: 10px; border: 1px solid #ddd;backgroundColor: #fff;borderRadius: 10px;">
                        <v-col class = "text-center" cols = "6">
                            <v-select
                                v-model = "year"
                                :items = "years"
                                append-outer-icon = "mdi-calendar"
                                menu-props = "auto"
                                hide-details
                                label = "Año"
                                single-line
                            >
                            </v-select>
                        </v-col>

                        <v-col class = "text-center" cols = "6">
                            <v-select
                                v-model = "month"
                                :items = "months"
                                append-outer-icon = "mdi-calendar"
                                menu-props = "auto"
                                hide-details
                                label = "Año"
                                single-line
                            >
                            </v-select>
                        </v-col>

                        <v-col class = "text-center" cols = "12">

                            <div v-if = "loading == true">
                                <progress-loading>
                                </progress-loading>
                            </div>

                            <div v-else>
                                <div v-if = "groups.length > 0">
                                    <graphics-doughnut :chartdata = "getDataGraphics()" :setOptions = "getOptionsGraphics()">
                                    </graphics-doughnut>
                                </div>
                                <div v-else>
                                    <h4 style = "color: #666;">Sin Datos.</h4>
                                </div>
                            </div>
                            
                        </v-col>

                    </v-row>
                </v-container>

                <gridbox-app
                    v-if = "!loading"
                    :url = " './controllers/Inventory.php?call=products&year=' + year + '&month=' + (months.indexOf(month) + 1)"
                    headJson = "./application/headers/inventory/products.json"
                    :buttonsDisable = "['edit', 'delete', 'show']" 
                >
                    <template slot = "details-data" slot-scope = "slotProps">
                        <radar-inventory-product-graphics
                            :product = "slotProps.item.product_id"
                            :year = "year"
                            :month = "(months.indexOf( month ) + 1)"
                        />
                    </template>
                </gridbox-app>
            
            </template>

        </template-basic>
    `
});

export default inventory;