//I have an array
let songHistory = [];
//let audio; // <-- make audio accessible everywhere*/
let visualizerStarted = false;

function addSongToHistory(name, url) {
    songHistory.push({ name, url });
    localStorage.setItem("songHistory", JSON.stringify(songHistory));
    renderSongHistory();
}

function renderSongHistory() {
    const container = document.getElementById('songHistory');
    container.innerHTML = "";

    songHistory.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = "song-item";

        if (song.url === null) {
            song.marked = true;
            item.classList.add("remove-file");
        } else {
            const checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.checked = song.marked;

            checkbox.onchange = () => {
                song.marked = checkbox.checked;
                item.classList.toggle('remove-file', song.marked);
                localStorage.setItem('songHistory', JSON.stringify(songHistory));
            }

            item.appendChild(checkbox);
        }
        
        const label = document.createElement('span');
        label.textContent = song.name;
        label.onclick = () => {
            if (!song.url) {
                //I couldn't get blob urls to load from previous sessions, so this is the best i can do
                alert("This song cannot be played because it was loaded in a previous session.");
                return;
            }

            audio.src = song.url;
            audio.load();
            audio.play();
        }

        
        item.appendChild(label);
        container.appendChild(item);
    });
}

//this function allows you to remove selected items from your history - they do load, but they can't play right now
removeSelected = document.getElementById('removeSelected')
if (removeSelected) {
    removeSelected.onclick = () => {
        songHistory = songHistory.filter(song => !song.marked);
        localStorage.setItem("songHistory", JSON.stringify(songHistory));
        renderSongHistory();
    }; 
}


let palette = [];

function buildGradient(ctx, HEIGHT) {
    //const gradient = ctx.createLinearGradient(0, 0, width, 0);
    const gradient = ctx.createLinearGradient(0, HEIGHT, 0, 0);

    palette.forEach((color, index) => {
        const stop = index / (palette.length - 1);
        gradient.addColorStop(stop, color);
    });

    return gradient;
}


async function getPalette() {
    //fetch: used to get colors for visualizer gradiant
    const res = await fetch("https://x-colors.yurace.pro/api/random?number=7");
    const data = await res.json();
    palette = data.map(c => c.hex);
}

    

window.onload = function () {
    var file = document.querySelector('#audioFile');
    var audio = document.querySelector('#audio');

    //songHistory: renders a list of previous songs
    songHistory = (JSON.parse(localStorage.getItem("songHistory")) || []).map(song => ({
        name: song.name,
        url: null,
        marked: song.marked || true
    }));
    renderSongHistory();

    

    file.onchange = async function() {
        await getPalette();

        var files = this.files;
        audio.src = URL.createObjectURL(files[0]);
        audio.load();
        audio.play();

        /*songHistory.push({
            name: files[0].name,
            url: fileURL,
            marked: false
        });*/
        addSongToHistory(files[0].name, audio.src);

        var context = new AudioContext();
        var src = context.createMediaElementSource(audio);
        var analyser = context.createAnalyser();

        var canvas = document.getElementById('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var ctx = canvas.getContext('2d');
        
        src.connect(analyser);
        analyser.connect(context.destination);

        analyser.fftSize = 256;

        var bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);

        var dataArray = new Uint8Array(bufferLength);

        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;

        var barWidth = (WIDTH / bufferLength) * 2.5;
        
        var barHeight;
        var x = 0;

        function renderFrame() {
            requestAnimationFrame(renderFrame);
            let gradient = buildGradient(ctx, HEIGHT);

            x = 0;
            analyser.getByteFrequencyData(dataArray);
            //console.log(ctx);
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            for (var i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] * 2;
                /*var r = barHeight + (25 * (i/bufferLength));
                var g = 250 * (i/bufferLength);
                var b = 50;
                ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";*/
                /*
                if (palette.length > 0) {
                    ctx.fillStyle = palette[i % palette.length];
                } else {
                    ctx.fillStyle = "#ffffff"; // fallback
                }
                */
                ctx.fillStyle = gradient;

                ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        }

        localStorage.setItem("songHistory", JSON.stringify(songHistory));
        renderSongHistory();

        renderFrame(ctx);
    }
}

getPalette()
console.log("Honestly, professor, I wasn't expecting there to be so many bugs with trying to boot up audio from localstorage. BlobURLs are tough to store, and working with audio is still kinda tough for me. The audio and visualizer works, and it fetches random colors, but I had to gut most of my indended localstorage functionality.")