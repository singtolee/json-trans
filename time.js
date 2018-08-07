var jsonfile = require('jsonfile');
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
    for(i=0;i<obj.length;i++){
        obj[i].time = new Date();
    }
    write2file(obj);
})

function write2file(arr){
    jsonfile.writeFile(ofile,arr,{spaces: 2, EOL: '\r\n'}, function(err){
        console.error("ERROR is :" + err)
    })
}