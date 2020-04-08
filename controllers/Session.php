<?php

include_once "BaseCtrl.php";

class SessionCtrl extends BaseCtrl {

	// funcion que hace la llamada al servidor
	// para iniciar cesion
	public function signin(){
		
		$response = new getApi();
		$response->setConfig(["uri" => "Session.php?call=signin", "method" => "POST"]);
		$response->openApi($this->params);

		if( $response->getStatus() == 202)
			$this->setSession( $response->getJsonResponse() );

		$this->render_json( $response->getJsonResponse(), $response->getStatus() );
	}

	// funcion que se encarga de 
	// cerrar cesion 
	public function signout(){
		if(!empty($_SESSION["user"]))
			unset($_SESSION["user"]);
	}

	// funcion que se encarga de 
	// iniciar la session
	public function get_session(){
		$this->render_json($this->current_user);
	}
}

new SessionCtrl();