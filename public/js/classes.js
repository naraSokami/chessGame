const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d')

const squareSize = 50
const gridWidth = 8
const gridHeight = 8
const red = 'rgba(255, 0, 0, 0.47)'
const green = 'rgba(42, 255, 0, 0.47)'
const color1 = 'white'
const color2 = 'crimson'

class Square {
    constructor(x, y, color='#dddddd') {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = squareSize
        this.content = undefined
    }

    be() {
        ctx.fillStyle = this.color
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.rect(this.x * this.size, this.y * this.size, this.size, this.size)
        ctx.fill()
        ctx.closePath()
    }

    clear() {
        ctx.fillStyle = (this.x + this.y + 1) % 2 === 1 ? '#aaaaaa' : 'black'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.rect(this.x * this.size, this.y * this.size, this.size, this.size)
        ctx.fill()
        ctx.closePath()
    }

    reset() {
        this.clear()
        if (this.content)
            this.content.be()
    }
}

class Grid {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.squaresList = [];
    }

    be() {
        for (var i = 0; i < this.width; i++) {
            this.squaresList.push([])
            for (var j = 0; j < this.height; j++) {
                let square = new Square(i, j, (j + i + 1) % 2 === 1 ? '#aaaaaa' : 'black')
                this.squaresList[i].push(square)
                square.be()
            }
        }
    }

    findPiece(x, y) {
        return this.squaresList[x][y].content
    }

    addPiece(x, y, piece) {
        piece.x = x
        piece.y = y
        piece.be()
        this.squaresList[x][y].content = piece
    }

    removePiece(x, y) {
        let pieceToRemove = this.squaresList[x][y].content
        this.squaresList[x][y].be()
        this.squaresList[x][y].content = undefined
        return pieceToRemove
    }
}

class Piece {
    constructor(x, y, color, letter, grid) {
        this.x = x
        this.y = y
        this.color = color
        this.letter = letter
        this.grid = grid
        this.moveToList = []
        this.takeList = []
    }
    
    be() {
        ctx.fillStyle = this.color
        ctx.fontSize = '52px';
        ctx.beginPath()
        ctx.arc(this.x * squareSize + squareSize / 2, this.y * squareSize + squareSize / 2, squareSize / 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = 'black'
        ctx.strokeText(this.letter, this.x * squareSize + squareSize / 2 - 3, this.y * squareSize + squareSize / 2 + 3, 32)
    }

    canMoveTo(x, y) {
        ctx.fillStyle = green
        ctx.beginPath()
        ctx.arc(x * squareSize + squareSize / 2, y * squareSize + squareSize / 2, squareSize / 3, 0, Math.PI * 2)
        ctx.fill()
    }

    canTake(x, y) {
        ctx.fillStyle = red
        ctx.beginPath()
        ctx.arc(x * squareSize + squareSize / 2, y * squareSize + squareSize / 2, squareSize / 3, 0, Math.PI * 2)
        ctx.fill()
    }

    resetTile(x, y) {
        ctx.fillStyle = (x + y + 1) % 2 === 1 ? '#aaaaaa' : 'black'
        ctx.beginPath()
        ctx.arc(x * squareSize + squareSize / 2, y * squareSize + squareSize / 2, squareSize / 3, 0, Math.PI * 2)
        ctx.fill()
    }

    displayMovements() {

        let squares = this.grid.squaresList
        this.moveToList = []
        this.takeList = []

        for (let i = 0; i < this.movements.length; i++) {
            // console.log({} === {});

            let move = this.movements[i]

            if (move[2]) {
                for (var j = 1; 
                    this.x + move[0] * j >= 0 &&
                    this.x + move[0] * j < gridWidth &&
                    this.y + move[1] * j >= 0 &&
                    this.y + move[1] * j < gridHeight;
                    j++) {
                        if (!squares[this.x + move[0] * j][this.y + move[1] * j].content)
                            this.moveToList.push([this.x + move[0] * j, this.y + move[1] * j])
                        else 
                            j = -(gridWidth)
                }
            }

            if (!move[2]) {
                if (this.x + move[0] >= 0 &&
                    this.x + move[0] < gridWidth &&
                    this.y + move[1] >= 0 &&
                    this.y + move[1] < gridHeight) {
                        if (!squares[this.x + move[0]][this.y + move[1]]?.content) {
                            this.moveToList.push([this.x + move[0], this.y + move[1]])
                        if (this.constructor.name === 'Pawn') {
                            if (this.color === color1 && this.y === 6 && !squares[this.x + move[0]][this.y + move[1] - 1]?.content) {
                                this.moveToList.push([this.x + move[0], this.y + move[1] - 1])
                            }
                            if (this.color === color2 && this.y === 1 && !squares[this.x + move[0]][this.y + move[1] + 1]?.content) {
                                this.moveToList.push([this.x + move[0], this.y + move[1] + 1])
                            }
                        }
                    } 
                }
            }
        }

        for (let i = 0; i < this.takeables.length; i++) {

            let move = this.takeables[i]

            if (move[2]) {
                for (var j = 1; 
                    this.x + move[0] * j >= 0 &&
                    this.x + move[0] * j < gridWidth &&
                    this.y + move[1] * j >= 0 &&
                    this.y + move[1] * j < gridHeight;
                    j++) {
                        
                        if (squares[this.x + move[0] * j][this.y + move[1] * j].content) {
                            if (squares[this.x + move[0] * j][this.y + move[1] * j].content.color !== this.color) {
                                this.canTake(this.x + move[0] * j, this.y + move[1] * j)
                                this.takeList.push([this.x + move[0] * j, this.y + move[1] * j])
                            }
                            j = -(gridWidth)
                        }
                }
            }

            if (!move[2]) {
                if (this.x + move[0] >= 0 &&
                    this.x + move[0] < gridWidth &&
                    this.y + move[1] >= 0 &&
                    this.y + move[1] < gridHeight) {
                        
                        if (squares[this.x + move[0]][this.y + move[1]].content) {
                            if (squares[this.x + move[0]][this.y + move[1]].content.color !== this.color) {
                                this.canTake(this.x + move[0], this.y + move[1])
                                this.takeList.push([this.x + move[0], this.y + move[1]])
                            }
                            j = -(gridWidth)
                        }
                }
            }
        }

        this.moveToList.forEach(coord => {
            this.canMoveTo(coord[0], coord[1])
        })
    }
    
    hideMovements() {
        this.moveToList.forEach(coord => {
            this.grid.squaresList[coord[0]][coord[1]].reset();
        })

        this.takeList.forEach(coord => {
            this.grid.squaresList[coord[0]][coord[1]].reset();
        })
    }
}

class Pawn extends Piece {
    constructor(x, y, color, grid) {
        super(x, y, color, 'P', grid)
        this.name = 'Pawn'
        this.movements = [
            color === color1 ? [0, -1, false] : [0, 1, false],
        ]
        this.takeables = [
            color === color1 ? [-1, -1, false] : [1, 1, false],
            color === color1 ? [1, -1, false] : [-1, 1, false],
        ]
    }
}

class Tower extends Piece {
    constructor(x, y, color, grid) {
        super(x, y, color, 'T', grid)
        this.name = 'Tower'
        this.movements = [
            [0, -1, true],
            [-1, 0, true],
            [0, 1, true],
            [1, 0, true],
        ]
        this.takeables = [
            [0, -1, true],
            [-1, 0, true],
            [0, 1, true],
            [1, 0, true],
        ]
    }
}

class Horse extends Piece {
    constructor(x, y, color, grid) {
        super(x, y, color, 'H', grid)
        this.name = 'Horse'
        this.movements = [
            [1, -2, false],
            [1, 2, false],
            [-1, -2, false],
            [-1, 2, false],
            [2, 1, false],
            [-2, 1, false],
            [2, -1, false],
            [-2, -1, false],
        ]
        this.takeables = [
            [1, -2, false],
            [1, 2, false],
            [-1, -2, false],
            [-1, 2, false],
            [2, 1, false],
            [-2, 1, false],
            [2, -1, false],
            [-2, -1, false],
        ]
    }
}

class Fool extends Piece {
    constructor(x, y, color, grid) {
        super(x, y, color, 'F', grid)
        this.name = 'Fool'
        this.movements = [
            [1, -1, true],
            [-1, -1, true],
            [1, 1, true],
            [-1, 1, true],
        ]
        this.takeables = [
            [1, -1, true],
            [-1, -1, true],
            [1, 1, true],
            [-1, 1, true],
        ]
    }
}

class Queen extends Piece {
    constructor(x, y, color, grid) {
        super(x, y, color, 'Q', grid)
        this.name = 'Queen'
        this.movements = [
            [1, -1, true],
            [-1, -1, true],
            [1, 1, true],
            [-1, 1, true],
            [0, -1, true],
            [-1, 0, true],
            [0, 1, true],
            [1, 0, true],
        ]
        this.takeables = [
            [1, -1, true],
            [-1, -1, true],
            [1, 1, true],
            [-1, 1, true],
            [0, -1, true],
            [-1, 0, true],
            [0, 1, true],
            [1, 0, true],
        ]
    }
}

class King extends Piece {
    constructor(x, y, color, grid) {
        super(x, y, color, 'K', grid)
        this.name = 'King'
        this.movements = [
            [1, -1, false],
            [-1, -1, false],
            [1, 1, false],
            [-1, 1, false],
            [0, -1, false],
            [-1, 0, false],
            [0, 1, false],
            [1, 0, false],
        ]
        this.takeables = [
            [1, -1, false],
            [-1, -1, false],
            [1, 1, false],
            [-1, 1, false],
            [0, -1, false],
            [-1, 0, false],
            [0, 1, false],
            [1, 0, false],
        ]
    }
}


export { 
    Grid, 
    Pawn, 
    Tower, 
    Horse, 
    Fool, 
    Queen, 
    King, 
    color1, 
    color2
}