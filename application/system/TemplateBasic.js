'use strict';

var TemplateBasic = Vue.component('template-basic', {

    props: ["color", "disableNew"],
    
    data: function(){ 
        return {
            formNew: false, 
            alert: null
        }; 
    },

    methods: {
        closeFormNew: function(){
            this.formNew = false;
        }
    },

    template: `
        <div>

            <app-bars :color = " color ? color : 'purple dark' ">
            </app-bars>


            <div v-if = "formNew">
                <v-container>
                    <slot name = "form-new-template-basic" v-bind:close = "closeFormNew">
                    </slot>
                </v-container>
            </div>
            <div>
                <slot name = "dialog-template-basic">
                </slot>
            </div>
            <div>
                <slot name = "content-template-basic">
                </slot>
            </div>
            <div v-if = "disableNew == null || disableNew == false">
                <v-fab-transition>
                    <v-btn v-on:click = "formNew = true" :color = " color ? color : 'purple dark' " fixed fab large bottom right>
                        <v-icon style = "color: #fff;">mdi-plus</v-icon>
                    </v-btn>
                </v-fab-transition>
            </div>
        </div>
    `
});

export default TemplateBasic;