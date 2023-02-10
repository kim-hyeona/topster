

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

/* let url = 'https://ws.audioscrobbler.com/2.0/?method=album.search&album=believe&api_key=7108708792074ac473a8d262368a6c78&format=json'
fetch(url).then(response => response.json())
.then(json => console.log(json))
.catch(error => console.log(error))
 */


/* let url = 'https://ws.audioscrobbler.com/2.0/?method=album.search&album=believe&api_key=7108708792074ac473a8d262368a6c78&format=json'
fetch(url).then(response => response.json())
.then(json => {
    let music = json
    let img = music.results.albummatches.album[0].image[3];
    console.log(img)
   
})
.catch(error => console.log(error))
 */

let url = 'https://ws.audioscrobbler.com/2.0/?method=album.search&album=believe&api_key=7108708792074ac473a8d262368a6c78&format=json'
fetch(url).then(response => response.json())
.then(json => {
    let music = json
    let img = music.results.albummatches.album;
    console.log(img)
})
.catch(error => console.log(error))


/* let music = response['resulte']['trackmatches']["track"];
for (let i=0; i < music.length; i++){
    let albumImg = music[i]['image'][0]["#text"]

    console.log(albumImg)
} */

