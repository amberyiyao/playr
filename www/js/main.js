if ("cordova" in window) {
    document.addEventListener("deviceready", init);
} else {
    document.addEventListener("DOMContentLoaded", init);
}

let myMedia = null;
let index;
let time;
let vol = 1;

let musics = [{
        id: 1,
        title: "I Dare You",
        artist: "Bea Miller",
        time: "03:26",
        file: "file:///android_asset/www/media/BeaMiller-IDareYou.mp3",
        img: "img/musiclogo.png"
    },
    {
        id: 2,
        title: "I'm the One",
        artist: "DJ Khaled",
        time: "04:48",
        file: "file:///android_asset/www/media/DJKhaled-I'mtheOne.mp3",
        img: "img/musiclogo.png"
    },
    {
        id: 3,
        title: "Galway Girl",
        artist: "Ed Sheeran",
        time: "02:50",
        file: "file:///android_asset/www/media/EdSheeran-GalwayGirl.mp3",
        img: "img/musiclogo.png"
    },
    {
        id: 4,
        title: "Love Yourself",
        artist: "Justin Bieber",
        time: "03:53",
        file: "file:///android_asset/www/media/JustinBieber-LoveYourself.mp3",
        img: "img/musiclogo.png"
    }
]

let app = {
    yes: function () {
        console.log("playAudio Success");
    },
    no: function (error) {
        console.log("playAudio Error: " + error.message);
    }
}

function init() {
    console.log(myMedia);
    addeventlisteners();
    getMusics();

}

function addeventlisteners() {
    document.querySelector('footer span').addEventListener('click', openPlayer);
    document.getElementById('footerTitle').addEventListener('click', openPlayer);
    document.querySelector('#playerHeader span').addEventListener('click', closePlayer);
    playerSetting();
}

function playerSetting() {
    let playerList = {
        play: function () {
            if (myMedia) {
                document.querySelector('.play').classList.add('hidden');
                document.querySelector('.pause').classList.remove('hidden');

                document.querySelector('#footerPlay').classList.add('hidden');
                document.querySelector('#footerPause').classList.remove('hidden');
                document.querySelector('.rotate').style.animationPlayState = 'running';
                myMedia.play();
                myMedia.setVolume(vol);
            }
        },
        pause: function () {
            if (myMedia) {

                document.querySelector('.play').classList.remove('hidden');
                document.querySelector('.pause').classList.add('hidden');

                document.querySelector('#footerPlay').classList.remove('hidden');
                document.querySelector('#footerPause').classList.add('hidden');
                document.querySelector('.rotate').style.animationPlayState = "paused"; //http://www.w3school.com.cn/cssref/pr_animation-play-state.asp
                myMedia.pause();
            }
        },
        next: function () {
            if (myMedia) {
                myMedia.stop();
                myMedia.release();
                if (index == musics.length - 1) {
                    index = 0;
                } else {
                    index++;
                }
                time = musics[index].time;
                document.getElementById('fullTime').textContent = musics[index].time;

                let src = musics[index].file;

                document.querySelector('.play').classList.add('hidden');
                document.querySelector('.pause').classList.remove('hidden');
                document.querySelector('#footerPlay').classList.add('hidden');
                document.querySelector('#footerPause').classList.remove('hidden');
                document.getElementById('overlay').classList.remove('rotate');
                document.getElementById('overlay').classList.add('rotate');
                document.querySelector('.rotate').style.animationPlayState = 'running';

                myMedia = new Media(src, app.yes, app.no);

                myMedia.play();
                myMedia.setVolume(vol);
                document.getElementById('footerTitle').textContent = musics[index].title + ' - ' + musics[index].artist;
                document.getElementById('playerTitle').textContent = musics[index].title;
                document.getElementById('playerArtist').textContent = musics[index].artist;
            }
        },
        last: function () {
            if (myMedia) {
                myMedia.stop();
                myMedia.release();
                if (index == 0) {
                    index = musics.length - 1;
                } else {
                    index--;
                }

                time = musics[index].time;
                document.getElementById('fullTime').textContent = time;
                document.querySelector('.play').classList.add('hidden');
                document.querySelector('.pause').classList.remove('hidden');
                document.querySelector('#footerPlay').classList.add('hidden');
                document.querySelector('#footerPause').classList.remove('hidden');
                document.getElementById('overlay').classList.remove('rotate');
                document.getElementById('overlay').classList.add('rotate');
                document.querySelector('.rotate').style.animationPlayState = 'running';

                let src = musics[index].file;

                myMedia = new Media(src, app.yes, app.no);

                myMedia.play();
                myMedia.setVolume(vol);
                document.getElementById('footerTitle').textContent = musics[index].title + ' - ' + musics[index].artist;
                document.getElementById('playerTitle').textContent = musics[index].title;
                document.getElementById('playerArtist').textContent = musics[index].artist;
            }
        },
        seek: function (ev) {
            let fullTime = myMedia.getDuration();
            let posX = ev.clientX;
            let targetLeft = ev.currentTarget.offsetLeft; //https://blog.csdn.net/weixin_42839080/article/details/81612094
            let fullWidth = ev.currentTarget.offsetWidth;
            let percentage = (posX - targetLeft) / fullWidth;
            document.querySelector('.progressbar').style.width = percentage * 100 + '%';
            let targetTime = Math.floor(fullTime * percentage);
            myMedia.seekTo(parseInt(targetTime * 1000));
        },
        vp: function () {
            vol += 0.1;
            if (vol > 1) {
                vol = 1.0;
            }
            myMedia.setVolume(vol);
        },
        vm: function () {
            vol -= 0.1;
            if (vol < 0) {
                vol = 0;
            }
            myMedia.setVolume(vol);
        }
    }

    document.querySelector('.play').addEventListener('click', playerList.play);
    document.querySelector('.pause').addEventListener('click', playerList.pause);
    document.querySelector('#footerPlay').addEventListener('click', playerList.play);
    document.querySelector('#footerPause').addEventListener('click', playerList.pause);
    document.getElementById('next').addEventListener('click', playerList.next);
    document.getElementById('last').addEventListener('click', playerList.last);
    document.querySelector(".basebar").addEventListener('click', playerList.seek);
    document.getElementById('volPlus').addEventListener('click', playerList.vp);
    document.getElementById('volMin').addEventListener('click', playerList.vm);

}

function closePlayer() {
    document.querySelector('header').classList.remove('hidden');
    document.querySelector('footer').classList.remove('hidden');
    document.querySelector('#playList').classList.remove('hidden');
    document.getElementById('bigPlayer').classList.add('hide');
    setTimeout(() => {
        document.getElementById('bigPlayer').classList.add('hidden');
    }, 500);
}

function openPlayer() {
    document.getElementById('bigPlayer').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('bigPlayer').classList.remove('hide');
    }, 50);

    setTimeout(() => {
        document.querySelector('header').classList.add('hidden');
        document.querySelector('footer').classList.add('hidden');
        document.querySelector('#playList').classList.add('hidden');
    }, 250);
}

function getMusics() {
    let content = document.getElementById('playList');
    content.innerHTML = '';

    let documentFragment = new DocumentFragment();

    for (let i = 0; i < musics.length; i++) {
        let music = musics[i];
        documentFragment.appendChild(createList(music));
    }

    content.appendChild(documentFragment);

}

function createList(music) {
    let documentFragment = new DocumentFragment();

    let musicCard = document.createElement('div');
    let imgSection = document.createElement('section');
    let img = document.createElement('img');
    let titleDiv = document.createElement('div');
    let title = document.createElement('p');
    let artist = document.createElement('p');
    let time = document.createElement('div');

    title.textContent = music.title;
    artist.textContent = music.artist;
    time.textContent = music.time;

    musicCard.className = 'musicCard';
    title.className = 'title';
    artist.className = 'artist';
    time.className = 'time';

    let n = musics.findIndex(item => music.id === item.id);

    musicCard.setAttribute('data-uri', music.file);
    musicCard.setAttribute('data-index', n);
    musicCard.setAttribute('data-time', music.time);
    img.src = music.img;

    imgSection.appendChild(img);
    titleDiv.appendChild(title);
    titleDiv.appendChild(artist);
    musicCard.appendChild(imgSection);
    musicCard.appendChild(titleDiv);
    musicCard.appendChild(time);

    musicCard.addEventListener('click', playMusic);

    documentFragment.appendChild(musicCard);

    return documentFragment;
}

function playMusic(ev) {

    document.getElementById('overlay').classList.remove('rotate');

    if (myMedia != null) {
        myMedia.stop();
        myMedia.release();
        myMedia = null;
    }

    document.querySelector('.play').classList.add('hidden');
    document.querySelector('.pause').classList.remove('hidden');
    document.querySelector('#footerPlay').classList.add('hidden');
    document.querySelector('#footerPause').classList.remove('hidden');
    document.getElementById('overlay').classList.add('rotate');

    time = ev.currentTarget.getAttribute("data-time");
    document.getElementById('fullTime').textContent = time;
    index = ev.currentTarget.getAttribute("data-index");

    document.getElementById('footerTitle').textContent = musics[index].title + ' - ' + musics[index].artist;

    document.getElementById('playerTitle').textContent = musics[index].title;
    document.getElementById('playerArtist').textContent = musics[index].artist;

    let src = ev.currentTarget.getAttribute("data-uri");

    myMedia = new Media(src, app.yes, app.no);

    myMedia.play();
    myMedia.setVolume(vol);
    checkTime();
    openPlayer();
}

function checkTime() {

    let mediaTimer = setInterval(() => {
        let fullTime = myMedia.getDuration();
        myMedia.getCurrentPosition(
            // success callback
            function (position) {
                let length = position / fullTime * 100;
                document.querySelector('.progressbar').style.width = length + '%';

                if (position == -0.001) {
                    document.getElementById('next').dispatchEvent(new MouseEvent('click'));
                }
            },
            // error callback
            function (e) {
                console.log("Error getting pos=" + e.message);
            }
        );
    }, 500);
}
