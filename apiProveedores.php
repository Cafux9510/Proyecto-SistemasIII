<?php

class apiProveedores{

    function generarJsonProv($cuit,$nombre,$direccion,$localidad,$telefono,$email,$categoria){


        $data = array(
            "cuit_proveedor" => $cuit,
            "nombre_proveedor" => $nombre,
            "direccion_proveedor" => $direccion,
            "localidad_proveedor" => $localidad,
            "telefono_proveedor" => $telefono,
            "email_proveedor" => $email,
            "isHabilitado_proveedor" => true,  
            "categoria_proveedor" => $categoria           
        );
    
        $provJSON = json_encode($data);
    
        return $provJSON;
    
    }

}


?>

