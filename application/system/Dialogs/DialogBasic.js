'use strict';

var DialogBasic = Vue.component('dialog-basic',{
    
    props: ["active"],

    /*data: function(){
        return {active: true};
    },**/
    
    template: `
        <v-row justify="center">
            <v-dialog  persistent scrollable v-bind:value = "active" min-width = "320">
                <v-card>
                    
                    <v-card-title class="headline">
                        <slot name = "dialog-title"></slot>
                    </v-card-title>
                    <v-divider></v-divider>
                    
                    <v-card-text>
                        <slot name = "dialog-content"></slot>
                    </v-card-text>
                    
                    <v-card-actions>
                        <v-divider></v-divider>
                        <v-spacer></v-spacer>
                        <slot name = "dialog-actions"></slot>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    `
});

export default DialogBasic;