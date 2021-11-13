// Creado el 6 de noviembre del 2021.
// Modificiación el 12 de noviembre del 2021.
Storage.prototype.createItem = function(llave, datos) {
    const ubicacion = (this == localStorage) ? "localStorage" : "sessionStorage";
    try {
        let new_item = new StorageItem(ubicacion, llave, typeof(datos));
        new_item.writeValue(datos);
        return new_item;
    } catch(e) {
        throw e
    };
};

Storage.prototype.obtainItem = function(llave) {
    const ubicacion = (this == localStorage) ? "localStorage" : "sessionStorage";
    try{
        return new StorageItem(ubicacion, llave);
    } catch(e) {    
        throw e;
    };
};

class StorageItem {
    #version = "Enchantenmed 1.0.0";
    #innerMetadataPrefix = "^^[MetadataObject]";
    #innerDataPrefix = "^^[DataObject]";
    #flags = {
        tipoText: "^^[Texto]",
        tipoBoolean: "^^[Logic]",
        tipoNumber: "^^[Numro]",
        tipoJSON: "^^[JsonO]"
    };
    #defaultValues = {
        defaultText: "",
        defaultBoolean: false,
        defaultNumber: 0,
        defaultJSON: {}
    };
    #metadataFormat = {
        "versionObject": "ObjectEnchantemed 1.0.0",
        "createdTime": (new Date).getTime(),
        "lastModificationTime": null
    };


    #changeModificationTime(){
        let last_metadata = this.#readMetadataValue();
        last_metadata.lastModificationTime = (new Date).getTime();
        this.#writeMetadataValue(last_metadata);
    };

    #existItem(llave){
        const ubicacion = window[this.storageName];
        try {
            return (ubicacion[llave] == null ||ubicacion[llave] == undefined) ? false : true;
        } catch (e) {
            return false;
        };
    };

    #validateKey = function (llave) {
        if(typeof (llave) != "string") throw new Error("La llave debe ser de tipo String.");
        if(llave.length < 5) throw new Error("La llave es demasiado corta.");
        if(llave.length > 256) throw new Error("La llave es demasiado larga.")
        if(llave == "" && e.trim() == "") throw new Error("La llave está vacía.");

        const PATTERN = new RegExp(/^[A-Z]+$/i);
        if(!PATTERN.test(llave)) throw new Error("La llave solo puede contener letras (A - Z).");
        return true;
    };

    #initializateDefaultValue(tipo){
        let datos;
        switch(tipo){
            case "string": datos = this.#defaultValues.defaultText; break;
            case "number": datos = this.#defaultValues.defaultNumber; break;
            case "boolean": datos = this.#defaultValues.defaultBoolean; break;
            case "object": case "json": datos = this.#defaultValues.defaultJSON; break;
            default: throw new Error("El tipo de dato no es soportado.");
        };
        return datos;
    };
    
    #readMetadataValue(){
        const data_key = this.#innerMetadataPrefix + this.userKey; 
        try {
            const read_metadata = this.ubicacion[data_key]
            return JSON.parse(read_metadata);
        } catch(e) {
            throw e;
        };    
    };

    readValue(){
        const data_key = this.#innerDataPrefix + this.userKey; 
        let tipo = this.ubicacion[data_key].substring(0, 9);
        let dato_modified = this.ubicacion[data_key].replace(tipo, "");
        switch(tipo) {
            case this.#flags.tipoText: return dato_modified;
            case this.#flags.tipoNumber: return parseInt(dato_modified);
            case this.#flags.tipoBoolean: return new Boolean(dato_modified);
            case this.#flags.tipoJSON:
                try {
                    return JSON.parse(dato_modified);
                } catch (e) {
                    throw new Error(e);
                }
            break;
            default:
                throw new Error("El tipo del dato es desconocido.");
            break;
        };
    };

    writeValue(datos) {
        //Autodetecta el tipo;
        let setData = undefined;
        switch (typeof(datos)) {
            // Esto se hace con el fin de convertir los valores a texto y que no hayan problemas.
            case "string": setData = this.#flags.tipoText + datos; break;
            case "number": setData = this.#flags.tipoNumber + datos; break;
            case "boolean": setData = this.#flags.tipoBoolean + datos; break;
            case "object":
                try {
                    if(datos == null) throw new Error("Los valores nulos no están soportados.");
                    setData = this.#flags.tipoJSON + JSON.stringify(datos);
                } catch (e) {
                    console.error(e);
                };
            break;
            default: setData = undefined; break;
        };
        if (!setData) throw new Error("El tipo del dato no está soportado.");
        this.ubicacion[this.#innerDataPrefix + this.userKey] = setData;
        this.#changeModificationTime();
        return true;
    };

    #writeMetadataValue(metadata){
        if(typeof(metadata) != "object") throw new Error("Los metadatos no son tipo JSON");
        try {
            let save_data = JSON.stringify(metadata);
            this.ubicacion[this.#innerMetadataPrefix + this.userKey] = save_data;
        } catch(e){
            throw e;
        };
        return true;
    };

    deleteItem(){
        console.warn("Después de borrarlos, no habrá forma de recuperar los datos.");
        try {
            delete this.ubicacion[this.#innerDataPrefix + this.userKey];
            delete this.ubicacion[this.#innerMetadataPrefix + this.userKey];
            return true;
        } catch(e){
            throw(e);
        };
    };


    // Modifidores de valores.
    aumentarValor(){
        if(this.typeValue != "number") throw new Error("Este método sólo funciona en valores de tipo number.");
        let changer_value = (arguments[0]) ? arguments[0] : 1
        if(typeof(changer_value) != "number") throw new Error("El valor modificador no es un número.");

        let actual_number = this.readValue() + changer_value;
        this.writeValue(actual_number);
        return actual_number;
    };

    reducirValor(){
        if(this.typeValue != "number") throw new Error("Este método sólo funciona en valores de tipo number.");
        let changer_value = (arguments[0]) ? arguments[0] : 1
        if(typeof(changer_value) != "number") throw new Error("El valor modificador no es un número.");

        let actual_number = this.readValue() - changer_value;
        this.writeValue(actual_number);
        return actual_number;
    };

    get creationTime(){
        const metadata = this.#readMetadataValue();
        return metadata.createdTime;
    };

    get typeValue(){
        const data_key = this.#innerDataPrefix + this.userKey; 
        let tipo = this.ubicacion[data_key].substring(0, 9);
        switch(tipo) {
            case this.#flags.tipoText: return "string";
            case this.#flags.tipoNumber: return "number";
            case this.#flags.tipoBoolean: return "boolean" ;
            case this.#flags.tipoJSON:
                try {
                    return "object"
                } catch (e) {
                    throw new Error(e);
                }
            break;
            default:
                throw new Error("El tipo del dato es desconocido.");
            break;
        };
    }

    get lastModification(){
        const metadata = this.#readMetadataValue();
        return metadata.lastModificationTime;
    };

    get existenceTime(){
        return (this.lastModification - this.creationTime);
    };

    // Clase que crea un objeto en alguno de los almacenmientos y que puede ser administrado.
    constructor(place, key){
        this.#validateKey(key);
        this.storageName = place;
        this.userKey = key;
        this.ubicacion = window[place];

        if(!this.#existItem(this.#innerMetadataPrefix + this.userKey)){
            console.warn("No hay valores previos, se procede a crearlos.");
            if(!arguments[2]) throw new Error("No sabemos como inicializar el espacio.");

            const user_defined_type = arguments[2];
            const default_value_from_type = this.#initializateDefaultValue(user_defined_type);

            //Guardamos los metadatos y metadatos.
            this.#writeMetadataValue(this.#metadataFormat);
            this.writeValue(default_value_from_type);
        } else {
            if(arguments[2]) console.warn("El valor ya está inicializado.");
        };
    };
};