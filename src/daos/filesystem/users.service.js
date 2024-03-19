import { __dirname } from '../../utils.js';
import fileSystem from 'fs';

export default class UserService {
    #users;
    #dirPath;
    #filePath;
    #fileSystem;


    constructor() {
        this.#users = new Array();
        this.#dirPath = __dirname + '/files';
        this.#filePath = this.#dirPath + "/users.json";
        this.#fileSystem = fileSystem;
    }

    #prepararDirectorioBase = async () => {
        //Creamos el directorio
        await this.#fileSystem.promises.mkdir(this.#dirPath, { recursive: true });
        if (!this.#fileSystem.existsSync(this.#filePath)) {
            //Se crea el archivo vacio.
            await this.#fileSystem.promises.writeFile(this.#filePath, "[]");
        }
    }

    save = async (user) => {
        console.log("Guardar recurso:");
        console.log(user);
        user.id = Math.floor(Math.random() * 20000 + 1);
        try {
            await this.#prepararDirectorioBase();
            this.#users = await this.getAll();
            this.#users.push(user);
            //Se sobreescribe el archivos de usuarios para persistencia.
            await this.#fileSystem.promises.writeFile(this.#filePath, JSON.stringify(this.#users));
            return user;

        } catch (error) {
            console.error(`Error guardando recurso: ${error}`);
            throw Error(`Error guardando recurso: ${error}`);
        }
    }

    getAll = async () => {
        try {
            //Validamos que exista ya el archivo con usuarios sino se crea vacío para ingresar nuevos:
            await this.#prepararDirectorioBase();
            //leemos el archivo
            let data = await this.#fileSystem.promises.readFile(this.#filePath, "utf-8");
            console.log(data);
            this.#users = JSON.parse(data);
            console.log("Usuarios encontrados: ");
            console.log(this.#users);
            return this.#users;
        } catch (error) {
            console.error(`Error consultando los usuarios por archivo, valide el archivo: ${this.#dirPath}, 
                detalle del error: ${error}`);
            throw Error(`Error consultando los usuarios por archivo, valide el archivo: ${this.#dirPath},
             detalle del error: ${error}`);
        }
    }
};