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
        location.reload();
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
            let application = shortcutHTML(cursor.result.key, cursor.result.value);
            console.log(cursor.result.value);
            fragment.appendChild(application);
            cursor.result.continue();
        }else{
            document.querySelector(".applications").appendChild(fragment);
        }
    });
}

//------------------------------Insercion HTML---------------------------------

const shortcutHTML = (id, shortcut)=>{
    const div = document.createElement("DIV");
    const a = document.createElement("A");
    const img = document.createElement("IMG");
    const p = document.createElement("P");
    const i = document.createElement("I");

    a.setAttribute('target', "_blank");
    a.setAttribute('href', shortcut["surl"]);
    img.setAttribute('src', shortcut["simg"]);
    p.textContent = shortcut["sname"];
    i.setAttribute('id', shortcut["sname"]);
    i.setAttribute('onclick', "deleteShortcut(this.id)");

    div.classList.add("application-item");
    i.classList.add("fa-solid");
    i.classList.add("fa-xmark");
    
    a.appendChild(img);
    div.append(i);
    div.appendChild(a);
    div.appendChild(p);

    return div;
}

//------------------------------Eliminar campos de la DB---------------------------------

const deleteShortcut = (name)=>{
    try{
        const db = request.result;
        const IDBTransaction = db.transaction("shortcut", "readwrite");
        IDBTransaction.objectStore("shortcut").delete(name);

        location.reload();
    }catch(e){
        console.log("Eliminacion cancelada");
    }   
}

//------------------------------Mostrar u ocultar el formulario para guardar atajo---------------------------------

const addButton = document.getElementById("addapplications");

addButton.addEventListener("click", ()=>{
    const popupForm = document.getElementById("popupForm");

    popupForm.style.display = "flex";
});

const closeForm = document.getElementById("closeForm");

closeForm.addEventListener("click", ()=>{
    const popupForm = document.getElementById("popupForm");

    popupForm.style.display = "none";
});

//------------------------------Entrada del usuario---------------------------------

const saveButton = document.getElementById("saveButton");

saveButton.addEventListener("click", ()=>{
    let url = document.getElementById("surl").value;
    let name = document.getElementById("sname").value;
    let img = document.getElementById("simg").value;

    if(img == ""){
        img = "img/notFound.png";
    }
    console.log(url);
    if(url != "" && name != "" && img != ""){
        if(url.charAt(0) != "h" && url.charAt(1) != "t"){
            url = "http://" + url;
        }

        saveShortcut(url, name, img);
    }else{
        alert("Datos no válidos");
    }
});