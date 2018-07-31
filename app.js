var jsonfile = require('jsonfile');
const MYKEY = require('./mykey');
//var translate = require('translate-google');
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
    }

    //mstrans(obj);

    //singtoTransName(obj);
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
                        val.thDesc = await callapi(val.desc);
                    }
                }
            }
        }
    }
    write2file(arr);
}

async function mstrans(arr){
    for (const item of arr) {
        await client.translate({text:item.name,from:'zh-cn',to:'th'},function(err,data){
            if(err){
                console.error(err)
            }else {
                item.thName = data;
                console.log(item.name);
                console.log(item.thName);
            }
            
        });
        if(skutype(item.sku)){
            for(const sku of item.sku){
                await client.translate({text:sku.label,from:'zh-cn',to:'th'},function(err,data){
                    if(err){
                        console.error(err)
                    }else{
                        sku.thLabel = data;
                        onsole.log(sku.label);
                        onsole.log(sku.thLabel);
                    }
                    
                })

                for(const val of sku.values){
                    await client.translate({text:val.desc,from:'zh-cn',to:'th'},function(err,data){
                        if(err){
                            console.error(err)
                        }else {
                            val.thDesc = data;
                            onsole.log(val.desc);
                            console.log(val.thDesc);
                        }
                        
                    })
                }
            }
        }
    }
    write2file(arr);

}

async function singtoTransName(array){
    for (const item of array) {
        await translate(item.name,{to:'th'}).then(res=>{
            item.thName = res;
            console.log(item.thName);
        })
        if(skutype(item.sku)){
            for(const sku of item.sku){
                await translate(sku.label,{to:'th'}).then(res=>{
                    sku.thLabel = res;
                    console.log(sku.thLabel);
                })

                for(const val of sku.values){
                    await translate(val.desc,{to:'th'}).then(res=>{
                        val.thDesc = res;
                        console.log(val.thDesc);
                    })
                }
            }

        }
    }
    write2file(array);
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
                reject(err)
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
    if(s=="XXS" || s=="XS" || s=="S" || s=="M" || s=="L" || s=="XL" || s=="XXL" || s=="XXXL" || s=="XXXXL" || s=="2XL" || s=="3XL" || s=="4XL"){
        return true
    }else {
        return false
    }
}
