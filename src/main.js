wrapper()

function wrapper(){
    'use strict';

let scores= 0;
let bonus=1;
let colors= ["blue","green", "orange", "pink", "violet"];
let animations= ['scaling','rotating','blinking']
let timerStatus;
let gameSound= new Audio("./src/sound.mp3")
let clickSound= new Audio("./src/click.wav")

const main= document.querySelector('.main');``

startScreen()



function startScreen(){
    
    let startScreen= document.querySelector('.start_screen')
    startScreen.style.display='block'
    startScreen.addEventListener('click',()=>{
       
        startScreen.style.display='none'
        gameSound.play()
        clickSound.play()

        let tic=0
        let animationSound= setInterval(() => {
            if(tic===1)clearInterval(animationSound)
            clickSound.play()
            tic++
        }, 1000);
       
        startAnimation()
        setTimeout(()=>{    
            startGame();
            startTimer();
        },3000)
    })
    main.insertAdjacentElement('afterbegin', startScreen)
}

function startAnimation(){
    let animationScreen= document.querySelector('.start_animation')
    animationScreen.style.display='block'
    setTimeout(()=>{    
    animationScreen.style.display='none'
    },3000)
}

function startTimer(){
    let timerPlace= document.querySelector('.timer')
    let seconds=60;
        let timer= setInterval(()=>{
            let addZero= ''||(seconds<11)?'0':''
            seconds--
            timerPlace.innerText= `00:${addZero}${seconds}`;
            if(seconds===0){
                clearInterval(timer)
                timerStatus='timeout'
            }
        },1000)
}

function startGame(level=1){

renderLevel(level)
renderScoreBar(level);

}

function renderScoreBar(level){
    let ScorePlace= document.querySelector('.score');
    let levelPlace= document.querySelector('.level');
    let bonusPlace= document.querySelector('.bonus');
    let bonusImgPlace= document.querySelector('.bonus_img_wrapper');
    
    ScorePlace.innerText= scores;
    levelPlace.innerText= `${level}-9`;
    bonusPlace.innerText= `x${bonus}`;
    let prevImgBonus=document.querySelector('.bonus_img');
   if(prevImgBonus)bonusImgPlace.removeChild(prevImgBonus);
    bonusImgPlace.insertAdjacentHTML('afterbegin',`<img class="bonus_img" src="./src/img/bonus${bonus}.svg" alt="bonus image">`)

}

function getFindNumber(level){
    switch (level){
        case 1:
            return getRandomNumber(1,9);
            break;
        case 2:
            return getRandomNumber(10,99);
            break;
        case 3:case 4:case 5:
            return getRandomNumber(100,999);
            break;
        default:
            return getRandomNumber(1000,9999);
    }
}

function renderLevel(level){
   
    let findNumber= getFindNumber(level);
    let findArray= getFindArray(findNumber,level)

    main.classList.add(colors[getRandomNumber(0,4)])

    let game= document.createElement('div')
    game.classList.add('game')
    main.insertAdjacentElement('beforeend',game)
    

   const askNumberHeader= document.createElement('div');
   askNumberHeader.classList.add('ask_number_header');
   askNumberHeader.innerText= "Найдите указанное число:";
    game.insertAdjacentElement('beforeend',askNumberHeader);

   let askNumber= document.createElement('div');
   askNumber.classList.add('ask_number','move_cells');
   
   askNumber.innerText= findNumber;
   askNumberHeader.insertAdjacentElement("beforeend", askNumber)

   let answerNumberWrapper= document.createElement('div')
   answerNumberWrapper.classList.add("answer_number_wrapper","move_cells")
   game.insertAdjacentElement('beforeend',answerNumberWrapper)

   for(let i=0;i<findArray.length;i++){
       let answerBox= document.createElement('div');
       answerBox.classList.add('answer_box',colors[getRandomNumber(0,4)]);
    answerBox.insertAdjacentHTML('beforeend',`<div class='answer_cell'>${findArray[i]}</div>`)
    answerNumberWrapper.insertAdjacentElement('beforeend',answerBox)
    additionalProperties(answerBox,level)
       answerBox.addEventListener('click',(e)=>{
           clickHandle(+e.target.innerText,findNumber,level)
       })
   }
   appearAnimation()

}

function appearAnimation(){
    let animationsCells= document.querySelectorAll('.move_cells')
    animationsCells.forEach((cellForAnimation)=>{
        cellForAnimation.classList.add('move_left_appear')
        setTimeout(()=>{cellForAnimation.classList.remove('move_left_appear')},1000)
    })
}

function disAppearAnimation(){
    let animationsCells= document.querySelectorAll('.move_cells')
    animationsCells.forEach((cellForAnimation)=>{
    cellForAnimation.classList.add('move_left_disappear')
    })
}

function additionalProperties(currentElement, level){
    if(level < 3){
        currentElement.classList.add('six_elements')
    } else if(level===3){
        let number= getRandomNumber(0,2)
        currentElement.classList.add('six_elements',animations[number])
    } else if(level >= 4 && level < 8){
        currentElement.classList.add('twelve_elements')
        let number= getRandomNumber(0,2)
        currentElement.classList.add('six_elements',animations[number])
    } else if(level >= 8){
        currentElement.classList.add('twentyfive_elements')
        let number= getRandomNumber(0,2)
        currentElement.classList.add('six_elements',animations[number])
    }
}

function clearLevel(){
    const game= document.querySelector('.game');
    main.removeChild(game);
    
}

function clickHandle(checkNumber, findNumber,level){
    gameSound.play()
        renderAnswer(checkNumber===findNumber)
        if(checkNumber===findNumber){
        scores+=42*bonus;
        bonus<5? bonus+=1:bonus=5;
        disAppearAnimation()
        
        setTimeout(()=>{
            clearLevel()
        },1000)
        setTimeout(()=>{
            timerStatus?gameOver():startGame(level===9?9:level+1)
        },1000)
            
        }else{
            bonus= bonus-1||1;
            disAppearAnimation()
            setTimeout(()=>{
                clearLevel()
            },1000)
            setTimeout(()=>{
            timerStatus?gameOver():startGame(level-1||1)
            },1000)
        }
}

function gameOver(){
    let gameOverScreen= document.createElement('div');
    gameOverScreen.classList.add("game_over");
    gameOverScreen.insertAdjacentHTML('beforeend', `<h2 class="total_score">Результат: ${scores}</h2><p>Нажмите на экран чтобы играть ёщё раз</p>`)
    main.insertAdjacentElement('beforeend',gameOverScreen)
    gameOverScreen.addEventListener('click',()=>{
        window.location.reload()
    })
}

 function showrResult(text){
    let resultImg= document.querySelector('.result_img')
    resultImg.style.backgroundImage=`url('../src/img/${text}.png')`;
    resultImg.classList.add('appear')
    setTimeout((()=>resultImg.classList.remove('appear')),1000)
}

function hideGrayScreen(){
    grayScreen.style.display='none';
}

function renderAnswer(answer){
    if(answer){
        showrResult('yes');    
    }else{
        showrResult('no');
    }
}


function getRandomNumber(from, to){
    return Math.floor(Math.random() * (to - from + 1))+from
}

function getFindArray(findNumber, level){
    let array=[];
    let n;
    if(level<4){
        n=6;
    } else if(level>=4 && level<6){
        n=12;
    } else if(level>=6 && level<8){
        n=16;
    }else if(level>=8){
        n=25;
    }
 

    do {
        let num= getFindNumber(level);
        if(array.includes(num)){
            continue
        }
        array.push(num);

    } while(array.length<n);

    if(!array.includes(findNumber)){
        let index= getRandomNumber(0,n-1);
        array[index]= findNumber;
    }
    return array
}

}