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
    if(!main_video.isPlaying()) main_video.play();
    sig.classList.add("actual");
};

async function LoadVideoFromSystemFileMethod(launchParams){
    console.log("Archivos traidos desde el sistema.");
    let files = launchParams.files.map(async function(element){
        let inner_file = await element.getFile();
        console.log(inner_file);
        let new_url = URL.createObjectURL(inner_file);
        console.log(new_url);
        CreateCardElement(inner_file, new_url);
        return new_url;
    });

    // launchParams.files.forEach(async function(element){
    //     let inner_file = await element.getFile();
    //     let new_url = URL.createObjectURL(inner_file);
    //     CreateCardElement(inner_file, new_url);
    //     window.array_videos.push(new_url);

    // });

    let array_full = await Promise.allSettled(files);
    window.array_videos = array_full.map((e) => e.value);
    console.log(files);


    if(!main_video.getAttribute("src")){
        main_video.setAttribute("src", window.array_videos[0]);
        document.getElementsByClassName("card_element")[0].classList.add("actual");
    };
};

document.getElementById("open_video").addEventListener("change", LoadVideoFromFile);
document.body.addEventListener("keydown", KeyboardEvents);
main_video.addEventListener("ended", VideoEnded);
window.array_videos = [];
HTMLVideoElement.prototype.isPlaying = function(){
    if(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2) return true
    else return false;
};
if("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js");
if("launchQueue" in window) launchQueue.setConsumer(LoadVideoFromSystemFileMethod);