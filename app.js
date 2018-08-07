var jsonfile = require('jsonfile');
const MYKEY = require('./mykey');
var args = require('commander');
var MsTranslator = require('mstranslator');
var client = new MsTranslator({
    api_key: MYKEY.key
  }, true);

args
.version('0.0.1')
.option('-k, --keyword [value]', 'keyword to set')
.option('-i, --inputFilePath <path>', 'Input file path')
.option('-o, --outputFilePath <path>', 'Output file path')
.parse(process.argv);

const inFile = args.inputFilePath;
const ofile = args.outputFilePath;
const kw = args.keyword;
console.log(kw);
console.log(MYKEY.key);

jsonfile.readFile(inFile,function(err,obj){

    var i;
    for(i=0;i<obj.length;i++){
        obj[i].detail = strtoarray(obj[i].detail);
        obj[i].status = false;
        obj[i].uw = 0.3;
        obj[i].keyword = kw;
        obj[i].time = new Date();
    }
    mymstran(obj);
})

async function mymstran(arr){
    for(const item of arr){
        item.thName = await callapi(item.name);
        if(skutype(item.sku)){
            for(const sku of item.sku){
                sku.thLabel = await callapi(sku.label)
                for(const val of sku.values){
                    if(isEngSize(val.desc)){
                        val.thDesc = val.desc;
                        console.log("ENGLISH SIZE,skipe")
                    }else {
                        if(val.desc.search('均码')!=-1){
                            val.thDesc = 'หนึ่งขนาด';
                            console.log("FIND 均码 " + val.thDesc)
                        }else {
                            if(val.thDesc=findSize(val.desc)){
                                console.log("FIND SIZE: " + val.thDesc )
                            }else{
                                val.thDesc = await callapi(val.desc)
                            }
                        }
                    }
                }
            }
        }
    }
    write2file(arr);
}

function skutype(sku){
    if(sku[0].label){
        return true
    }else {return false}
}

function write2file(arr){
    jsonfile.writeFile(ofile,arr,{spaces: 2, EOL: '\r\n'}, function(err){
        console.error("ERROR is :" + err)
    })
}

function callapi(text) {
    return new Promise(resolve=>{
        client.translate({text:text,from:'zh-cn',to:'th'},function(err,data){
            if(err){
                console.error(err)
                callapi(text)
                //reject(err)
            }else{
                console.log(text)
                console.log(data)
                resolve(data)
            }
        })
    })
}

function strtoarray(str){
	var jpg = str.match(/\/\/\S*.jpg/g);
	var png = str.match(/\/\/\S*.png/g);
	if(jpg&&png){
		return jpg.concat(png)
	}else {
		if(jpg){
			return jpg;
		}else {
			return png;
		}
	}
}

function isEngSize(s){
    if(s=="XXS" || s=="XS" || s=="S" || s=="M" || s=="L" || s=="XL" || s=="XXL" || s=="XXXL" || s=="XXXXL" || s=="2XL" || s=="3XL" || s=="4XL" || s=="5XL"){
        return true
    }else {
        return false
    }
}

function findSize(str) {
    const sizeS = "S";
    const sizeXS = "XS";
    const sizeM = "M";
    const sizeL = "L";
    const sizeXL = "XL";
    const sizeXXL = "XXL";
    const sizeXXXL = "XXXL";
    const sizeXXXXL = "XXXXL";
    const sizeXXXXXL = "XXXXXL";
    const size2xl = "2XL";
    const size3xl = "3XL";
    const size4xl = "4XL";
    const size5xl = "5XL";
    const newSizeArr = [size5xl, size4xl, size3xl, size2xl, sizeXXXXXL, sizeXXXXL, sizeXXXL, sizeXXL, sizeXL, sizeL, sizeM, sizeXS, sizeS];
    for (const size of newSizeArr) {
        if (str.search(size) != -1) {
            //console.log(size)
            return size;
        }
    }
    return false
}
