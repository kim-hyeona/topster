

// 제목짓기
function prinTitle(){
    const titleInput = document.querySelector('#title') //input
    const btn = document.querySelector('.title_btn') //btn
    const title = document.querySelector('h2') // h2
    
    btn.addEventListener('click',event => {
        event.preventDefault();

        if(titleInput.value){
            title.innerText = titleInput.value
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
    const searchBtn = document.querySelector('.search_btn')

    searchBtn.addEventListener('click',event => {
        event.preventDefault();

        if(searchInput.value){
            title = searchInput.value
        }

        let url = `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${title}&api_key=7108708792074ac473a8d262368a6c78&format=json`
        fetch(url)
        .then((response) => response.json())
        .then((json) => {
            const div = document.querySelector('.album_search');
            let output = '';

            json.results.albummatches.album.forEach((albums) => {
            if (albums) {
                output += `
                    <li  draggable="true"><img id="album_img" src=${albums.image[2]['#text']}</li>
                `;
              }
            });
            div.innerHTML = output;
          })
        
        }) 
        




   /*  let url = `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${title}&api_key=7108708792074ac473a8d262368a6c78&format=json`
    fetch(url)
    .then((response) => response.json())
    .then((json) => {
        const album = json.results.albummatches.album;
        album.map((data) => {
            const div = document.querySelector('.album_search');
            div.innerHTML += `
            <li  draggable="true"><img id="album_img" src=${data.image[2]['#text']}></li>
        ` 
        })
    }) */
}

getAlbum()




//드래그 앤 드롭

const columns = document.querySelectorAll(".album_drg");
columns.forEach((column) => {
  new Sortable(column, {
    group: "shared",
    animation: 150,
    ghostClass: "blue-background-class"
  });
});


//셀 크기 조절 



function cellNumHandle(){
    const cellNum2 = document.querySelector(".album_box2")
    const cellNum3 = document.querySelector(".album_box3")
    const cellNum4 = document.querySelector(".album_box4")
    const cellInput = document.querySelector('.frame_num').value;


  
}

cellNumHandle()

