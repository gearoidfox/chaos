"use strict";
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
var centre = {x: Math.floor(canvas.width/2), y: Math.floor(canvas.height/2)};
var scale = Math.floor(canvas.height / 2) - 2;
if(canvas.height > canvas.width) scale = Math.floor(canvas.width / 2);


// Colour scheme from http://colorbrewer2.org/#type=qualitative&scheme=Paired&n=12
var colours = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928', '#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'];

drawChaos(); // draw once on load

function drawChaos(){
        context.clearRect(0, 0, canvas.width, canvas.height);

        /* Get all options and parameters from page: */
        let step = document.getElementById("step").value;
        let numIterations = document.getElementById("numIterations").value;
        let sides = document.getElementById("vertices").value;
        let drawVerts = document.getElementById("drawVerts").checked;
        let drawLines = document.getElementById("drawLines").checked;
        let noRepeats = document.getElementById("repeats").checked;
        let schemes = document.getElementsByName("colour");
        let colourScheme = "black";
        for(let i = 0; i < schemes.length; i++) {
                if(schemes[i].checked) {
                        colourScheme = schemes[i].value;
                }
        }


        /* Calculate vertices of polygon */
        let angle =  2 * Math.PI / sides;
        let vertices = [];
        for(var i = 1; i <= sides; i++) {
                x = centre.x + Math.sin(i*angle) * scale;
                y = centre.y + Math.cos(i*angle) * scale;
                vertices.push({x: x, y: y});
        }

        /* Draw polygon (optional) */
        if(drawLines) {
                context.strokeStyle = "#AAAAAA"
                context.beginPath();
                context.moveTo(vertices[0].x, vertices[0].y);
                for(i = 0; i < sides; i++) {
                        context.lineTo(vertices[i].x, vertices[i].y);
                }
                context.lineTo(vertices[0].x, vertices[0].y);
                context.stroke();
                context.closePath();
        }

        /* Draw vertices (optional) */
        if(drawVerts) {
                for(i = 0; i < sides; i++) {
                        if(colourScheme == "vertex") {
                                context.fillStyle=colours[i % colours.length];
                        }
                        else context.fillStyle="#000000";
                        context.fillRect(vertices[i].x - 2, vertices[i].y - 2, 4, 4);
                }
        }

        /* Generate random starting point: */
        var x = Math.random() * 400;
        var y = Math.random() * 400;

        /* Throw away the first few points without plotting: */
        for(i = 0; i < 10; i++)
        {
                let vert = Math.floor(Math.random() * sides);
                let vx = vertices[vert].x;
                let vy = vertices[vert].y;
                x = x + step * (vx - x);
                y = y + step * (vy - y);
        }

        /* Iterate and draw points:
         *
         * Pick a random vertex and move towards that vertex by an amount step.
         * Draw a 1px * 1px rectangle at the new point.
         *
         * If noRepeats is true, never move towards the same vertex twice.
         *
         * If colourScheme=="vertex", assign each vertex a colour, and colour
         * points according to the vertex we're moving towards.
         */
        let currentVertex = 0
        for(i = 0; i < numIterations; i++)
        {
                let vert = Math.floor(Math.random() * sides);
                if(noRepeats) {
                        while(vert == currentVertex) {
                                vert = Math.floor(Math.random() * sides);
                        }
                }
                currentVertex = vert;
                if (colourScheme == "vertex") {
                        context.fillStyle = colours[vert % colours.length];
                } else {
                        context.fillStyle = "#000000";
                }
                let vx = vertices[vert].x;
                let vy = vertices[vert].y;
                x = x + step * (vx - x);
                y = y + step * (vy - y);
                context.fillRect(x, y, 1, 1);
        }
}
