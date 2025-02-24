console.log('Lets write JavaScript');

async function getsongs(){
    let a = await fetch("http://127.0.0.1:5500/song/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".m4a")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs

}
async function main(){
    // Get the list of all the song
    let songs = await getsongs()
    console.log(songs)

    let songUL =document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> ${songs.replaceAll(" ", "_")} </li>`;
    }
    //play the first song(".song")
    var audio = new Audio(songs[0]);
    audio.play();

    audio.addEventListener("loadedata", () => {
        console.log( audio.duration, audio.currentSrc, audio.currentTime);
        // console.log(duration)
        //The duration variable now holds the duration (in seconds) of the audio clip
    });
}   
main()
