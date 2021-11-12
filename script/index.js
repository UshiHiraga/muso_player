const main_video = document.getElementById("main_video_element");


function LoadVideoFromFile(e){
    let file = this.files[0];
    console.log(file);

    let a = URL.createObjectURL(file);
    console.log(a);

    main_video.setAttribute("src", a);
}

function KeyboardEvents(e){
    if(e.keyCode == 102){
        main_video.requestFullscreen();
        console.log(main_video.__proto__);
    }
}

document.getElementById("load_video").addEventListener("change", LoadVideoFromFile);
window.document.addEventListener("keypress", KeyboardEvents);