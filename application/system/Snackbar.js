'use strict';

var SnackbarBasic = Vue.component('snackbar-basic-app', {
    
    props: ["message", "color"],

    data: function(){
    	return {active: false};
    },

    watch: {

    	message: function(value){
    		console.log("hubo un cambio en mesaje");
    	}
    },

    computed: {
    	getIcon: function(){
    		var icon = null
    		switch(this.colors){
    			case "error": icon = "mdi-alert"; break;
    			case "success": icon = "mdi-check-circle"; break;
    			case "warning": icon = "mdi-exclamation"; break;
    			default: icon = "mdi-innformation"; break;

    		}
    		return icon;
    	}
    },

    template: `
        <v-snackbar  vertical top v-bind:value = "true" v-bind:elevation = "0"  :color = " color ? color : 'info' ">
            <v-row>
            	<v-col cols = "1"><v-icon color = "white">mdi-alert</v-icon></v-col>
            	<v-col cols = "11"><span>{{ message }}</span></v-col>
            </v-row>
        </v-snackbar>
    `
})

export default SnackbarBasic;