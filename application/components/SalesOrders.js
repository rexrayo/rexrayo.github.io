'use strict';

var SalesOrders = Vue.component('salesorders-app', {

	data: function(){
		return {
			dialog: {}, 
			saleorder: {},
			buttonsDisable: ["edit", "show", "delete"],
			client: null
		};
	},


	methods: {
		
		// funcion que se encarga de mostrar
		// los detalles de la orden
		showSaleorder: function(saleorder = {}){
			this.saleorder = saleorder;
			this.dialog = {show: true};
		},

		// ocultando un dialog relevante
		hideDialog: function(saleorder = {}){
			this.saleorder = {};
			this.dialog = {};
		},

		// funcion que se encarga de crear un pedido
		// nuevo para la edicion de sus productos
		createSaleOrder: function(id = ""){
			fetch(`/controllers/SalesOrders.php?call=create&client=${id}`).then((response)=>{
				if( response.status == 200 )
					return response.json();
				else
					window.alert("El pedido no puedo ser creado vuelva a intentarlo...!");
			}).then((saleorder) => {
				if( saleorder.id !=  null )
					this.$router.push(`/salesorders/edit/${saleorder.id}`);
			});
		},

		// funcion que se encarga de la edicion de un pedido
		editSaleOrder: function(saleorder = {}){
			if( saleorder.id !=  null )
				this.$router.push(`/salesorders/edit/${saleorder.id}`);
		}
	},


	template: `
		<div>
			<template-basic>

				<template slot = "form-new-template-basic" slot-scope = "slotProps">
					<dialog-full-screen color = "purple" :active = "true" :hide = "slotProps.close">
						
						<template slot = "dialog-title">
							<span>Nuevo Pedido</span>
						</template>

						<template slot = "dialog-content">
							<v-container>
								<v-row>
									<v-col cols = "12">
										 
										<v-card class="overflow-hidden" color="purple lighten-1" dark>
											<v-toolbar flat color = "purple">
												<v-icon>mdi-account</v-icon>
												 <v-spacer></v-spacer>
												<v-toolbar-title class="font-weight-light">Listado de Clientes</v-toolbar-title>
											</v-toolbar>
											<v-card-text>
												<autocomplete-form 
													:select = "client" 
													uri = "./controllers/SalesOrders.php?call=searchClients" 
													column = "name"
													itemValue = "id"
													:getSelect = "createSaleOrder"
												>
												</autocomplete-form>
											</v-card-text>
										</v-card>
									
									</v-col>
								</v-row>
							</v-container>
						</template>

					</dialog-full-screen>
				</template>

				<template slot = "dialog-template-basic">

					<dialog-full-screen :active = "dialog.show" :hide = "hideDialog"  color = "indigo dark-4">
						<template slot = "dialog-title">
							Pedido N° {{ saleorder.saleorder_number }}
						</template>
						<template slot = "dialog-content">
							<v-container>
								
								<h2 class  =  "text-center">
									<span>Detalles</span>
								</h2>
								
								<v-row style = "color: #555; font-size: 12px;">
									<v-col cols = "6">
										<strong>Pedido N°: </strong>
										<span>{{ saleorder.saleorder_number }}</span>
									</v-col>
									<v-col cols = "6">
										<strong>Fecha:</strong>
										<span>{{ saleorder.saleorder_date }}</span>
									</v-col>
									<v-col cols = "6">
										<strong>Estado: </strong>
										<span>{{ saleorder.sale_order_status }}</span>
									</v-col>
									<v-col cols = "6">
										<strong>Tipo de Pedido: </strong>
										<span>{{ saleorder.sale_order_type }}</span>
									</v-col>
									<v-col cols = "6">
										<strong>Subtotal: </strong>
										<span>{{ saleorder.subtotal_wdiscount }}</span>
									</v-col>
									<v-col cols = "6">
										<strong>Iva: </strong>
										<span>{{ saleorder.tax_with_ep }}</span>
									</v-col>
									<v-col cols = "6">
										<strong>Total: </strong>
										<span>{{ saleorder.total_saleorder_wearlypay }}</span>
									</v-col>
								</v-row>

								<h3 class = "text-center">
									Productos del pedido 
								</h3>
								
								<gridbox-app
									v-if =  "saleorder.id"
									:url = " './controllers/SalesOrders.php?call=products&id=' + saleorder.id"
									headJson = "./application/headers/products_saleorder.json"
									:buttonsDisable = "buttonsDisable"
								>
								</gridbox-app>
							</v-container>
						</template>
					</dialog-full-screen>

				</template>


				<template slot = "content-template-basic">
					<gridbox-app 
						url = "./controllers/SalesOrders.php?call=index" 
						headJson = "./application/headers/salesorders.json"
						:show = "showSaleorder"
						:edit = "editSaleOrder"
					>
					</gridbox-app>
				</template>

			</template-basic>
		</div>
	`
});

export default SalesOrders;