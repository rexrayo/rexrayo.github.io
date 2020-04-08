<?php

# Libreria estando de todos los controladores
include_once "BaseCtrl.php";

class Routes extends BaseCtrl {

    # graficos de televantes y para obtener y hacer el radar
	public function index(){
		$response = new getApi;
		$response->setConfig(["uri" => "Routes.php?call=index", "method" => "GET"]);
		$response->openApi();
		$this->render_json( $response->getJsonResponse(), $response->getStatus() );
	}

	# listado de datos ha realizar la consulta
	public function group_routes(){
		$response = new getApi;
		$response->setConfig(["uri" => "Routes.php?call=group_routes", "method" => "POST"]);
		$response->openApi( $this->params );
		$this->render_json( $response->getJsonResponse(), $response->getStatus() );
	}
}

new Routes;