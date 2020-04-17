<?php

# Libreria estando de todos los controladores
include_once "BaseCtrl.php";

//clase para las tareas
class Task extends BaseCtrl {

	# listado de tareas
	public function index(){
		$response = new getApi;
		$response->setConfig(["uri" => "Task.php?call=index", "method" => "GET"]);
		$response->openApi( $this->params );
		$this->render_json( $response->getJsonResponse(), $response->getStatus() );
	}

}

new Task;
?>