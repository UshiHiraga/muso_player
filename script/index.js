const main_video = document.getElementById("main_video_element");
const main_input = document.createElement("input");

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

function MainCreate(){
    main_input.setAttribute("type", "file");
    main_input.setAttribute("multiple", "");
    main_input.setAttribute("accept", "video/*");
}


function CreateCardElement(info){
    let a  = document.getElementById("cola_videos");
    let b = document.createElement("div");
    let c = new Date(info.lastModified);
    b.innerText = info.name + c.getMonth();
    a.appendChild(b);
    console.log(info);
}

function InitLoad(){
    main_input.addEventListener("change", LoadVideoFromFile);
    main_input.click();
}

function KeyboardEvents(e){
    e.preventDefault();
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
};

document.getElementById("open_video_button").addEventListener("click", InitLoad);
window.document.addEventListener("keypress", KeyboardEvents);
MainCreate();
// navigator.serviceWorker.register("sw.js");