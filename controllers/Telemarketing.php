<?php

# Libreria estando de todos los controladores
include_once "BaseCtrl.php";

class Telemarketing extends BaseCtrl {

    # listado de datos para dashboard
	public function index(){
		$response = new getApi;
		$year = empty($this->params["year"]) ? date("Y") : $this->params["year"] ;
		$response->setConfig(["uri" => "Telemarketing.php?call=index", "method" => "POST"]);
		$response->openApi( $this->params );
		$this->render_json( $response->getJsonResponse(), $response->getStatus() );
	}

	# listado de datos ha realizar la consulta
	public function groupSeller(){
		$response = new getApi;
		$response->setConfig(["uri" => "Telemarketing.php?call=groupSeller", "method" => "POST"]);
		$response->openApi( $this->params );
		$this->render_json( $response->getJsonResponse(), $response->getStatus() );
	}

	# muestra los clientes determinados por un grupo de ventas
	public function group_clients_sales(){
		$response = new getApi;
		$response->setConfig(["uri" => "Telemarketing.php?call=group_clients_sales", "method" => "POST"]);
		$response->openApi($this->params);
		$this->render_json( $response->getJsonResponse(), $response->getStatus() );
	}


}

new Telemarketing;

?>