export var idUsuarioActivo;
export var isUsuarioActivo;
export var idTipoUsuario;

idUsuarioActivo = {};

Object.defineProperty(idUsuarioActivo, 'idUsuario', {
  value: 0,
  writable: true
});

isUsuarioActivo = {};

Object.defineProperty(isUsuarioActivo, 'isActivo', {
  value: false,
  writable: true
});

idTipoUsuario = {};

Object.defineProperty(idTipoUsuario, 'idTipo', {
  value: 0,
  writable: true
});

        /*
        import * as variablesGlobales from "../global";

        
        console.log(variablesGlobales.isUsuarioActivo.isActivo);
        variablesGlobales.isUsuarioActivo.isActivo = true;
        console.log(variablesGlobales.isUsuarioActivo.isActivo);*/