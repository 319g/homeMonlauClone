"use strict";

const modToggle = document.getElementById("modToggle");
const body = document.querySelector("body");
const aplications = document.querySelector(".aplications");


const setStyle = ()=>{
    if(window.localStorage.getItem('bgMode') == 'light'){
        body.style.backgroundColor = '#ffffff';
        aplications.style.color = '#000000';
    }else if(window.localStorage.getItem('bgMode') == 'dark'){
        body.style.backgroundColor= '#1e1e1e';
        aplications.style.color = '#ffffff';
    }
}

if(window.localStorage.getItem('bgMode') == null){
    window.localStorage.setItem('bgMode', 'light');
}

setStyle();

modToggle.addEventListener("click", ()=>{
    if(modToggle.checked == true){
        window.localStorage.setItem('bgMode', 'dark');
        setStyle();
    }else{
        window.localStorage.setItem('bgMode', 'light');
        setStyle();
    }
});