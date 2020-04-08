'use strict';

var editSaleOrder = Vue.component('edit-saleorder-app', {

	data: function(){
		return {
			saleorder: null,
			disableButtons: ["show", "edit", "delete"],
			product: null,
			quantity: 0,
			dialogAdd: false,
			dialogShow: false,
			buttonsAdd: [{id: "add", icon: "plus-circle", color: "red", callback: this.openDialogAdd}],
			snackbar: null
		};
	},

	created: function(){
		this.refreshSaleOrder();
	},

	watch: {
		snackbar: function(value){
			if( value.message ){
				window.alert( value.message );
			}
		}
	},

	methods: {

		// refesca la orden dada
		refreshSaleOrder: function(){
			let params = this.$route.params;
			fetch(`./controllers/SalesOrders.php?call=get&id=${params.id}`).then((response)=>{
				return response.json();
			}).then((saleorder)=>{
				this.saleorder = saleorder;
			});
		},

		// apertura el dialogo de 
		// agregar un producto determinado
		openDialogAdd: function(product = {}){
			this.dialogAdd = true;
			this.product = product;
			this.quantity = 0;
		},

		closeDialogAdd: function(){
			this.dialogAdd = false;
			this.quantity = 0;
		},

		// cierra el dialogo que muestra la
		// informacion de la orden
		closeDialogShow: function(){
			this.dialogShow = false;
		},

		// producto a agregar
		addProduct: function(){
			
			fetch(`./controllers/SalesOrders.php?call=addProduct`,{	
				method: "POST",
				body: `id=${this.product.id}&saleorder_id=${this.saleorder.id}&quantity=${this.quantity}&customer=${this.saleorder.customer_id}&product_state=${this.product.product_state}`,
				credentials: "include",
				headers: {"Content-Type": "application/x-www-form-urlencoded"}
			}).then((response)=>{
				if(response.status == 200)
					return response.json();
				else {
					let badSnackbar = response.json();
					badSnackbar.then((result)=>{
						this.snackbar = {color: "success", message: result.message};
					});
				}
			}).then((result)=>{
				if(result != null){
					this.snackbar = {color: "success", message: "El producto fue agregado al pedido con exito..!"};
					this.dialogAdd = false;
					this.refreshSaleOrder();
				}
			});
		}

	},

	template: `
		<template-basic :disableNew = "true">

			<template slot = "dialog-template-basic">
				
				<dialog-confirm :active = "dialogAdd" :confirm = "addProduct" :cancel = "closeDialogAdd" >
					<template slot = "dialog-title">Agregando producto</template>
					<template slot = "dialog-content" v-if = "product">
						
						<v-container>
							<v-row>
								<v-col cols = "12">
									<v-text-field type = "number" v-model = "quantity"  style = "margin: 0px; padding: 0px;"  label="Cantidad" outlined>
                    				</v-text-field>
								</v-col>
							</v-row>
						</v-container>
					</template>
				</dialog-confirm>


				<dialog-full-screen :active = "dialogShow" v-if = "saleorder"  :hide = "closeDialogShow"  color = "indigo dark-4">
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
									v-if =  "dialogShow && saleorder.id"
									:url = " './controllers/SalesOrders.php?call=products&id=' + saleorder.id"
									headJson = "./application/headers/products_saleorder.json"
									:buttonsDisable = "disableButtons"
								>
								</gridbox-app>
							</v-container>
						</template>
					</dialog-full-screen>
				
			</template>

			<template slot = "content-template-basic">
				
				<v-container>
				</v-container>
				
				<div class = "text-center" style = "color: #666;">
					<h3>Productos para agregar</h3>
				</div>

				<gridbox-app 
					v-if = "saleorder"
					headJson = "./application/headers/salesorders/search_products.json"
					:url = " './controllers/SalesOrders.php?call=searchProducts&customer_id=' + saleorder.customer_id"
					:buttonsDisable = "disableButtons"
					:buttons = "buttonsAdd"
				>
				</gridbox-app>
				

				<v-bottom-navigation fixed :value = "true" color = "indigo">
					
					<v-btn>
        				<span>Generar</span>
        				<v-icon>mdi-history</v-icon>
        			</v-btn>

        			<v-btn>
        				<span>Guardar</span>
        				<v-icon>mdi-content-save</v-icon>
        			</v-btn>

      				<v-btn>
      					<span>Cancelar</span>
        				<v-icon>mdi-cancel</v-icon>
      				</v-btn>


      				<v-btn v-on:click = "dialogShow = true">
      					<v-badge color="green"   :value = "true" content = "6" overlap>
      						Productos
        				</v-badge>
        				<v-icon>mdi-shopping</v-icon>
      				</v-btn>

    			</v-bottom-navigation>

			</template>
		</template-basic>
	`
});

export default editSaleOrder;

