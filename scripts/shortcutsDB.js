"use strict";

//------------------------------Abir/Crear DB---------------------------------

const request = indexedDB.open("DBShortcuts", 1);

request.addEventListener("upgradeneeded", ()=>{
    const db = request.result;
    db.createObjectStore("shortcut",{keyPath: "sname"}); //La pk va a ser el nombre
    console.log("DBshortcuts created successfully");
});

request.addEventListener("success", ()=>{
    console.log("DBshortcuts open successfully");
    try{
        getShortcut();
    }catch(e){
        console.log("No hay ningun atajo personalizado guardado");
    }
});

request.addEventListener("error", ()=>{
    console.log("Unexpected error, cannot open the DBshortcuts");
});

//------------------------------Añadir campo---------------------------------

const saveShortcut = (url, name, img)=>{
    const db = request.result;
    const IDBTransaction = db.transaction("shortcut", "readwrite");
    const objectStore = IDBTransaction.objectStore("shortcut");

    objectStore.add({
        "sname": name,
        "surl": url,
        "simg": img
    });

    IDBTransaction.addEventListener("complete", ()=>{
        console.log("Shorcut added");
    });
}

//------------------------------Sacar campos de la DB---------------------------------

const getShortcut = ()=>{
    const db = request.result;
    const IDBTransaction = db.transaction("shortcut", "readonly");
    const objectStore = IDBTransaction.objectStore("shortcut");
    const cursor = objectStore.openCursor();
    const fragment = document.createDocumentFragment();

    cursor.addEventListener("success", ()=>{
        if(cursor.result){
            let aplication = shortcutHTML(cursor.result.key, cursor.result.value);
            console.log(cursor.result.value);
            fragment.appendChild(aplication);
            cursor.result.continue();
        }else{
            document.querySelector(".aplications").appendChild(fragment);
        }
    });
}

//------------------------------Eliminar campos de la DB---------------------------------

const deleteShortcut = (name)=>{
    try{
        const db = request.result;
        const IDBTransaction = db.transaction("shortcut", "readwrite");
        IDBTransaction.objectStore("shortcut").delete(name);
    }catch(e){
        console.log("Eliminacion cancelada");
    }   
}

//------------------------------Insercion HTML---------------------------------

const shortcutHTML = (id, shortcut)=>{
    const div = document.createElement("DIV");
    const a = document.createElement("A");
    const img = document.createElement("IMG");
    const p = document.createElement("P");

    a.setAttribute('target', "_blank");
    a.setAttribute('href', shortcut["surl"]);
    img.setAttribute('src', shortcut["simg"]);
    p.textContent = shortcut["sname"];

    div.classList.add("aplication-item");
    
    a.appendChild(img);
    div.appendChild(a);
    div.appendChild(p);

    return div;
}

//------------------------------Entrada del usuario---------------------------------

const addButton = document.getElementById("addAplications");

addButton.addEventListener("click", ()=>{
    let url = prompt("Añade la URL");
    let name = prompt("Pon el nombre");
    let img = prompt("Añade una imagen");

    if(url != "" || name != "" || img != ""){
        saveShortcut(url, name, img);
        
        updateAplications();
    }else{
        alert("Datos no válidos");
    }
});

//------------------------------Eliminacion del usuario---------------------------------

const deleteAplications = document.getElementById("deleteAplications");

deleteAplications.addEventListener("click", ()=>{
    let name = prompt("Pon el nombre del atajo a eliminar");

    deleteShortcut(name);

    updateAplications();
});

//------------------------------Actualizar DIV aplications---------------------------------

const updateAplications = ()=>{
    document.querySelector(".aplications").innerHTML.reload;
}

