'use strict';

var GridBoxData = Vue.component('gridbox-data-row', {
    
    props: ["head", "item", "show", "edit" ,"delete", "buttons", "buttonsDisable"],

    // datos del componente
    data: function(){
        return { 
            panel: false,
            buttonsDefault: [
                {id: "show", icon: "view-list", callback: this.show ? this.show : null, color: "primary"},
                {id: "edit", icon: "pencil", callback: this.edit ? this.edit : null, color: "teal"},
                {id: "delete", icon: "delete", callback: this.delete ? this.delete : null, color: "red"}
            ]
        };
    },

    methods: {

        // funcion que se encarga de buscar botones 
        // en la lista de botones a deshabilitar
        checkButtonsDisable: function(id){
            let buttons = Array.isArray( this.buttonsDisable ) ? this.buttonsDisable : [];
            let disabled = false;
            for(var i = 0; i < buttons.length ; i++){
                if( buttons[i] ==  id)
                    disabled  = true;
            }
            return disabled;
        },

        // funcion que observa el evento que ocurrira
        beforeCallback: function(button){
            typeof button.callback == "function" ? button.callback( this.item ) : console.error(`El boton ${button.id} no tiene evento ni funcion de llamada`);
        },

        // funcion que se encarga de devolver 
        // los formatos de las
        // columnas establecidas
        showValueColumn: function(column, value = ""){
            
            if( typeof column ==  "object" && column.value != null){
                
                switch( column.format ){
                    case "number": value = `${formatMoney(value)}`; break;
                    default: value = `${value}`; break;
                }
                
                value = ( column.precol ? `${column.precol} ${value}` : value );
                value = ( column.append ? `${value} ${column.append}` :  value );
            }

            return value;
        }
    
    },

    // datos computados
    computed: {

        addDetails: function(){
            return this.$slots["details-data"] != null;
        }

    },

    template: `
        <v-col cols = "12" sm = "6" md = "4" style = "background: #fff; border: 1px solid #ddd; border-radius: 5px; margin-top: 0px;">
            <div v-on:click = "panel = !panel;">
                
                <v-avatar tile color = "grey" size = "50">
                    <v-img v-if = "item.img" v-bind:src = "item.img"></v-img>
                    <v-icon v-else style = "color: #fff;"> mdi-image </v-icon>
                </v-avatar>

                <span v-for = "columnHead in head.head " style = "margin-left: 10px;color: #666; font-size: 12px;"  >
                    {{ item[columnHead] }}
                </span>
            </div>
        
            <v-expand-transition>
                <v-row v-show = "panel">
                    <v-container>
                        <v-row>
                            <v-col  v-for = "value, column  in head.columns" :key = "column"   cols = "6">
                                <strong style = "margin-left: 5px;color: #666; font-size: 12px;">{{ value.value ? value.value : value }}:</strong>
                                <span style = "margin-left: 5px;color: #666; font-size: 12px;">
                                    {{ showValueColumn( value ,item[column] ) }}
                                </span>
                            </v-col>
                        </v-row>
                    </v-container>
                    
                    <v-container v-if = "addDetails && panel" >
                        <slot name = "details-data" v-bind:item = "item">
                        </slot>
                    </v-container>

                    <v-row style = "margin: 2px 0px;" >
                        <v-col cols = "6"> 
                            <v-btn icon  
                                v-for = "button in buttons" 
                                v-bind:key = "button.id" 
                                v-bind:color = "button.color" 
                                v-on:click = "beforeCallback(button)"
                                v-if = "!checkButtonsDisable(button.id)"
                            >
                                <v-icon>mdi-{{ button.icon }}</v-icon>
                            </v-btn>
                        </v-col>
                        <v-col cols = "6" style = "margin-top: 2px; text-align: right;">
                            <v-btn icon  
                                v-for = "button in buttonsDefault"
                                v-bind:key = "button.id" 
                                v-bind:color = "button.color" 
                                v-on:click = "beforeCallback(button)"
                                v-if = "!checkButtonsDisable(button.id)"
                            >
                                <v-icon>mdi-{{ button.icon }}</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-row>
            </v-expand-transition>
        </v-col>
    `
});

export default GridBoxData;