'use strict';

// Componente que se encarga de salir de aplicacion
var SignOut = Vue.component('singout-app',{

	// datos del componente
	data: function(){
		return {active: true};
	},

	methods: {

		// funcion que se encarga de cancelar la operacion
		// y volver a la pantalla anterior
		cancel: function(){
			this.$router.history.go(-1);
		},

		// cuando se ha confirmado el salir cesion
		confirm: function(){
			this.active = false;
			fetch(`./controllers/Session.php?call=signout`).then((response)=>{
				this.$router.push("/");
			});
		}
	},

	// plantilla base
	template: `
		<template-basic :disableNew = "true">
			
			<template slot = "dialog-template-basic">
				<dialog-confirm :active = "active" :cancel = "cancel" :confirm = "confirm" >
					<template slot = "dialog-title">
						<span>Cerrar Cesión</span>
					</template>
					<template slot = "dialog-content">
						¿Esta seguro que desea salir de drotaca mobil?
					</template>
				</dialog-confirm>
			</template>

			<template slot = "content-template-basic">

				<v-row v-if = "!active" justify="center" align="center" dense>
                	<v-col cols = "12">
                    	<div class="text-center ma-12">
                        	<v-progress-circular style = "margin: 10px auto;" :size = "100" :width = "5" color = "purple" indeterminate>
                            	{{ 'Saliendo...' }}
                        	</v-progress-circular>
                    	</div>
                	</v-col>
            	</v-row>

			</template>

		</template-basic>
	`
});

export default SignOut;