const main_video = document.getElementById("main_video_element");


function LoadVideoFromFile(e){
    window.array_videos = [];
    Array.from(this.files).forEach(function(element){
        let new_url = URL.createObjectURL(element);
        CreateCardElement(element);
        window.array_videos.push(new_url);
    });

    console.log(this.files);
    if(window.array_videos.lenght == 0) throw new Error();
    if(!main_video.playsInline) main_video.setAttribute("src", window.array_videos[0]);
};



function CreateCardElement(info){
    let a  = document.getElementById("cola_videos");
    let b = document.createElement("div");
    let c = new Date(info.lastModified);
    b.innerText = info.name + c.getMonth();
    a.appendChild(b);
    console.log(info);
}

function KeyboardEvents(e){
    console.log(e);
    switch(e.code){
        case "KeyA": if(e.shiftKey && e.ctrlKey) document.getElementById("load_video").click(); break;
        case "KeyF":
            if(!document.fullscreenElement) main_video.requestFullscreen();
            else if(document.fullscreenElement == main_video) document.exitFullscreen();
        break;
        case "Space":
            if(main_video.paused) main_video.play();
            else main_video.pause();
        break;
    };
}

document.getElementById("load_video").addEventListener("change", LoadVideoFromFile);
window.document.addEventListener("keypress", KeyboardEvents);
navigator.serviceWorker.register("sw.js");