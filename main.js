
function isSand(pixelIndex){
    
    if(pixelIndex > maxArrayValue || pixelIndex < 0)
        return false;
    if(imageData[pixelIndex] == 200 && imageData[pixelIndex+1] == 200 &&
    imageData[pixelIndex+2] == 0 && (imageData[pixelIndex+3] == 255 || imageData[pixelIndex+3] == 254)) {
        return true;
    }
    return false;
}

function indexToCords(pixelIndex)
{
    let d = (pixelIndex-(pixelIndex%4))/4;
    return [d%width,parseInt(d/width)]
}
function cordsToIndex([x,y])
{
    if(x < 0)
        x = 0;
    if(x > width-1)
        x = width-1;
    if(y < 0)
        y = 0;
    if(y > height-1)
        y = height-1;
    return ((y * width) + x) * 4;
    
}


function canDropDown(pixelIndex){ 
    let block = indexToCords(pixelIndex);
    if(!isSand(cordsToIndex([block[0],block[1]+1]))){
        return true;
    }
    return false;
}
function canDropRight(pixelIndex){ 
    let block = indexToCords(pixelIndex);
    if( !isSand(cordsToIndex([block[0]+1,block[1]+1])) && !isSand(cordsToIndex([block[0]+1,block[1]])) ){
        return true;
    }
    return false;
}
function canDropLeft(pixelIndex){ 
    let block = indexToCords(pixelIndex);
    if( !isSand(cordsToIndex([block[0]-1,block[1]+1])) && !isSand(cordsToIndex([block[0]-1,block[1]])) ){
        return true;
    }
    return false;
}



//MAIN LOOP
// while(simLoop)
// {
//     for(let x= 0; x <= width; x++) {
//         for(let y= 0; y <= height; y++) {
//             pixelIndex = cordsToIndex([x,y]);
//             if(isSand(pixelIndex) && clearToDrop(pixelIndex)){
                
//             }
//         }
//     }
//     ctx.putImageData(imageData,0,0);

// }
/*
imageData.data[pixelindex] = 200;
imageData.data[pixelindex+1] = 200;
imageData.data[pixelindex+2] = 0;
imageData.data[pixelindex+3] = 255;
*/

"use strict";
let canv;
let ctx;
let height = 250;
let width = 250;
let imageData;
let timePassed = 0;
let interval = 0;
let updated = 254;
let updateOpposite = 255;
let i = [];
let pixelIndex;
let maxArrayValue = (((height-1) * width) + width) * 4;
let drawingActivation = false;
let doSimStep = false;

function drawCircle(ctx, x, y, radius, fill) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    if (fill) {
      ctx.fillStyle = fill
      ctx.fill()
    }

}

function getMousePos(e)
{
    let rect = canv.getBoundingClientRect();
    return [parseInt(e.clientX - rect.left), parseInt(e.clientY - rect.top)];
}
function stepSim(){
    doSimStep = true;
}

window.onload = init;
function init(){
    canv=document.getElementById("canvas");
    ctx=canv.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    image = ctx.createImageData(width,height);
    imageData = image.data;
    
    canv.addEventListener('mousemove', (e) => {
        i = getMousePos(e);
        
    });
    canv.addEventListener('mouseup', (e) => {
        drawingActivation = false;
        
    });
    canv.addEventListener('mousedown', (e) => {
        drawingActivation = true;
        
    });
    ctx.fillStyle = "#c8c800";
    ctx.fillRect(50, 0, 51, 100);
    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
}
function gameLoop(timeStamp){
    //Time counters
    document.getElementById("time").textContent = timeStamp;
    document.getElementById("time1").textContent = timePassed;
    document.getElementById("timei").textContent = interval;
    // if(interval < 1){
    //     interval += timeStamp - timePassed;
        
    // }
    // else
    // {
        if(drawingActivation){
            drawCircle(ctx, i[0], i[1], 1, "rgb(200,200,0,updateOpposite)");
            image = ctx.getImageData(0, 0, width, height);
            imageData = image.data;
        }
    if(doSimStep){
        //Mouse drawing
        

        //Main sim loop
        draw(); //is fucked up the outer circle of the drawing brush makes unmoving pixels? check sim logic
        doSimStep = false;
    }
        //Commit changes to the grid
        image.data = imageData;
        ctx.putImageData(image,0,0);
        interval = 0;
    
    //}

    timePassed = timeStamp;
    
    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
    
}
function flipUpdated(){
    if(updated == 255){
        updated = 254;
        updateOpposite = 255;
    }        
    else if(updated = 254){
        updated = 255;
        updateOpposite = 254;
    }
}

function draw(){

    for(let y= 0; y <= height; y++) {
        for(let x= 0; x <= width; x++) {
            
            pixelIndex = cordsToIndex([x,y]);
            
            if(isSand(pixelIndex) && imageData[pixelIndex+3] != updated){
                if(canDropDown(pixelIndex)){
                    let cords = indexToCords(pixelIndex);
                    cords[1] += 1;
                    imageData[cordsToIndex(cords)] = 200;
                    imageData[cordsToIndex(cords)+1] = 200;
                    imageData[cordsToIndex(cords)+2] = 0;
                    imageData[cordsToIndex(cords)+3] = updated;

                    imageData[pixelIndex] = 255;
                    imageData[pixelIndex+1] = 255;
                    imageData[pixelIndex+2] = 255;
                    imageData[pixelIndex+3] = 255;
                } else if(canDropLeft(pixelIndex) && canDropRight(pixelIndex)){
                    if(Math.round(Math.random()) == 1){
                        let cords = indexToCords(pixelIndex);
                        cords[1] += 1;
                        cords[0] += 1;

                        imageData[cordsToIndex(cords)] = 200;
                        imageData[cordsToIndex(cords)+1] = 200;
                        imageData[cordsToIndex(cords)+2] = 0;
                        imageData[cordsToIndex(cords)+3] = updated;

                        imageData[pixelIndex] = 255;
                        imageData[pixelIndex+1] = 255;
                        imageData[pixelIndex+2] = 255;
                        imageData[pixelIndex+3] = 255;
                    }
                    else{
                        let cords = indexToCords(pixelIndex);
                        cords[1] += 1;
                        cords[0] -= 1;
 
                        imageData[cordsToIndex(cords)] = 200;
                        imageData[cordsToIndex(cords)+1] = 200;
                        imageData[cordsToIndex(cords)+2] = 0;
                        imageData[cordsToIndex(cords)+3] = updated;

                        imageData[pixelIndex] = 255;
                        imageData[pixelIndex+1] = 255;
                        imageData[pixelIndex+2] = 255;
                        imageData[pixelIndex+3] = 255;
                    }
                } else if (canDropLeft(pixelIndex)) {
                    let cords = indexToCords(pixelIndex);
                    cords[1] += 1;
                    cords[0] -= 1;

                    imageData[cordsToIndex(cords)] = 200;
                    imageData[cordsToIndex(cords)+1] = 200;
                    imageData[cordsToIndex(cords)+2] = 0;
                    imageData[cordsToIndex(cords)+3] = updated;

                    imageData[pixelIndex] = 255;
                    imageData[pixelIndex+1] = 255;
                    imageData[pixelIndex+2] = 255;
                    imageData[pixelIndex+3] = 255;

                } else if (canDropRight(pixelIndex)) {
                    let cords = indexToCords(pixelIndex);
                    cords[1] += 1;
                    cords[0] += 1;

                    imageData[cordsToIndex(cords)] = 200;
                    imageData[cordsToIndex(cords)+1] = 200;
                    imageData[cordsToIndex(cords)+2] = 0;
                    imageData[cordsToIndex(cords)+3] = updated;

                    imageData[pixelIndex] = 255;
                    imageData[pixelIndex+1] = 255;
                    imageData[pixelIndex+2] = 255;
                    imageData[pixelIndex+3] = 255;

                }
            }
        }
    }
    flipUpdated(); 
    

}
