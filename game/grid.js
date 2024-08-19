function clamp(a, min, max) {
    return Math.max(Math.min(a, max), min);
}
class Cell {
    constructor(value) {
        this.value = value;
        this.covered = true;
        this.flagged = false;
    }
}
const lst = [[-1, 0], [1, 0], [0, -1], [0, 1]];
class Grid {
    constructor (gridWidth, mineCount) {
        this.gridWidth = gridWidth;
        this.mineCount = mineCount;
        this.gridSize = gridWidth*gridWidth;
        this.grid = [];
        this.mines = [];
        this.viewable = [];
        this.resetBoard();
        this.firstTurn = true;
    }
    resetBoard() {
        for (let i = 0; i < this.gridSize; i++) {
            this.grid[i] = new Cell(0);
        }
        while (this.mines.length < this.mineCount) {
            const pos = Math.floor(Math.random()*this.gridSize);
            if (this.mines.indexOf(pos) == -1) {
                this.mines.push(pos);
                for (let y = -1; y < 2; y++) {
                    for (let x = -1; x < 2; x++) {
                        let xpos = pos % this.gridWidth + x;
                        let ypos = Math.floor(pos/this.gridWidth) + y;
                        if (!(xpos >= this.gridWidth || xpos < 0 || ypos >= this.gridWidth || ypos < 0) && this.grid[pos+y*this.gridWidth+x].value != -1) {
                            this.grid[pos+y*this.gridWidth+x].value++;
                        }
                    }
                }
                this.grid[pos].value = -1;
            }
        }
        for (let i = 0; i < this.gridSize; i++) {
            this.viewable[i] = {value : this.grid[i].covered ? this.grid[i].flagged : this.grid[i].value, color : null};
        }
    }
    flag(pos, player) {
        if (typeof this.viewable[pos].value == 'boolean') {
            this.viewable[pos].value = !this.viewable[pos].value;
            this.viewable[pos].color = this.viewable[pos].value ? player.color : null;
            player.flags++;
        }
    }
    show(pos, player) {
        this.viewable[pos].value = this.grid[pos].value;
        if (this.viewable[pos].color == null) {
            this.viewable[pos].color = player.color;
            if (this.viewable[pos].value == -1) {
                player.mines++;
            }
            player.uncovers++;
        }
    }
    uncover(pos, player) {
        while (this.firstTurn && this.grid[pos].value != 0) {
            this.resetBoard();
        }
        this.firstTurn = false;
        this.show(pos, player);
        if (this.grid[pos].value == 0) {
            for (let y = -1; y <= 1; y++) {
                let j = Math.floor(pos/this.gridWidth) + y;
                if (j < 0 || j >= this.gridWidth) {break;}
                for (let x = -1; x <= 1; x++) { 
                    let i = pos % this.gridWidth + x;
                    if (i < 0 || i >= this.gridWidth) {break;}
                    let newpos = pos + y * this.gridWidth + x;
                    console.log(newpos);
                    if (this.grid[newpos].value != -1 && typeof this.viewable[newpos].value == 'boolean') {
                        if (this.grid[newpos].value == 0) {
                            this.uncover(newpos, player);
                        } else {
                            this.show(newpos, player);
                        }
                    }
                }
            }
        }
    }
    checkState() {
        let win = true;
        for (let i = 0; i < this.mineCount; i++) {
            let cell = this.viewable[this.mines[i]].value;
            if (cell != true && cell != -1) {
                win = false;
            }
        }
        return win;
    }
}
module.exports = Grid;