'use strict';

// importando el radar a usar
import routesRadar from "./graphics_routes/routes-radar.js";

var RoutesApp = Vue.component('routes-app',{
    
    data: function(){
        return {
            years: [ (new Date).getFullYear() ],
            months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Ocutbre","Noviembre", "Diciembre"],
            monthSelect: null,
            groupSee: false,
            groups: [],
            routes: {start: 0, end: 2000},
            loading: false,
            yearSelect: (new Date).getFullYear(),
            changeYear: false
        };
    },


    // al ser creado el componentes
    created: function(){
        this.fetchGroups();
    },


    methods: {

        // llamanda para obtener los grupos
        fetchGroups: function(){
            
            // datos de la llamada
            let years = [];
            let year = this.yearSelect == null ? "" : this.yearSelect; 
            console.log(  this.monthSelect );
            let month = this.monthSelect == null ? "" : this.months.indexOf( this.monthSelect ) + 1 ;
            this.groups = []; 
            this.loading  = true;

            // funcion que hace una llamada al servidor 
            fetch(`./controllers/Graphics.php?call=routes&year=${year}&month=${month}`).then((response)=>{
                return response.json();
            }).then((data) => {
                data.years.forEach((year)=>{ years.push( parseInt(year.text) ); });
                this.years = years;
                this.groups = data.routes;
                this.loading  = false;
                this.monthSelect = this.months[parseInt( data.month ) - 1];
            });
        },

        // funcion que da las opciones 
        getOptionsGroups: function(){
            return {
				responsive: true,
				legend: { position: 'top', },
				title: {display: true, text: 'Grupos de Rutas'},
                animation: { animateScale: true, animateRotate: true },
                onClick: (event, ctx)=>{
                    let _model = 0;
                    let _resource = [];
                    if( ctx[0] != null ){
                        _model = ctx[0]._model.label;
                        _resource = _model.split('-');
                        
                        if( _resource.length == 2 )
                            this.showDialog( parseInt(_resource[0]), parseInt(_resource[1]) );
                        else {
                            _resource = _resource[0].split(">").length == 2 ? [ _resource[0].split(">")[1] , "" ] : ["", 0];
                            this.showDialog( _resource[0], _resource[1] );
                        }
                    }
                }
			};
        },

        // datos de los grupos para hacer el
        getDataGroups: function(){
            let labels = [];
            let datasets = [{data: [], backgroundColor: []}];
            let color = window.getColorRandom();

            this.groups.forEach((group)=>{

                while(  datasets[0].backgroundColor.indexOf( color ) != (-1)  )
                    color = window.getColorRandom();

                datasets[0].data.push( group.total_route );
                datasets[0].backgroundColor.push( color );
                labels.push( group.group_route );
            });
            return {labels, datasets};
        },

        //muestra el dialogo cuando el devido
        showDialog: function(start, end){
            this.groupSee = true;
            this.routes = {start, end};
        },

        // cerrando el modal
        closeDialog: function(){
            this.groupSee = false;
        }

    },

        
    watch: {
        
        monthSelect: function(){
            this.fetchGroups();
        },

        yearSelect: function(){
            this.fetchGroups();
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
                        <h3>Ventas de  {{ routes.start }} - {{ routes.end }}</h3>
                    </template>

                    <template slot = "dialog-content">
                        <v-container>
                            <gridbox-app 
                                v-if = "groupSee"
                                :url = " './controllers/Routes.php?call=group_routes&year='+ yearSelect +'&month='+ (months.indexOf( monthSelect ) + 1)  +'&start='+ routes.start +'&end=' + routes.end"
                                headJson = "./application/headers/routes.json"
                            >
                                <template slot = "details-data" slot-scope = "slotProps">
                                    
                                    <v-container>
                                        <v-row>
                                            
                                            <v-col cols = "6">
                                                <strong>Unidades: </strong>
                                                <span>{{ slotProps.item.invoice_units }}</span>
                                            </v-col>

                                            <v-col cols = "6">
                                                <strong>Mes: </strong>
                                                <span>{{ months[ slotProps.item.month - 1] }}</span>
                                            </v-col>

                                            <v-col cols = "12">
                                                <routes-radar-graphics v-if = "!changeYear" :year = "yearSelect" :router = "slotProps.item.id">
                                                </routes-radar-graphics>
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


                <gridbox-app url = "./controllers/Routes.php?call=index" headJson = "./application/headers/routes.json">
                    
                    <template slot = "details-data" slot-scope = "slotProps">
                        <routes-radar-graphics v-if = "!changeYear" :year = "yearSelect" :router = "slotProps.item.id">
                        </routes-radar-graphics>
                    </template>

                </gridbox-app>
            </template>
        
        </template-basic>
    `
});

export default RoutesApp;