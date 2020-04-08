'use strict';

var autocomplete = Vue.component('autocomplete-form', {
	
	props: ["getSelect", "uri", "column", "itemValue"],

	created: function(){
		this.setSuggestions();
	},

	data: function(){
		return {
			suggestions: [], 
			search: null, 
			signal: null,
			activeSearch: null,
			select: null
		};
	},

	methods: {

		setSuggestions: function(q = ""){
			var controller = new AbortController();
			var signal = controller.signal;

			if(this.signal  != null)
            	this.signal.controller.abort();
            this.signal = {q,  signal, controller};

			fetch(`${this.uri}&q=${q}`, {signal}).then((response)=>{
				return response.json();
			}).then((data) => {
				this.suggestions = data;
			});
		}

	},

	watch: {

		// haciendo la busqueda
		search: function(q = ""){
			
			if(window.activeSearch != null)
                window.clearInterval( window.activeSearch );

            if(q != null)
            	window.activeSearch = window.setTimeout(this.setSuggestions, 500, q);
		},

		// haciedo mas
		select: function( value ){
			// evaluamos si el invoicador envia un prototipo para obtener el
			// valor seleccionado 
			typeof this.getSelect == "function" ? this.getSelect( value ) :  null;
		}

	},

	template: `
		<div>
			<v-autocomplete 
				v-model = "select" :item-text = "column" 
				:item-value  = "itemValue" 
				:items = "suggestions" 
				:search-input.sync = "search"
			>
				
				<template slot = "selection"  slot-scope = "data">
					<div>
						<v-avatar>
							<v-icon>mdi-magnify</v-icon>
						</v-avatar>
						<span>{{ data.item[column] }}</span>
					</div>
				</template>

				<template slot = "item" slot-scope = "data">
					<v-avatar>
						<v-icon>mdi-magnify</v-icon>
					</v-avatar>
					<span>{{ data.item[column] }}</span>
				</template>
			
			</v-autocomplete>
		</div>
	`
});

export default autocomplete;