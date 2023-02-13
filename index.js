

// 제목짓기
function prinTitle(){
    const titleInput = document.querySelector('#title') //input
    const btn = document.querySelector('.title_btn') //btn
    const title = document.querySelector('h2') // h2
    
    btn.addEventListener('click',event => {
        event.preventDefault();

        if(titleInput.value){
            title.innerText = titleInput.value
        }else{
            alert('탑스터의 주제를 알려주세요!')
        }

        titleInput.value = '';
    })
}

prinTitle()


// 프레임 색상 바꾸기
function frameColor(e){
    const frame = document.querySelector("section") //section
    const black = document.querySelector('.radio_black')
    const pink = document.querySelector('.radio_pink')
    const skyblue = document.querySelector('.radio_skyblue')
    const gray = document.querySelector('.radio_gray')
    const green = document.querySelector('.radio_green')

    black.addEventListener('click',()=>{
        frame.style.backgroundColor="black"
    })

    pink.addEventListener('click',()=>{
        frame.style.backgroundColor="pink"
    })
    
    skyblue.addEventListener('click',()=>{
        frame.style.backgroundColor="skyblue"
    })

    gray.addEventListener('click',()=>{
        frame.style.backgroundColor="gray"
    })
    green.addEventListener('click',()=>{
        frame.style.backgroundColor="green"
    })

/*     const frame = document.querySelector("section") //section
    const frameInput = document.querySelectorAll('#chk') //input

   for(i=0; i<frameInput.length; i++){

    console.log(frameInput[i])
    frameInput[i].addEventListener('click', function(){
        switch(this.class){
            case "radio_pink":
                frame.class="pink"
            break;
            case "radio_white":
                frame.class="white"
            break;
            case "radio_gray":
                frame.class="gray"
            break;
            case "radio_blue":
                frame.class="blue"
            break;
            case "radio_green":
                frame.class="green"
            break;
        }
    })
   }
 */
}

frameColor();



// 앨범커버 검색기능

function getAlbum(){
    const searchInput = document.querySelector('.search_input')
    let title = searchInput.value;
    let url =   url =`https://ws.audioscrobbler.com/2.0/?method=album.search&album=${title}&api_key=7108708792074ac473a8d262368a6c78&format=json`
    
    fetch(url)
    .then((response) => response.json())
    .then((json) => {
        const album = json.results.albummatches.album;
        album.map((data) => {
            const div = document.querySelector('.album_search');
            div.innerHTML += `
            <li><img  draggable="true" 
            ondragstart="drag(event)" id="album_img" class='draggale' src=${data.image[2]['#text']}></li>
        ` 
        })
    })
}

getAlbum()




//드래그 앤 드롭

function dragEnter(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text"); 
    ev.target.appendChild(document.getElementById(data)); 
}

//셀 크기 조절 

const cellNum1 = document.querySelector(".album_box1")
const cellNum2 = document.querySelector(".album_box2")
const cellNum3 = document.querySelector(".album_box3")
const cellNum4 = document.querySelector(".album_box4")
const cellInput = document.querySelector('.frame_num')



