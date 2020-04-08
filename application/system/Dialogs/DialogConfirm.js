'use strict';

// dialogo de confirmacion
var DialogConfirm = Vue.component('dialog-confirm', {
    
    props: ["active", "confirm", "cancel"],

    template: `
        <v-row justify="center">
            <v-dialog  persistent v-bind:value = "active" min-width = "320">
                <v-card>
                    <v-card-title class="headline">
                        <slot name = "dialog-title"></slot>
                    </v-card-title>
                    <v-card-text>
                        <slot name = "dialog-content"></slot>
                    </v-card-text>
                    <v-card-actions>
                        <v-divider></v-divider>
                        <v-spacer></v-spacer>
                        
                        <v-btn v-on:click = "confirm(true)" v-bind:elevation = "0" color = "transparent" style = "color:#2c823c !important;">
                            <span>Aceptar</span>
                            <v-icon>mdi-check</v-icon>
                        </v-btn>
                        <v-btn v-on:click = "cancel(false)" v-bind:elevation = "0" color = "transparent" style = "color: #f44336 !important;">
                            <span>Cancelar</span>
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    `
});

export default DialogConfirm;