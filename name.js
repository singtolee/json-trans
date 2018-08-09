var jsonfile = require('jsonfile');
var args = require('commander');

args
.version('0.0.1')
.option('-i, --inputFilePath <path>', 'Input file path')
.option('-o, --outputFilePath <path>', 'Output file path')
.parse(process.argv);

const inFile = args.inputFilePath;
const ofile = args.outputFilePath;

/*

jsonfile.readFile(inFile,function(err,obj){

    var i;
    for(i=0;i<obj.length;i++){
        obj[i].name = cleanName(obj[i].name);
    }

   // write2file(obj)
})

function write2file(arr){
    jsonfile.writeFile(ofile,arr,{spaces: 2, EOL: '\r\n'}, function(err){
        console.error("ERROR is :" + err)
    })
}
*/

function cleanName(str){
   var newStr = str.replace(/2018|2017|2016|ins|INS|一件|代发|新款|加肥|加大|实拍|专供|欧美|品牌|潮|潮流|logo|跨境|阿里巴巴|批发网|源头|产地|斤|胖|妹妹|mm|MM|东大门|淘货源|速卖通|wish|WISH|ebay|Ebay|批发|亚马逊|定制|厂家|直销|直供|速卖通|热卖|大码|清仓|自制|特价|爆款|现货|1688|欧洲站|外贸/gi,"")
   console.log("A is:"+newStr)
   console.log(str)
/*
    const del = ["一件代发","批发","亚马逊","定制","厂家直销","ebay","Ebay",
    "速卖通","wish","WISH","热卖","大码","清仓","自制",
    "特价","东大门","爆款","现货","1688","欧洲站","外贸","淘货源",
    "2018","2017","2016","2015","厂家直供",
    "加肥加大","ins","INS","供应","logo","跨境","货源","阿里巴巴","批发网",
    "源头","产地","代发","斤","胖妹妹","胖MM","胖mm",
    "实拍","专供","欧美","!","潮流","潮","品牌"]

    for(const item of del){
        if(str.search(item)>=0){
            console.log(str.search(item))
            console.log(item)
            console.log(item.length)
            console.log(str.replace(item,""))
            var newStr = str.replace(item,"A");
        }
    }
    //console.log(newStr)
    //return newStr;
    */
}

function removeText(ostr,text){
    var newStr = ostr.replace(text,'');
    return newStr;
}

