icon.onclick = function(){
    document.body.classList.toggle("light-mode");
    clickSound.currentTime = 0;
    clickSound.play();
    if(document.body.classList.contains("light-mode")){
        icon.src= "icons/moon_111148.ico";
    }else{
        icon.src= "icons/summer_vacation_sun_sunlight_summer_heat_hot_icon_133429.ico";
    }
}