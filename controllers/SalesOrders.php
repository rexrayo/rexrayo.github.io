<?php

include_once "BaseCtrl.php";

class SalesOrdersCtrl extends BaseCtrl {

	// funcion que se encarga de hacer
	// el buscado de clientes
	public function searchClients(){
		$response = new getApi;
		$response->setConfig(["uri" => "SalesOrders.php?call=searchClients", "method" => "GET"]);
		$response->openApi();
		$this->render_json( $response->getJsonResponse(), $response->getStatus() );
	}

	// listado de pedidos
	public function index(){
		$response = new getApi;
		$response->setConfig(["uri" => "SalesOrders.php?call=index", "method" => "GET"]);
		$response->openApi($this->params);
		$this->render_json( $response->getJsonResponse(), $response->getStatus() );
	}

	// funcion que se encarga de crear 
	// un nuevo producto
	public function create(){
		$response = new getApi;
		$response->setConfig(["uri" => "SalesOrders.php?call=create", "method" => "POST"]);
		$response->openApi( $this->params );
		$this->render_json( $response->getJsonResponse(), $response->getStatus() );
	}

	// funcion que se encarga de 
	// obtener la informacion de una orden de venta
	public function get(){
		$response = new getApi;
		$response->setConfig(["uri" => "SalesOrders.php?call=get&id={$this->params["id"]}", "method" => "GET"]);
		$response->openApi();
		$this->render_json( $response->getJsonResponse(), $response->getStatus() );
	}

	// funcion que se encarga de hacer la busqueda de productos
	public function searchProducts(){
		$response = new getApi;
		$response->setConfig([
			"uri" => "SalesOrders.php?call=searchProducts&customer_id={$this->params["customer_id"]}",
			"method" => "GET"
		]);
		$response->openApi();
		$this->render_json( $response->getJsonResponse(), $response->getStatus() );
	}

	// funcion que se encarga de gregar el prodcuto al pedido
	public function addProduct(){
		$response = new getApi;
		$response->setConfig(["uri" => "SalesOrders.php?call=addProduct", "method" => "POST"]);
		$response->openApi( $this->params );
		$this->render_json( $response->getJsonResponse(), $response->getStatus() );
	}

	// funcion que se encarga de llamar al servidor a solicitar
	// los productos que tiene un pedido
	public function products(){
		$response = new getApi;
		$response->setConfig(["uri" => "SalesOrders.php?call=products&id={$this->params["id"]}", "method" => "GET"]);
		$response->openApi();
		$this->render_json( $response->getJsonResponse(), $response->getStatus() );
	}

}

new SalesOrdersCtrl();