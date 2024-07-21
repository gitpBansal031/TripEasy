let count=0;
let toggleSwitch = document.querySelector("#flexSwitchCheckDefault");
toggleSwitch.addEventListener("click", () => {
    let taxSwitchOff=document.querySelectorAll(".taxSwitch-off");
    let taxSwitchOn=document.querySelectorAll(".taxSwitch-on");
    if(count==0){
        for(info of taxSwitchOff){
            info.style.display='none';
        }
        for(info of taxSwitchOn){
            info.style.display='inline';
        }
        count=1;
    }else{
        for(info of taxSwitchOff){
            info.style.display='inline';
        }
        for(info of taxSwitchOn){
            info.style.display='none';
        }
        count=0;
    }
})