'use strict';

// importando complementos principales
import NavBar from "./system/NavBar.js";
import TemplateBasic from "./system/TemplateBasic.js";
import GridBox from "./system/GridBox.js";
import DialogConfirm from "./system/Dialogs/DialogConfirm.js";
import DialogFullScreen from "./system/Dialogs/DialogFullScreen.js";
import DialogBasic from "./system/Dialogs/DialogBasic.js";
import SnackbarApp from "./system/Snackbar.js";
import Autocomplete from "./system/AutocompleteApp.js";
import HorizontalBarChartJs from "./system/Graphics/HorizontalBarChartJs.js";
import BarChartJs from "./system/Graphics/Bar.js";
import lineChart from "./system/Graphics/Line.js";
import DoughnutChart from "./system/Graphics/Doughnut.js";
import RadarGraphics from "./system/Graphics/Radar.js";
import progress from "./system/progress-loading.js";

// importando completos que muestran las pantalas
import Home from "./components/Home.js";
import Signin from "./components/Signin.js";
import Salesorders from "./components/SalesOrders.js";
import SignOut from "./components/SignOut.js";
import editSaleOrder from "./components/salesorders/editSaleorder.js";
import teleMarketing from "./components/Telemaketing.js";
import CRM from "./components/CRM.js";
import Task from "./components/Task.js";
import routesApp from "./components/Routes.js";
import Inventory from "./components/Inventory.js";

export default {

    // rutas de la aplicacion con sus componentes
    routes: [
        {path: "/", component: Home},
        {path: "/signin", component: Signin},
        {path: "/home", component: Home, icon: "mdi-home", title: "Inicio", menu: true},
        {path: "/inventory", component: Inventory, icon: "mdi-format-list-bulleted-type", title: "Inventario", menu: true},
        {path: "/salesorders", component: Salesorders, icon: "mdi-format-list-bulleted-type", title: "Pedidos", menu: true},
        {path: "/routes", component: routesApp, icon: "mdi-format-list-bulleted-type", title: "Rutas", menu: true},
        {path: "/telemarketing", component: teleMarketing, icon: "mdi-format-list-bulleted-type", title: "Televentas", menu: true},
        {path: "/CRM", component: CRM, icon: "mdi-format-list-bulleted-type", title: "CRM", menu: true},
        {path: "/Task", component: Task, icon: "mdi-format-list-bulleted-type", title: "Task", menu: true},
        {path: "/signout", component: SignOut, icon: "mdi-close", title: "Cerrar Cesión", menu: true},
        {path: "/salesorders/edit/:id", component: editSaleOrder}

    ],

    // funcion que se dedica a la inicializacion del 
    // componente
    initApp: function(){
        new Vue({
            el: "#app", // instaciacion en el div app
            vuetify: new Vuetify(),
            router: new VueRouter({ routes: this.routes }),

            // datos del componente
            data: () => { return {routes: this.routes, session: {}, current_path: ""}; },

            // funcion que se encarga de evaluar 
            // la cookie de session 
            created: function(){
                window.menusApp = this.routes.filter((route)=>{ return  route.menu === true });
                window.setInterval(()=>{this.current_path = this.$router.history.current.path; },100);
            },

            // methodo de ejecución
            methods: {

                // obtener la cesion actualmente activa
                getSession: function(){
                    fetch(`./controllers/Session.php?call=get_session`).then((response)=>{
                        return response.json();
                    }).then((session) => {
                        this.session = session;
                    }).catch(()=>{ this.session = null; });
                },
                
                // funcion que se encarga de 
                // evaluar el componente montado
                setMount: function(component){
                    this.componentMount = component;
                },

                // funcion que se encarga de ocultar
                // drawer y llevarte a renderizar al
                // componente que se utilizara como principal
                toClickLink: function(path){
                    if( this.$router.history.current.path !== path )
                        this.$router.push( path );
                    else
                        console.error("Link ingresado no puede causar un bucle indefinido");
                }
            },

            // evalua los cambios 
            // del componente en sus datos
            watch: {

                // cambio de session
                current_path: function(){
                    this.getSession();
                },

                // evalua los cambios de la session 
                // en tiempo de ejecucion
                session: function(signin){
                    window.current_session = signin;
                    if( signin == null )
                        this.toClickLink("/signin");
                    else{
                        if( this.$router.history.current.path == "/signin" )
                            this.toClickLink("/");
                    }
                }

            }
        });
    }
};

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../sw.js').then( () => {
      console.log('Service Worker Registered')
    })
  })
}