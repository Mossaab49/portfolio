const menu = document.getElementById("menu");
const action = document.getElementById("actions");

var icon = document.getElementById("icon");

menu.addEventListener("click", ()=>{
    hundlemenu();
})

function hundlemenu(){
    menu.classList.toggle("is-active");
    action.classList.toggle("is-active");
}


// icon.onclick = function(){
//     document.body.classList.toggle("light-mode");
//     clickSound.currentTime = 0;
//     clickSound.play();
//     if(document.body.classList.contains("light-mode")){
//         icon.src= "icons/moon_111148.ico";
//     }else{
//         icon.src= "icons/summer_vacation_sun_sunlight_summer_heat_hot_icon_133429.ico";
//     }
// }