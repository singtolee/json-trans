const MYKEY = require('./mykey');
var jsonfile = require('jsonfile');
var BAIDUTranslate = require('baidu-translate')(MYKEY.bid,MYKEY.bkey,'th','zh-CN');

var args = require('commander');

args
.version('0.0.1')
.option('-i, --inputFilePath <path>', 'Input file path')
.option('-o, --outputFilePath <path>', 'Output file path')
.parse(process.argv);

const inFile = args.inputFilePath;
const ofile = args.outputFilePath;

jsonfile.readFile(inFile,function(err,obj){

    var i;
    var nameArr = []
    for(i=0;i<obj.length;i++){
        obj[i].name = cleanName(obj[i].name);
        nameArr.push(obj[i].name)
    }

    console.log(nameArr)
    BAIDUTranslate(nameArr).then(res=>{
    console.log(res)
})

}
)




function cleanName(str){
    var newStr = str.replace(/【|】|\d+|ins|INS|一件|代发|加肥|加大|大码|显瘦|实拍|专供|欧美|品牌|潮|潮流|logo|跨境|阿里巴巴|批发网|源头|产地|斤|胖|妹妹|mm|MM|东大门|淘货源|速卖通|wish|WISH|ebay|Ebay|批发|亚马逊|支持|定制|厂家|直销|直供|速卖通|热卖|大码|清仓|自制|特价|爆款|现货|1688|欧洲站|外贸/gi,"")
    console.log("OLD NAME: "+str);
    console.log("NEW NAME: "+newStr)
    return newStr;
 }