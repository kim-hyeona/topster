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





function musicApi(){
    axios.get('https://ws.audioscrobbler.com/2.0/?method=album.search&album=believe&api_key=d9d404f783c734f98e7c86aba99984ee&format=json')
		.then(res => res.data)
        .then(data => console.log(data));
}


/* Application name	topster
API key	d9d404f783c734f98e7c86aba99984ee
Shared secret	d8824e0b67152e38cc11392215916a87
Registered to	kimha9 */