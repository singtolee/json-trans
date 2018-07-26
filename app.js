var jsonfile = require('jsonfile');
var translate = require('translate-google');
var args = require('commander');

args
.version('0.0.1')
.option('-i, --inputFilePath <path>', 'Input file path')
.option('-o, --outputFilePath <path>', 'Output file path')
.parse(process.argv);

const inFile = args.inputFilePath;
const ofile = args.outputFilePath;

jsonfile.readFile(inFile,function(err,obj){
    singtoTransName(obj);
})

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
        console.error(err)
    })
}
