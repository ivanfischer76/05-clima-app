/*
 * Documentación de axios:
 * https://www.npmjs.com/package/axios
 * Documentación de inquirer
 * https://www.npmjs.com/package/inquirer
 * Documentación de colors
 * https://www.npmjs.com/package/colors
 * API mapbox
 * https://www.mapbox.com/
 * https://docs.mapbox.com/api/search/geocoding/
 * Documentación dotenv
 * https://www.npmjs.com/package/dotenv
 * 
 */

require('dotenv').config();

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");



console.clear();
//console.log(process.env.MAPBOX_KEY);
const main = async() => {
    const busquedas = new Busquedas();

    let opt = 0;

    do {
        //imprimir el menú
        opt = await inquirerMenu();
        switch (opt) {
            case 1:  //buscar ciudad
                // Mostrar mensaje
                const termino = await leerInput('Ciudad: ');

                //Buscar los lugares
                const lugares = await busquedas.ciudad(termino);
                
                //Seleccionar el lugar
                const id = await listarLugares(lugares);
                if(id === '0') continue;
                const lugarSel = lugares.find(l => l.id === id);
                busquedas.agreagarHistorial(lugarSel.nombre);
                
                //clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);
                
                //mostrar los resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.brightGreen);
                console.log('Ciudad: '.green.bold, `${lugarSel.nombre}`.brightWhite);
                console.log('Latitud: '.green.bold, lugarSel.lat);
                console.log('Longitud'.green.bold, lugarSel.lng);
                console.log('Clima: '.green.bold, `${clima.desc}`.brightBlue);
                console.log('Temperatura: '.green.bold, clima.temp);
                console.log('Máxima: '.green.bold, clima.max);
                console.log('Mínima: '.green.bold, clima.min);
                
            break;
            case 2: //mostrar historial
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i +1}.`.green;
                    console.log(`${idx} ${lugar}`);
                });
            break;
            case 0: //salir
                console.clear();
            break;
        }

        if( opt !== 0) { 
            await pausa();
        }
    } while(opt !== 0);
}

main();