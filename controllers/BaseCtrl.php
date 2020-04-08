<?php

include_once "../getApi/getApi.php";

/* controllador base */
class BaseCtrl {

	// cargando parametros
	public function __construct(){
		
		$this->call = $_REQUEST["call"];

		// iniciando para acceder 
		// a las sessiones
		if( empty($_SESSION) )
			session_start();

		$this->current_user = empty($_SESSION["user"]) ? null :  $_SESSION["user"];
		unset($_REQUEST["call"]);
		$this->params = $_REQUEST;
		$this->render();
	}

	// funcion que se encargar de introducir datos a la session actual del usuario
	public function setSession($user = null){
		$_SESSION["user"] =  $user;
		$this->current_user = $_SESSION["user"];
	}

	// funcion que renderizacion
	public function render(){
		try {
			if(  !method_exists($this, $this->call) )
				throw new Exception("El evento establecido no fue encontrado...!");
			else {
				$call = "{$this->call}";
				$this->$call();
			}

		} catch(Exception $e){
			http_response_code(422);
			die(
				json_encode([
                    "line" => $e->getLine(),
                    "errors" => $e->getMessage(),
                    "file" => $e->getFile(),
                    "code" => $e->getCode()
                ])
			);
		}
	}

	// funcion de renderizacion de json
	public function render_json( $json, $status = 200){
		http_response_code($status);
		die( json_encode($json) );
	}
}
