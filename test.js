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

//findSize('BEIBEI')

var val;
if(val=findSize('XXL is good')){
    console.log("VAL is: " + val)
}else{
    console.log("I am wrong")
}