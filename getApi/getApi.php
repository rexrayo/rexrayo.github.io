<?php

include("getUrlApi.php");

class getApi extends getUrlApi{
	
	#Esto permite connectar hacia la direccion de la pagina
	public function openApi($data = array()){
		$this->openCurl($this->uri, $this->config, $data);
		$this->setDataSend($data);
	}

	public function setUrl($uri_tmp = "")
	{
		#esto verifica que la variable no este vacia o tenga un valor nulo
		if(!empty($uri_tmp))
			$this->uri = $uri_tmp;
	}

	/* funcion encargada de dar las configuraciones 
	antes de intentar abrir la url de la */
	public function setConfig($dataConfig = array()){
		#esto verifica que la variable no este vacia o tenga un valor nulo
		if(!empty($dataConfig))
		{
			if(isset($dataConfig['uri']))
				$this->setUrl($dataConfig['uri']);
			if(isset($dataConfig['header']))
				$this->config['header'] = $dataConfig['header'];
			if(isset($dataConfig['auth_headers']))
				$this->config['auth_headers'] = $dataConfig['auth_headers'];
			if(isset($dataConfig['auth_bool']))
				$this->config['auth_bool'] = $dataConfig['auth_bool'];
			if( !empty( $dataConfig["method"] ) )
				$this->config["method"] = $dataConfig["method"];
		}
	}

	/* Obtienes todas las configuraciones que estan establecidad para 
	la direcion de la pagina */
	public function getCofing()
	{
		return $this->config;
	}

	/* Funcion encargada de obtener la respuesta del servidor */
	public function getDataResponse(){
		$this->data_response = $this->getData();
		return $this->data_response;
	}

	public function getJsonResponse(){
		$this->data_response = json_decode( $this->getData() );
		return $this->data_response;
	}

	/*  Funcion que se encarga de obtener los estatus de la pagina */
	public function getStatus(){
		return $this->status;	
	}
	
	private $uri;
	private $config;
	private $data_response;
}