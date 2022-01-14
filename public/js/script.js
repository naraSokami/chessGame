import { Grid, Pawn, Tower, Horse, Fool, Queen, King, color1, color2 } from './classes.js'

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d')

let currentPiece = undefined
let displayState = false
let currentColor = color2

// A FAIRE 

// - jsp
// - regle des deux tours


// let currentPieceChanged = new CustomEvent('currentPieceChanged', {
//     detail: {
//         piece: currentPiece
//     }
// })

// canvas.addEventListener('currentPieceChanged', e => {
//     // console.log(e);
// })

canvas.width = window.innerWidth
canvas.height = window.innerHeight
canvas.width = 400
canvas.height = 400
canvas.style.backgroundColor = '#777777'

let grid = new Grid(100, 100, 8, 8)
grid.be()

function init() {
    for (let i = 0; i < 8; i++) {
        grid.addPiece(i, 6, new Pawn(i, 6, 'white', grid))
    }
    grid.addPiece(0, 7, new Tower(0, 7, 'white', grid))
    grid.addPiece(7, 7, new Tower(7, 7, 'white', grid))
    grid.addPiece(1, 7, new Horse(1, 7, 'white', grid))
    grid.addPiece(6, 7, new Horse(6, 7, 'white', grid))
    grid.addPiece(2, 7, new Fool(2, 7, 'white', grid))
    grid.addPiece(5, 7, new Fool(5, 7, 'white', grid))
    grid.addPiece(3, 7, new Queen(3, 7, 'white', grid))
    grid.addPiece(4, 7, new King(4, 7, 'white', grid))

    for (let i = 0; i < 8; i++) {
        grid.addPiece(i, 1, new Pawn(i, 1, 'crimson', grid))
    }
    grid.addPiece(0, 0, new Tower(0, 0, 'crimson', grid))
    grid.addPiece(7, 0, new Tower(7, 0, 'crimson', grid))
    grid.addPiece(1, 0, new Horse(1, 0, 'crimson', grid))
    grid.addPiece(6, 0, new Horse(6, 0, 'crimson', grid))
    grid.addPiece(2, 0, new Fool(2, 0, 'crimson', grid))
    grid.addPiece(5, 0, new Fool(5, 0, 'crimson', grid))
    grid.addPiece(3, 0, new Queen(3, 0, 'crimson', grid))
    grid.addPiece(4, 0, new King(4, 0, 'crimson', grid))
}

function win(winner) {
    ctx.fillStyle = 'gold'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'black'
    ctx.beginPath()
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${winner} won the game !`, canvas.width / 2, canvas.height / 2)
    ctx.closePath()

    // canvas.addEventListener('click', () => {
    //     grid.be()
    //     init()
    // }, { once: true })
}

canvas.addEventListener('click', e => {
    
    let x = Math.floor(e.offsetX / 50)
    let y = Math.floor(e.offsetY / 50)
    let newCurrentPiece = grid.findPiece(x, y)
    let took = false

    if (currentPiece) {
        currentPiece.hideMovements()
        if (displayState) {
            for (let i = 0; i < currentPiece.moveToList.length; i++) {
                if (x === currentPiece.moveToList[i][0] && y === currentPiece.moveToList[i][1]) {
                    grid.addPiece(x, y, grid.removePiece(currentPiece.x, currentPiece.y))
                    currentColor = currentColor === color1 ? color2 : color1
                }
            }

            for (let i = 0; i < currentPiece.takeList.length; i++) {
                if (x === currentPiece.takeList[i][0] && y === currentPiece.takeList[i][1]) {
                    let removedPiece = grid.removePiece(x, y)
                    grid.addPiece(x, y, grid.removePiece(currentPiece.x, currentPiece.y))
                    currentColor = currentColor === color1 ? color2 : color1
                    took = true
                    if (removedPiece.constructor.name === 'King') {
                        win(currentPiece.color)
                    }
                }
            }
        }
    }

    displayState = newCurrentPiece ? true : false
           
    if (newCurrentPiece && newCurrentPiece.color !== currentColor) {
        if (!took) {
            newCurrentPiece.displayMovements()
        }

        currentPiece = newCurrentPiece
    }
})



init()

// let test = new Horse(3, 4, 'crimson', grid)
// grid.squaresList[3][4].content = test
// test.be()

// let test2 = new Tower(1, 4, 'crimson', grid)
// grid.squaresList[1][4].content = test2
// test2.be()










// let test = new CustomEvent('test', { 
//     detail: {
//         name: 'test', 
//         value: 20,
//         tog: true,
//         action: function(){console.log('saying hi to ' + this.name)}
//     },
// })

// let testt = document.querySelector('#test')

// testt.addEventListener('click', () => {
//     testt.dispatchEvent(test)
// })

// testt.addEventListener('test', ({detail}) => {
//     console.log('bah si');
//     detail.value++
//     detail.action()
//     console.log(detail);
// })

// for (let i = 0; i < 10; i++) {
//     if (i % 2 === 0) {
//         console.log(i);
//         testt.dispatchEvent(test)
//     }
// }