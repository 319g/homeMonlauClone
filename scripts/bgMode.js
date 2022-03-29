"use strict";

const modToggle = document.getElementById("modToggle");
const body = document.querySelector("body");
const applications = document.querySelector(".applications");

const setStyle = ()=>{
    if(window.localStorage.getItem('bgMode') == 'light'){
        modToggle.checked = false;
        body.style.backgroundColor = '#ffffff';
        applications.style.color = '#000000';
    }else if(window.localStorage.getItem('bgMode') == 'dark'){
        modToggle.checked = true;
        body.style.backgroundColor = '#1e1e1e';
        applications.style.color = '#ffffff';
    }
}

modToggle.addEventListener("click", ()=>{
    if(modToggle.checked == true){
        window.localStorage.setItem('bgMode', 'dark');
        setStyle();
    }else{
        window.localStorage.setItem('bgMode', 'light');
        setStyle();
    }
});

if(window.localStorage.getItem('bgMode') == null){ //Establece un valor para bgMode si no se ha abierto anteriormente la pagina
    window.localStorage.setItem('bgMode', 'light');
}

setStyle();