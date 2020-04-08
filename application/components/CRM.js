'use strict';

var CRM = Vue.component('crm-app', {

	data: function(){
		return {
			dialog: {},
			client: {},
		};
	},


	methods: {
		// funcion que se encarga de mostrar los detalles del cliente
		showClient: function(client = {}){
			this.client = client;
			this.dialog = {show: true};
		},

		// ocultando un dialog relevante
		hideDialog: function(client = {}){
			this.client = {};
			this.dialog = {};
		},
	},


	template: `
		<div>
			<template-basic>
				<template slot = "form-new-template-basic" slot-scope = "slotProps">
				</template>

				<template slot = "dialog-template-basic">
					<dialog-full-screen :active = "dialog.show" :hide = "hideDialog"  color = "indigo dark-4">
						<template slot = "dialog-title">
							Tareas : {{ client.name }}
						</template>
						<template slot = "dialog-content">
							<v-container>
								<h2 class  =  "text-center">
									<span>CRM</span>
								</h2>
								
								<v-row style = "color: #555; font-size: 12px;">
								<gridbox-app 
									url = "./controllers/SalesOrders.php?call=searchClients"
									headJson = "./application/headers/CRM.json"
									:show = "showClient"
								>
								</gridbox-app>
								</v-row>
							</v-container>
						</template>
					</dialog-full-screen>
				</template>


			</template-basic>
			<div>
				<br>
				<h2 class = "text-center">
					<span>CRM</span>
				</h2>
				<gridbox-app 
					url = "./controllers/SalesOrders.php?call=searchClients"
					headJson = "./application/headers/CRM.json"
					:show = "showClient"
				>
				</gridbox-app>
			</div>
		</div>
	`
});

export default CRM;