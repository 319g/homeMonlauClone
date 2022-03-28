"use strict";

//------------------------------Funciones de DB---------------------------------

const request = indexedDB.open("DBShortcuts", 1);

request.addEventListener("upgradeneeded", ()=>{
    const db = request.result;
    db.createObjectStore("shortcut",{
        autoIncrement: true
    });
    console.log("DBshortcuts created successfully");
});

request.addEventListener("success", ()=>{
    console.log("DBshortcuts open successfully");
});

request.addEventListener("error", ()=>{
    console.log("Unexpected error, cannot open the DBshortcuts");
});

const saveShortcut = (url, name, img)=>{ //anadir shortcut
    const db = request.result;
    const IDBTransaction = db.transaction("shortcut", "readwrite");
    const objectStore = IDBTransaction.objectStore("shortcut");

    objectStore.add({
        /*"url": "https://www.google.com",
        "name": "google",
        "img": "https://1000marcas.net/wp-content/uploads/2020/02/logo-Google.png"*/
        "surl": url,
        "sname": name,
        "simg": img
    });

    IDBTransaction.addEventListener("complete", ()=>{
        console.log("Shorcut added");
    });
}

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

//------------------------------Entradas del usuario---------------------------------

const addButton = document.getElementById("addAplications");

addButton.addEventListener("click", ()=>{
    let url = prompt("Añade la URL");
    let name = prompt("Pon el nombre");
    let img = prompt("Añade una imagen");

    if(url != "" || name != "" || img != ""){
        saveShortcut(url, name, img);
    }else{
        alert("Datos no válidos");
    }
});