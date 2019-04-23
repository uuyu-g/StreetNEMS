const text = 'カタカナ0?';
const onlyAlphanumeric = 'abc123?';
const haveAlphanumeric = 'カタカナabc123?';


function isSupported(str){
    if ( !str.match(/[^ -~\u30a1-\u30f6]/) ){
      return true;
    }
    return false;
}

function isOnlyHankakuEisuji(str){
    if ( !str.match(/[^ -~]/) ){
      return true;
    }
    return false;
}

function isOnlyKatakana(str){
    if ( !str.match(/[^\u30a1-\u30f6]/) ){
      return true;
    }
    return false;
}

console.log(isOnlyHankakuEisuji(onlyAlphanumeric));
console.log(isOnlyHankakuEisuji(haveAlphanumeric));