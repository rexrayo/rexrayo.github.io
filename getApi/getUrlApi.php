<?php

/* Libreria con una clase que se encargara de enviar y recibir la informacion desde la pagina permitiendo asi recibir los datos que se necesitan, y enviarlos cuando se necesita */
class getUrlApi{

	/* Funcion encargada de comunicar nuestro BackEnd con la API que necesitemos*/
	public function openCurl($url = "", $option = array(), $data = array()){

        #inicio de ejecucion
        $this->time['execStart'] = date('H:i:s');
        $this->uriExec = "http://190.216.252.250:8080/drotaca_soberano/app/mobile/{$url}";
        //$this->uriExec = "http://localhost/ERP/app/mobile/{$url}";
        
        # evaluando la GET que permiten hacer una busqueda de datos
        if( !empty($_GET["q"]) )
            $this->uriExec .= "&q=".urlencode($_GET["q"]);
        

        if( !empty($_GET["page"]) )
            $this->uriExec .= "&page={$_GET["page"]}";

        $openUrl = curl_init();
        curl_setopt($openUrl, CURLOPT_URL, $this->uriExec );
        curl_setopt($openUrl, CURLOPT_ENCODING, 'gzip, deflate');

        #si no es nulo el valor del array entonces inserta estos headers
        if (!empty($option['header'])){
        	curl_setopt($openUrl, CURLOPT_HEADER, $option['header']);
            curl_setopt($openUrl, CURLINFO_HEADER_OUT, $option['header']);
        }

        #si necesita autentificacion
        if( ( empty($option["auth_bool"]) ? false: $option['auth_bool'] ) == true){
            # Envia los parametros de los headers;
            curl_setopt($openUrl, CURLOPT_HTTPHEADER, $option['auth_headers']);
        }

        #opciones de la funcion curl
        $curl_opt = array(
            CURLOPT_AUTOREFERER    => true,
       	    CURLOPT_CONNECTTIMEOUT => 120,
            CURLOPT_TIMEOUT        => 120,
            CURLOPT_MAXREDIRS      => 100,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_RETURNTRANSFER => true
    	);

    	curl_setopt_array( $openUrl, $curl_opt );
        //curl_setopt($openUrl, CURLOPT_RETURNTRANSFER, true);

        if( !empty( $_SESSION["user"] ) ){
            curl_setopt($openUrl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
            curl_setopt($openUrl, CURLOPT_USERPWD, "{$_SESSION["user"]->user->user_name}:{$_SESSION["user"]->user->password}");
        }

        # no hice los diferentes metodos ya que lo que necesitavamos es solo el method POST
        if(isset($option["method"])){
            switch ($option["method"]) {
                case 'POST':
                    curl_setopt($openUrl, CURLOPT_POST, true);
                    curl_setopt($openUrl, CURLOPT_POSTFIELDS, $data);
                break;
                case "GET":
                    curl_setopt($openUrl, CURLOPT_HTTPGET, true);
                break;
                default:
                    curl_setopt($openUrl, CURLOPT_CUSTOMREQUEST, $option["method"]);
                    @curl_setopt($openUrl, CURLOPT_POSTFIELDS, $data);
                break;
            }
        }
        else
            curl_setopt($openUrl, CURLOPT_HTTPGET, true);


        $data_response = curl_exec($openUrl);

         # Solo si inicia cesion devuelve el string del servidor, sino solo sera un string vacio
        $this->dataResponse = !empty($data_response) ? $data_response : curl_strerror(curl_errno($openUrl));

        /* Contendra los datos al ejecutar las transferencia de la pagina */
        $this->status = curl_getinfo($openUrl, CURLINFO_HTTP_CODE);
        $this->error = curl_error($openUrl);

        # Hora del archivo, tiemo de la ultima ejecucion y ultima conexion
        $this->time['filetime'] = curl_getinfo($openUrl, CURLINFO_FILETIME);
        $this->time['execLast'] = curl_getinfo($openUrl, CURLINFO_TOTAL_TIME);
        $this->time['connect'] = curl_getinfo($openUrl, CURLINFO_CONNECT_TIME);

        curl_close($openUrl);

        #finalizacion del proceso de solicitud de la pagina
        $this->time['execEnd'] = date('H:i:s');
	}

	/* Funcion que devolvera los datos obtenidos del servidor cuando se deseen */
	public function getData(){
		return $this->dataResponse;
	}

    /* Funcion que permite insertar los datos que seran enviados */
    public function setDataSend($data = array()){
        # funcion encargada de contar la cantidad de datos enviados atraves de un array
        if(count($data) > 0)
            $this->dataToSend = $data;
        else
            return 0;
    }

    public function getHeaders(){
        return $this->headers;
    }

    protected $dataToSend; # datos a enviar
	private $time; # Contendra todos los datos de las tiempos al hacer la transferencia...
    public $status; # Esto contedra el codigo recibido al tratar de hacer una transferencia a la pagina 
	private $dataResponse;// Esta variable contendra los datos que se requieren.
    private $headers; // Contendra las cabezeras llegadas desde la pagina
}