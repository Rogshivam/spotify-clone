let currentSong = new Audio();
let songs;
let currFolder;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    try {
        let res = await fetch(`${folder}/info.json`);
        let jsonRes = await res.json();

        songs = jsonRes.songs.map(track => `${folder}/${track}`);

        // Show all the songs in the playlist
        let songUL = document.querySelector(".songlist ul");
        songUL.innerHTML = "";
        for (const song of songs) {
            let songName = decodeURIComponent(song.split('/').pop());
            songUL.innerHTML += `
                <li>
                    <img class="invert" width="34" src="./images/music.svg" alt="">
                    <div class="info">
                        <div>${songName}</div>
                    </div>
                    <div class="playnow">
                        <span>Play Now</span>
                        <img class="invert" src="./images/play.svg" alt="">
                    </div>
                </li>`;
        }

        // Attach click events to each song
        document.querySelectorAll(".songlist li").forEach((e, i) => {
            e.addEventListener("click", () => {
                playMusic(songs[i]);
            });
        });

        return songs;

    } catch (error) {
        console.error(`Error loading songs from ${folder}:`, error);
        return [];
    }
}

// async function getSongs(folder) {
//     currFolder = folder;
//     let res = await fetch(`${folder}/info.json`);
//     let jsonRes = await res.json();
//     console.log(jsonRes)

//     songs = jsonRes.songs.map(track => `${folder}/${track}`);

//     //show all the songs in the playlist
//     let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
//     songUL.innerHTML = ""
//     for (const song of songs) {
//         // console.log(song.split('/').slice(4));

//         songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" width="34"  src="./images/music.svg" alt="">
//         <div class="info">
//         <div> ${song.split('/').slice(4)[0]} </div>
//         </div>
//         <div class ="playnow">
//         <span>Play Now</span>
//         <img class="invert" src="./images/play.svg" alt="">
//         </div> </li>`;
//         // console.log(song)
//     }
//     //Attach an event listener(jo sune mtlab dkaye)
//     Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
//         e.addEventListener("click", element => {
//             playMusic(`/${currFolder.split('/').slice(1).join('/')}/${e.querySelector(".info").firstElementChild.innerHTML.trim()}`)
//         })
//     })
//     return songs

// }

const playMusic = (track, pause = false) => {
    currentSong.src = track
    if (!pause) {
        currentSong.play()
        play.src = "./images/pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track.split('/').slice(2)[0])
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}

async function displayAlbums() {
    try {
        let res = await fetch("/api/albums");
        let albums = await res.json();

        let cardContainer = document.querySelector(".cardContainer");
        cardContainer.innerHTML = "";

        for (const album of albums) {
            const folder = album.folder;

            cardContainer.innerHTML += `
                <div data-folder="${folder}" class="card">
                    <div class="play">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                    <img src="/songs/${folder}/cover.jpg" alt="">
                    <h2>${album.title}</h2>
                    <p>${album.description}</p>
                </div>`;
        }

        // Attach event to play from album card
        document.querySelectorAll(".card").forEach(card => {
            card.addEventListener("click", async () => {
                const folder = card.dataset.folder;
                songs = await getSongs(`songs/${folder}`);
                if (songs.length > 0) playMusic(songs[0], true);
            });
        });

    } catch (error) {
        console.error("Failed to load albums:", error);
    }
}

// async function displayAlbums() {
//     let res = await fetch("api/albums");
//     let albums = await res.json();
//     console.log(albums)
//     let a = await fetch(`songs`)
//     let response = await a.text();
//     let div = document.createElement("div")
//     div.innerHTML = response;
//     let anchors = div.getElementsByTagName("a")
//     // let cardContainer = document.querySelector(".cardContainer")
//     // let array = Array.from(anchors)
//     // for (let index = 4; index < array.length; index++) {
//     //     const e = array[index].getAttribute('href');
//     //     if (e.includes("/songs", 0)) {

//     //         let folder = e.split("/").slice(-2)[1]
//     //         // console.log(folder)
//     //         // Get the metadata of the folder
//     //         let a = await fetch(`./songs/${folder}/info.json`)
//     //         let response = await a.json();
//     //         cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
//     //         <div class="play">
//     //             <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
//     //                 xmlns="http://www.w3.org/2000/svg">
//     //                 <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
//     //                     stroke-linejoin="round" />
//     //             </svg>
//     //         </div>

//     //         <img src="/./songs/${folder}/cover.jpg" alt="">
//     //         <h2>${response.title}</h2>
//     //         <p>${response.description}</p>
//     //     </div>`
//     //     }
//     // }

//     let cardContainer = document.querySelector(".cardContainer");

//     for (const album of albums) {
//         let folder = album.folder;

//         cardContainer.innerHTML += `
//         <div data-folder="${folder}" class="card">
//             <div class="play">
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
//                     xmlns="http://www.w3.org/2000/svg">
//                     <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
//                         stroke-linejoin="round" />
//                 </svg>
//             </div>
//             <img src="/songs/${folder}/cover.jpg" alt="">
//             <h2>${album.title}</h2>
//             <p>${album.description}</p>
//         </div>`;
//     }

//     // Load the playlist whenever card is clicked
//     Array.from(document.getElementsByClassName("card")).forEach(e => {
//         e.addEventListener("click", async item => {
//             songs = await getSongs(`./songs/${item.currentTarget.dataset.folder}`)
//             playMusic(songs[0], true)

//         })
//     })
// }


async function main() {
    // Get the list of all the song
    let albumRes = await fetch("/api/albums");
    let albumData = await albumRes.json();

    if (albumData.length > 0) {
        songs = await getSongs(`songs/${albumData[0].folder}`);
        if (songs.length > 0) playMusic(songs[0], true);
    }

    // Then show album cards
    displayAlbums();


    //add an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "./images/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "./images/play.svg"
        }
    })
    // listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    //ADD an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })
    //Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    //Add an event listner for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
    //Add an event listener to previous
    // previous.addEventListener("click", () => {
    //     currentSong.pause()
    //     console.log("Previous clicked: Index of current song: ", currentSong.src.split("/").slice(3), songs.indexOf('/' + currentSong.src.split("/").slice(7).join('/')))
    //     let index = songs.indexOf('/' + currentSong.src.split("/").slice(3).join('/'))
    //     if ((index - 1) >= 0) {
    //         console.log(songs[index - 1]);
    //         playMusic(songs[index - 1])
    //     }
    // })

    // //Add an event listener to next
    // next.addEventListener("click", () => {
    //     currentSong.pause()
    //     console.log("Forward clicked: Index of current song: ", songs.indexOf('/' + currentSong.src.split("/").slice(7).join('/')))
    //     let index = songs.indexOf('/' + currentSong.src.split("/").slice(3).join('/'))
    //     if ((index + 1) < songs.length) {
    //         console.log(songs[index + 1]);

    //         playMusic(songs[index + 1])
    //     }
    // })

    previous.addEventListener("click", () => {
        currentSong.pause();
        let currentSongPath = currentSong.src.split("/songs")[1];  // Get the path of the current song relative to `/songs`
        console.log("Previous clicked: Index of current song: ", currentSongPath);

        let index = songs.indexOf("songs" + currentSongPath.replaceAll('%20', ' '));

        if (index > 0) {
            // Play the previous song
            playMusic(songs[index - 1]);
        }
    });

    next.addEventListener("click", () => {
        currentSong.pause();
        let currentSongPath = currentSong.src.split("/songs")[1];  // Get the path of the current song relative to `/songs`
        console.log("Next clicked: Index of current song: ", currentSongPath);

        let index = songs.indexOf("songs" + currentSongPath.replaceAll('%20', ' '));
        if (index < songs.length - 1) {
            // Play the next song
            playMusic(songs[index + 1]);
        }
    });

    //Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting colume to", e.target.value, "/100")
        currentSong.volume = parseInt(e.target.value) / 100
    })
    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`./songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])

        })
    })
    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })

}
main()
