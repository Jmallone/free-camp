const rp = require('request-promise');
var readlineSync = require('readline-sync');
const cheerio = require('cheerio');

var url = readlineSync.question('Qual o link do Album? ');
console.log('Link: ' + url + '!');
var is_json = 0;
is_json = readlineSync.question('\nDigite 1 para gerar um arquivo Json, 0 se não quiser: ');

console.log("\nProcessando ...\n")

var result = " ";

rp(url)
  .then(function(html){
    //success!
    let $ = cheerio.load(html);

    let title = $('h2[class=trackTitle]').html();
    
    console.log( title);
    //console.log(html);
    var ww = html.replace(/(\r\n|\n|\r)/gm," ");    

    var i = ww.search('trackinfo:');
    var c = ww.search('playing_from:')-6;
    var b = c - i;
    var a = 10;
    while(a < b){
      result = result+ww[i+a];
      a++;
    }

    const fs = require('fs');
  
    /* Para fazer donwload do Audio */
    request = require('request');
    dir = ""+title;
    
    obj = JSON.parse(result);
    fs.mkdirSync(dir)
    for (item in obj){
      console.log("Nome: "+obj[item].title+" \n Link: "+ obj[item].file["mp3-128"]+"\n" );
      request
      .get(obj[item].file["mp3-128"])
      .on('error', function(err) {
        // handle error
      })
      .pipe(fs.createWriteStream(dir+'/'+obj[item].title+'.mp3'));
    }
      /* Salvar em um JSon */
      if(is_json == 1){
        fs.writeFile(dir+'/'+"test.json", result, function(err) {
            if(err) {
                return console.log(err);
            }
      
            console.log("Arquivo Salvo!");
        }); 
      }

    console.log("A pasta aonde se encontra as Musicas é: "+ dir);

  })
  .catch(function(err){
    //handle error
  });

