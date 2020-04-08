'use strict';

// importando los tiempos de productos
import productTypes from "./graphics_marketing/productTypes.js";

var app = Vue.component('telemarketing-app',{
    
    data: function(){
        return {
            years: [ (new Date).getFullYear() ],
            months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Ocutbre","Noviembre", "Diciembre"],
            monthSelect: "Enero",
            groupSee: false,
            groups: [],
            sellers: {start: 0, end: 2000},
            loading: false,
            yearSelect: (new Date).getFullYear(),
            changeYear: false
        };
    },

    // funcion al crear el complemento
    created: function(){
        this.fetchGrapchics();
    },

    methods: {

        fetchGrapchics: function(){
            this.loading  = true;
            let years = [];
            let month = this.months.indexOf( this.monthSelect ) + 1;
            fetch(`./controllers/Graphics.php?call=telemarketing_radar&year=${this.yearSelect}&month=${month}`).then((response)=>{
                return response.json();
            }).then((data) => {
                this.loading = false;
                data.years.forEach((year)=>{ years.push( year.year ); });
                this.years = years;
                this.groups = data.groups;
            });
        },

        getOptionsGroups: function(){
            return {
				responsive: true,
				legend: { position: 'top', },
				title: {display: true, text: 'Grupos de Vendedores'},
                animation: { animateScale: true, animateRotate: true },
                onClick: (event, ctx)=>{
                    let _model = 0;
                    if( ctx[0] != null ){
                        _model = ctx[0]._model.label;
                        this.showDialog( _model.split('-')[0], _model.split('-')[1] );
                    }
                }
			};
        },

        //muestra el dialogo cuando el devido
        showDialog: function(start, end){
            this.groupSee = true;
            this.sellers = {start, end};
        },

        getDataGroups: function(){
            let labels = [];
            let datasets = [{data: [], backgroundColor: []}];
            let color = window.getColorRandom();

            this.groups.forEach((group)=>{
                while(  datasets[0].backgroundColor.indexOf( color ) != (-1)  )
                    color = window.getColorRandom();

                datasets[0].data.push( group.count_seller );
                datasets[0].backgroundColor.push( color );
                labels.push( group.group_seller );
            });
            return {labels, datasets};
        },

        closeDialog: function(){
            this.groupSee = false;
        }

    },
    
    watch: {
        
        monthSelect: function(){
            this.fetchGrapchics();
        },

        yearSelect: function(){
            this.fetchGrapchics();
            this.changeYear = true;
            window.setTimeout(() => {
                this.changeYear = false
            }, 200);
        },
    },

    template: `
        <template-basic :disableNew = "true">


            <template slot = "dialog-template-basic">
                <dialog-full-screen :active = "groupSee" color = "purple" :hide = "closeDialog">
                    
                    <template slot = "dialog-title">
                        <h3>Ventas de  {{ sellers.start }} - {{ sellers.end }}</h3>
                    </template>

                    <template slot = "dialog-content">
                        <v-container>
                            <gridbox-app 
                                v-if = "groupSee" 
                                headJson = "./application/headers/telemarketing_search.json"
                                :url = " './controllers/Telemarketing.php?call=groupSeller&month='+ (months.indexOf( monthSelect ) + 1) +'&year='+ yearSelect +'&start='+ sellers.start +'&end=' + sellers.end"
                            >
                                
                                <template slot = "details-data" slot-scope = "slotProps">
                                    <v-container>
                                        <v-row>
                                            <v-col cols = "6">
                                                <strong>Unidades: </strong>
                                                <span>{{ slotProps.item.product_quantity }}</span>
                                            </v-col>
                                            <v-col cols = "6">
                                                <strong>Mes: </strong>
                                                <span>{{ months[ slotProps.item.month - 1] }}</span>
                                            </v-col>
                                            <v-col cols = "12">
                                                <product-types-graphics v-if = "!changeYear" :year = "yearSelect" :seller = "slotProps.item.seller_id">
                                                </product-types-graphics>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </template>
            
                            </gridbox-app>
                        </v-container>
                    </template>

                </dialog-full-screen>
            </template>

            <template slot = "content-template-basic">

                <v-container style = "background: #fff; border: 1px solid #ddd; border-radius: 5px; padding: 5px;">
                    <v-row>
                        
                        <v-col class = "text-center" cols = "6">
                            <v-select
                                v-model = "yearSelect"
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
                                v-model = "monthSelect"
                                :items = "months"
                                append-outer-icon = "mdi-calendar"
                                menu-props = "auto"
                                hide-details
                                label = "Mes"
                                single-line
                            >
                            </v-select>
                        </v-col>
                        
                        <v-col cols = "12" v-if = "!loading">
                            <graphics-doughnut 
                                v-if = "groups.length > 0"
                                :chartdata = "getDataGroups()" 
                                :setOptions = "getOptionsGroups()"
                            >
                            </graphics-doughnut>
                            
                            <div class = "text-center" v-else style = "margin-top: 30px;">
                                <h3 style = "color: #666;">Sin Datos.</h3>
                            </div>
                        </v-col>
                        <v-col cols = "12" v-else>
                            <progress-loading>
                            </progress-loading>
                        </v-col>

                    </v-row>
                </v-container>

                <gridbox-app headJson = "./application/headers/telemarketing.json" url = "./controllers/Telemarketing.php?call=index">
                    
                    <template slot = "details-data" slot-scope = "slotProps">
                        <product-types-graphics v-if = "!changeYear" :year = "yearSelect" :seller = "slotProps.item.id">
                        </product-types-graphics>
                    </template>
                
                </gridbox-app>


            </template>
        </template-basic>
    `
});

export default app;