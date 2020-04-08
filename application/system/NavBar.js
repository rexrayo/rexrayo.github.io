'use strict';

var NavBar = Vue.component('app-bars',{
    
    props: ["color"],

    // datos del componente
    data: function(){
        return {
            menus: window.menusApp,
            search: false,
            drawer: false,
            titleNav: "Inicio",
            text: "",
            user: null
        }
    },

    // antes de crear el componente evaluamos su cesion 
    beforeCreate: function(){
        window.setInterval(()=>{
            this.user = window.current_session;
        }, 2000);
    },

    // al momento de ser creado el elemento
    created: function(){
        
        let title = [];
        let routerCurrent = this.$router.currentRoute.path;
        let menus = this.menus;

        if( this.items == null )
            this.items = [];

        for(var i = 0; i < menus.length; i++){
            if( menus[i].path == routerCurrent )
                this.titleNav = menus[i].title;
        }
    },

    methods: {

        // funcion que devuelve el tamaño obtenido para 
        // el drawer cubrira toda la pantalla
        getHeightDrawer: function(){
            let height =  this.drawer ? screen.height : 0;
            return height;
        },

        // funcion que se encarga de ocultar
        // drawer y llevarte a renderizar al
        // componente que se utilizara como principal
        toClickLink: function(item){
            this.drawer = false;
            if( this.$router.history.current.path !== item.path ){
                this.titleNav = item.title;
                this.$router.push( item.path );
            }
        }

    },

    template: `
    <div style = "margin-bottom: 50px;">
        <v-card class = "overflow-hidden">
            <v-app-bar fixed dark :color = " color ? color : 'purple dark' ">

                <v-app-bar-nav-icon v-if = "!search" @click.stop = "drawer = !drawer">
                </v-app-bar-nav-icon>

                <v-avatar>
                    <v-img src = "http://190.216.252.250:8080/drotaca_soberano/app/imgs/logos/drotaca.png"  /> 
                </v-avatar>
                
                <v-toolbar-title>
                    <span>Drotaca C.A</span>
                </v-toolbar-title>
                
            </v-app-bar>
        </v-card>

            <v-navigation-drawer v-model="drawer" absolute temporary>
                <v-list-item>
                    <v-list-item-avatar>
                        <v-icon>mdi-account</v-icon>
                    </v-list-item-avatar>
    
                    <v-list-item-content>
                        <v-list-item-title>{{ user ? user.identity.first_name + ' '+ user.identity.last_name : 'Desconocido' }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
    
                <v-divider></v-divider>
    
                <v-list dense>
                    <v-list-item v-for="item in menus" :key="item.title" link v-on:click = "toClickLink(item)">
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>
    
                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
          </v-list>
        </v-navigation-drawer>        
    </div>
    `
});

export default NavBar;