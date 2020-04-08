<?php

# Libreria estando de todos los controladores
include_once "BaseCtrl.php";

class Graphics extends BaseCtrl {

	# muestra los clientes establecidos
	public function telemarketing_group_clients(){
		$response = new getApi;
		$response->setConfig(["uri" => "Graphics.php?call=telemarketing_group_clients", "method" => "POST"]);
		$response->openApi($this->params);
		$this->render_json( $response->getJsonResponse(), $response->getStatus() );
	}

	# muestra los clientes determinados por un grupo de ventas
	public function group_clients_sales(){
		$response = new getApi;
		$response->setConfig(["uri" => "Graphics.php?call=group_clients_sales", "method" => "POST"]);
		$response->openApi($this->params);
		$this->render_json( $response->getJsonResponse(), $response->getStatus() );
	}

	# graficos de televantes y para obtener y hacer el radar
	public function telemarketing_radar(){
		$response = new getApi;
		$response->setConfig(["uri" => "Graphics.php?call=telemarketing_radar", "method" => "POST"]);
		$response->openApi($this->params);
		$this->render_json( $response->getJsonResponse(), $response->getStatus() );
	}

	# graficos de de rutas
	public function routes(){
		$response = new getApi;
		$response->setConfig(["uri" => "Graphics.php?call=routes", "method" => "POST"]);
		$response->openApi($this->params);
		$this->render_json( $response->getJsonResponse(), $response->getStatus() );
	}

	# listado de datos para dashboard
	public function index(){
		$response = new getApi;
		$year = empty($this->params["year"]) ? date("Y") : $this->params["year"] ;
		$response->setConfig(["uri" => "Graphics.php?call=index&year={$year}", "method" => "GET"]);
		$response->openApi();
		$this->render_json( $response->getJsonResponse(), $response->getStatus() );
	}


	# listado de datos para dashboard
	public function clients(){
		$response = new getApi;
		$year = empty($this->params["year"]) ? date("Y") : $this->params["year"];
		$month = empty($this->params["month"]) ? date("m") : $this->params["month"];
		$response->setConfig(["uri" => "Graphics.php?call=clients&year={$year}&month={$month}", "method" => "GET"]);
		$response->openApi();
		$this->render_json( $response->getJsonResponse(), $response->getStatus() );
	}

}

new Graphics;