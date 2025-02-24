console.log('Lets write JavaScript');

async function getSongs(){
    let a = await fetch("http://127.0.0.1:5500/songs/")
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
const playMusic = (track) =>{
    let audio = new Audio("/songs/" + track)
    audio.play()
}
async function main(){

    let currentSong;
    // Get the list of all the song
    let songs = await getSongs()
    //show all the songs in the playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert"src="music.svg" alt="">
              <div class="info">
                <div> ${song.replaceAll("%20", " ")} </div>
                <div>shivam</div>
              </div>
              <div class ="playnow">
                <span>Play Now</span>
                <img class="invert" src="play.svg" alt="">
              </div> </li>`;
    }
    //Attach an event listener(jo sune mtlab dkaye)
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

}   
main()
