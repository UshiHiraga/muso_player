const main_video = document.getElementById("main_video_element");

function LoadVideoFromFile(e){
    if(!this.files) return false;
    Array.from(this.files).forEach(function(element){
        let new_url = URL.createObjectURL(element);
        CreateCardElement(element, new_url);
        window.array_videos.push(new_url);
    });

    if(!main_video.getAttribute("src")){
        main_video.setAttribute("src", window.array_videos[0]);
        document.getElementsByClassName("card_element")[0].classList.add("actual");
    };
};


function ChangeVideo(e){
    let video_url = e.target.getAttribute("video_url");
    document.querySelectorAll(".card_element").removeClass("actual");
    main_video.setAttribute("src", video_url);
    e.target.classList.add("actual");
    main_video.focus();
};

function CreateCardElement(info, video_url){
    let padre  = document.getElementById("cola_videos");
    let tarjeta = document.createElement("div");
    tarjeta.classList.add("card_element");
    tarjeta.setAttribute("video_url", video_url);
    tarjeta.addEventListener("click", ChangeVideo);
    tarjeta.innerText = info.name;
    padre.appendChild(tarjeta);
};

function InitLoad(){
    main_input.addEventListener("change", LoadVideoFromFile);
    main_input.click();
};

function KeyboardEvents(e){
    e.preventDefault();
    switch(e.code){
        case "KeyA": if(e.shiftKey && e.ctrlKey) document.getElementById("open_video").click(); break;
        case "KeyF":
            if(!document.fullscreenElement) main_video.requestFullscreen();
            else if(document.fullscreenElement == main_video) document.exitFullscreen();
            main_video.focus();
        break;
        case "KeyL":
            if(!e.ctrlKey) return false;
            if(main_video.isPlaying()) main_video.pause();
            VideoEnded();
        break;
        case "KeyJ":
            if(!e.ctrlKey) return false;
            if(main_video.isPlaying()) main_video.pause();
            VideoEnded("", true);
        break;
    };
};


function VideoEnded(e, prev){
    let actual = document.querySelector(".card_element.actual");
    let sig = !prev ? actual.nextElementSibling : actual.previousElementSibling;
    if(!sig) throw new Error("No hay más vídeos.");
    actual.classList.remove("actual");
    let video_url = sig.getAttribute("video_url");
    main_video.setAttribute("src", video_url);
    sig.classList.add("actual");
};

document.getElementById("open_video").addEventListener("change", LoadVideoFromFile);
document.body.addEventListener("keydown", KeyboardEvents);
main_video.addEventListener("ended", VideoEnded);
window.array_videos = [];

HTMLVideoElement.prototype.isPlaying = function(){
    if(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2) return true
    else return false;
};


if ("launchQueue" in window) {
    launchQueue.setConsumer(async launchParams => {
        console.log(launchParams);
    });
}