var jsonfile = require('jsonfile');
const MYKEY = require('./mykey');
var args = require('commander');
var MsTranslator = require('mstranslator');
var BAIDUTranslate = require('baidu-translate')(MYKEY.bid,MYKEY.bkey,'th','zh-CN');
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
        obj[i].name = cleanName(obj[i].name);
        obj[i].detail = strtoarray(obj[i].detail);
        if(obj[i].sku[0].label){
          obj[i].sku = handleSkus(obj[i].sku,obj[i].sku_detail,obj[i].trade_info)  
        }else {
            //TODO make a sku
            obj[i].sku = fakeSku(obj[i])
        }
        obj[i].status = false;
        obj[i].uw = 0.3;
        obj[i].keyword = kw;
        obj[i].time = new Date();
        delete obj[i].sku_detail;
    }
    //myBaiduTrans(obj)
    mymstran(obj);
    //write2file(obj);
})

function fakeSku(obj){
    return {
        label:"颜色",
        values:[{
            desc:"均码",
            image:obj.images[0],
            skus:[{
                sku:"均码",
                stock:999,
                sku_id:'1234567890',
                price:Number(obj.trade_info[0].price),
                skuC:"均码",
                skuS:"均码",
                sugPrice:Math.ceil(Number(obj.trade_info[0].price*1.7))
            }]
        }],

    }
}

async function myBaiduTrans(arr){
    for(const item of arr){
        item.thName = await baiduApi(item.name);
        if(skutype(item.sku)){
            //sku is object now
            item.sku.thLabel = await baiduApi(item.sku.label)
            for(const val of item.sku.values){
                val.thDesc =await bddescTrans(val.desc)
                for(const kk of val.skus){
                    kk.thSkuS =await bddescTrans(kk.skuS)
                    }
            }
        }
    }
    write2file(arr);

}

async function mymstran(arr){
    for(const item of arr){
        item.thName = await callapi(item.name);
        if(skutype(item.sku)){
            //sku is object now
            item.sku.thLabel = await callapi(item.sku.label)
            for(const val of item.sku.values){
                val.thDesc =await descTrans(val.desc)
                for(const kk of val.skus){
                    kk.thSkuS =await descTrans(kk.skuS)
                    }
            }
        }
    }
    write2file(arr);
}

async function descTrans(str){
    if(isEngSize(str)){
        console.log("ENGLISH SIZE,skipe")
        return str
    }else {
        if(str.search('均码')!=-1){
            console.log("FIND 均码 ")
            return 'หนึ่งขนาด'
        }else {
            
            if(findSize(str)){
                console.log("FIND SIZE: " + str )
                return findSize(str)
            }else{
                var aa = await callapi(str)
                return aa
            }
            
        }
    }
}

async function bddescTrans(str){
    if(isEngSize(str)){
        console.log("ENGLISH SIZE,skipe")
        return str
    }else {
        if(str.search('均码')!=-1){
            console.log("FIND 均码 " + val.thDesc)
            return 'หนึ่งขนาด'
        }else {
            
            if(findSize(str)){
                console.log("FIND SIZE: " + str )
                return findSize(str)
            }else{
                var aa = await baiduApi(str)
                return aa
            }
            
        }
    }
}

function skutype(sku){
    if(sku.values){
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

function baiduApi(text){
    return new Promise(resolve=>{
        BAIDUTranslate(text).then(res=>{
            console.log(res.trans_result[0].src)
            console.log(res.trans_result[0].dst)
            resolve(res.trans_result[0].dst)
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

function cleanName(str){
    var newStr = str.replace(/【|】|\d+|ins|INS|一件|代发|加肥|加大|大码|显瘦|实拍|专供|欧美|品牌|潮|潮流|logo|跨境|阿里巴巴|批发网|源头|产地|斤|胖|妹妹|mm|MM|东大门|淘货源|速卖通|wish|WISH|ebay|Ebay|批发|亚马逊|支持|定制|厂家|直销|直供|速卖通|热卖|大码|清仓|自制|特价|爆款|现货|1688|欧洲站|外贸/gi,"")
    console.log("OLD NAME: "+str);
    console.log("NEW NAME: "+newStr)
    return newStr;
 }

 function handleSkus(skuArr,skusArr,tradeInfo){
    for(const val of skuArr[0].values){
        val.skus = [];
        for(const sdetail of skusArr){
            if(!sdetail.price){
                sdetail.price = tradeInfo[0].price
            }
            if(sdetail.sku.includes(val.desc)){
                var bb = sdetail.sku.split(/\>/);
                if(bb.length>1){
                    sdetail.skuC = bb[0];
                    sdetail.skuS = bb[1];
                }else{
                    sdetail.skuC = bb[0];
                    sdetail.skuS = bb[0];
                }
                
                sdetail.price = Number(sdetail.price);
                sdetail.sugPrice = Math.ceil(sdetail.price*1.7);
                sdetail.stock = Number(sdetail.stock);
                val.skus.push(sdetail)
            }
        }
    }

    for(const va of skuArr[0].values){
        //sort va.skus
        va.skus.sort(compare)
    } 
    return skuArr[0];

 }

 function compare(a,b){
     if(a.sku_id>b.sku_id){
         return 1;
     }
     if(a.sku_id<b.sku_id){
         return -1;
     }
     return 0;
 }
