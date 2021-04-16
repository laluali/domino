// Global Variables
let stock = new Array();
let p1Arr = new Array();
let p2Arr = new Array();
let gameArr = new Array();
let startedByP1 = false;

/**
 * @desc Bootstrap function to start Domino game
 */
(function startDomino(){
    let a=0;
    while (a<7){
        let i=0;
        while(i<=a){
            stock.push([a,i]);
            i++;
        }
        delete i;
        a++;
    }
    console.log(`~~~~~~Welcome to ${stock.length} Domino Game~~~~~~`);
    delete a;
})();

/**
 *
 * @param array : Array
 * @return {number}
 * @desc generate number randomly for an array
 */
function random(array){
   return Math.floor((Math.random() * (array.length+1))-1);
}

/**
 * @param player : string
 * @param index : int
 * @desc Assign Domino to the player
 */
function assignDomino(player, index){
    if(player == 'p1'){
        p1Arr.push(stock.splice(index, 1)[0]);
        console.log(`Player 1 picks (${p1Arr[p1Arr.length-1]}) ${stock.length} left in Stock`);
    } else {
        p2Arr.push(stock.splice(index, 1)[0]);
        console.log(`Player 2 picks (${p2Arr[p2Arr.length-1]}) ${stock.length} left in Stock`);
    }
}

/**
 *
 * @param index : int
 * @param player : string
 * @desc Pick Domino Randomly for player
 */
function pickDomino(index, player){
    if (index > 27) {
        pickDomino(random(stock), player);
    } else if (index < 0){
        pickDomino(random(stock)+1, player);
    } else {
        if(index < stock.length){
            assignDomino(player, index);
        } else {
            pickDomino(random(stock), player);
        }
    }
}

/**
 * @desc Pick dominoes for Player 1
 */
function buildBucket1(){
    let i=0;
    while(i<7){
        pickDomino(random(stock), 'p1');
        i++;
    }
    p1Arr = p1Arr.sort( function (l,m)  {return l[0] - m[0]});
    console.log(p1Arr);
    delete i;
}

/**
 * @desc Pick dominoes for Player 2
 */
function buildBucket2(){
    let i=0;
    while(i<7){
        pickDomino(random(stock), 'p2');
        i++;
    }
    p2Arr = p2Arr.sort( function (l,m)  {return l[0] - m[0]});
    console.log(p2Arr);
    delete i;
}

/**
 * @desc This logic is built to randomly select any player and kickoff with the game
 */
function fairPlayStart(){
    if (random(stock) > 5) {
        startedByP1 = true;
        buildBucket1();
        buildBucket2();
        console.log(`P1 to Start`);
    } else {
        startedByP1 = false;
        buildBucket2();
        buildBucket1();
        console.log(`P2 to Start`);
    }
}

/**
 *
 * @param player
 * @desc logic for kickoff of the game
 */
function kickOff(player){
    if(player == 'p1'){
        gameArr.push(p1Arr.splice(random(p1Arr), 1)[0]);
        console.log(`${player} plays (${gameArr[gameArr.length-1]})`);
    } else {
        gameArr.push(p2Arr.splice(random(p2Arr), 1)[0]);
        console.log(`${player} plays (${gameArr[gameArr.length-1]})`);
    }
    console.log('Domino ',gameArr);
}

/**
 *
 * @param playerArr : Array<Array<int>>
 * @param accessor : int
 * @param predicateValue : int
 * @return {number}
 * @desc This logic will search for exact domino out of player array. Accessor is the index within a domino and predicateValue is the value against with domino index value is matched. For faster iterations we traverse from front/back depending on what is the predicateValue
 */
function searchDomino(playerArr, accessor, predicateValue) {
    let index = undefined;
    if(predicateValue > 3){
        for(let i = playerArr.length-1; i <= playerArr.length; i--){
            if(playerArr[i][accessor] === predicateValue){
                return index = i;
            }
        }
    } else{
        for(let i = 0; i <= playerArr.length-1; i++){
            if(playerArr[i][accessor] === predicateValue){
                return index = i;
            }
        }
    }
    return index;
}

/**
 * @param player : String
 * @desc Logic to build dominoes array. Extracting 'base'(Base domino array) and 'top'(Top Domino array) for GameArray and comparing 1st element of 'Top' and 0th element of 'Base'
 */
function buildGameArr(player){
    let top = gameArr[gameArr.length-1];
    let base = gameArr[0];
    // console.log(base + '::::' + top);
    let dominoIndex = undefined;
    let playerArr;
    if(player=='p1'){
        playerArr = p1Arr;
    } else {
        playerArr = p2Arr;
    }
    if(playerArr.some(val => val[0] === top[1])){
        dominoIndex = searchDomino(playerArr, 0, top[1]);
        gameArr.push(playerArr.splice(dominoIndex, 1)[0]);
        console.log(`${player} plays (${gameArr[gameArr.length-1]})`);
        console.log('Domino ',gameArr);
    } else if(playerArr.some(val => val[0] === base[0])){
        dominoIndex = searchDomino(playerArr, 0, base[0]);
        gameArr.unshift(playerArr.splice(dominoIndex, 1)[0].reverse());
        console.log(`${player} plays (${gameArr[0]})`);
        console.log('Domino ',gameArr);
    }else if(playerArr.some(val => val[1] === top[1])){
        dominoIndex = searchDomino(playerArr, 1, top[1]);
        gameArr.push(playerArr.splice(dominoIndex, 1)[0].reverse());
        console.log(`${player} plays (${gameArr[gameArr.length-1]})`);
        console.log('Domino ',gameArr);
    } else if(playerArr.some(val => val[1] === base[0])){
        dominoIndex = searchDomino(playerArr, 1, base[0]);
        gameArr.unshift(playerArr.splice(dominoIndex, 1)[0]);
        console.log(`${player} plays (${gameArr[0]})`);
        console.log('Domino ',gameArr);
    }else{
        pickDomino(random(stock),player);
        buildGameArr(player);
    }
    delete top, base, dominoIndex, playerArr;
    // console.log(gameArr);
}

/**
 *
 * @param player : String
 * @desc Start playing domino game logic
 */
function playDomino(player){
    console.log(`turn : ${player}`)
    if(gameArr.length == 0){
        kickOff(player);
    } else {
        buildGameArr(player)
    }
}

/**
 * @desc Start playing game once kickoff is complete
 */
function gamePlay(){
    while(stock.length > 0){
        startedByP1 ? playDomino('p1') : playDomino('p2');
        if((p1Arr.length == 0 || p2Arr.length == 0) || stock.length == 0){
            break;
        }
        startedByP1 = !startedByP1;
    }
}

/**
 * @desc What to display once game has ended
 */
function endGame(){
    startedByP1?console.log('~~~~P1 Wins~~~~') : console.log('~~~~P2wins~~~~');
    console.log('P1 Holds : ', p1Arr);
    console.log('P2 Holds : ', p2Arr);
    console.log('Stock : ', stock);
    console.log('Domino :', gameArr);
    console.log('Game Ends');
    delete stock;
    delete p1Arr;
    delete p2Arr;
    delete gameArr;
    delete startedByP1;
}

/**
 * @desc This is Game Skeleton IFFY that holds various states of how game progresses
 */
(function startGame(){
    fairPlayStart();
    gamePlay();
    endGame();
}())
