'use strict';

// dialogo que cubre toda la pantalla
var DialogFullScreen = Vue.component('dialog-full-screen', {
    
    props: ["active", "color", "hide", "buttonsToolbar"],

    methods: {
        beforeCallback: function(button){
            typeof button.callback == "function" ? button.callback( ) : console.error(`El boton ${button.id} no tiene un evento relacionado`);  
            typeof this.hide == "function" ? this.hide() : null;
        }
    },

    template: `
    <v-row justify="center">
        <v-dialog v-bind:value = "active" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>

                <v-toolbar fixed dark v-bind:color = "color">
                    <v-btn icon dark v-on:click =  "hide(false)">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title class ="text--white">
                        <slot name = "dialog-title"></slot>
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn icon v-for = "button in buttonsToolbar" v-on:click = "beforeCallback(button)">
                            <v-icon>mdi-{{ button.icon }}</v-icon>
                        </v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                
                <slot name = "dialog-content"></slot>

            </v-card>
        
        </v-dialog>
    </v-row>
    `
});

export default DialogFullScreen;