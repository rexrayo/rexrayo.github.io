<?php

# Libreria estando de todos los controladores
include_once "BaseCtrl.php";

class Inventory extends BaseCtrl {

    # funcion que se encarga de hacer la busqueda de datos
    # relacionados a los grupos de ventas
    public function group_sales(){
        $response = new getApi;
        $response->setConfig(["uri" => "Inventory.php?call=group_sales", "method" => "POST"]);
		$response->openApi($this->params);
		$this->render_json( $response->getJsonResponse(), $response->getStatus() );
    }

    # funcion que se encarga de la muestra de los productos
    # determinando para el la relacion de busqueda
    public function products(){
        $response = new getApi;
        $response->setConfig(["uri" => "Inventory.php?call=products", "method" => "POST"]);
		$response->openApi($this->params);
		$this->render_json( $response->getJsonResponse(), $response->getStatus() );
    }

    # funcion que se encarga de la muestra de los productos
    # determinando para el la relacion de busqueda
    public function products_graphics(){
        $response = new getApi;
        $response->setConfig(["uri" => "Inventory.php?call=products_graphics", "method" => "POST"]);
		$response->openApi($this->params);
		$this->render_json( $response->getJsonResponse(), $response->getStatus() );
    }
}

new Inventory;