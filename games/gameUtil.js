//A simple script for help with 2d canvas context.

//Classes

class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}

class Colour {
    constructor(r, g, b, a) {
        this.r = r; this.g = g; this.b = b; this.a = a;
    }
}

class Vector2 {
    constructor(x, y) {
        this.x = x, this.y = y;
    }
}

var V2 = Vector2; //Alias

//Base colours

const BLACK = new Colour(0, 0, 0, 1);
const WHITE = new Colour(255, 255, 255, 1);
const DARK_GREY = new Colour(80, 80, 80, 1);
const RED = new Colour(255, 0, 0, 1);
const GREEN = new Colour(0, 255, 0, 1);
const BLUE = new Colour(0, 0, 255, 1);

//Text postion constants

const CENTRE = 0;
const LEFT = 1;
const RIGHT = 2;

//Internal utility functions

//https://stackoverflow.com/a/5624139
function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }
//end of sa answer
  
//Draws a rectangle to a canvas 2d context
function drawRectangle(context, rectangle, colour, pos, fill = true, opacity = 1.0) {
    
    if (fill) {
        context.fillStyle = rgbToHex(colour.r, colour.g, colour.b);
    } else {
        context.strokeStyle = rgbToHex(colour.r, colour.g, colour.b);
    }

    context.globalAlpha = opacity;
    context.rect(pos.x, pos.y, rectangle.width, rectangle.height);

    if (fill) {
        context.fill();
    } else {
        context.stroke();
    }

    //Reset alpha

    context.globalAlpha = 1.0;

}

//Draws text to the screen
function drawText(context, pos, colour, text, font, size, fill = true, align = LEFT) {
    context.font = `${size}px ${font}`;

    //Set the align

    switch (align) {
        case LEFT:
            context.textAlign = "left";
            break;
        case RIGHT:
            context.textAlign = "right";
            break;
        case CENTRE:
            context.textAlign = "center";
            break;
        default:
            break;
    }

    //Draw the text
    if (fill) {
        context.fillStyle = rgbToHex(colour.r, colour.g, colour.b);
        context.fillText(text, pos.x, pos.y);
    } else {
        context.strokeStyle = rgbToHex(colour.r, colour.g, colour.b);
        context.strokeText(text, pos.x, pos.y);
    }

}

//Draws line from a pair of two coordinates

function drawLine(context, colour, width, startPos, endPos) {
    context.strokeStyle = rgbToHex(colour.r, colour.g, colour.b);
    context.lineWidth = width;

    context.beginPath();

    context.moveTo(startPos.x, startPos.y);
    context.lineTo(endPos.x, endPos.y);

    context.stroke();
}

//Doesn't work
function drawSVG(context, colour, fill, strokeWidth, pos, pathData) {
    
    let path = new Path2D(pathData);

    context.strokeStyle = rgbToHex(colour.r, colour.g, colour.b);
    context.fillStyle = rgbToHex(colour.r, colour.g, colour.b);
    
    context.moveTo(pos.x, pos.y);

    if (fill) {
        context.lineWidth = strokeWidth;
        context.stroke(path);
    } else {
        context.fill(path);
    }

}

function drawImage(context, pos, imageID) {
    
    context.drawImage(document.getElementById(imageID), pos.x, pos.y)

}


