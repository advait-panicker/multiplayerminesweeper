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
        for (let i = 0; i < this.gridSize; i++) {
            this.grid[i] = new Cell(0);
        }
        while (this.mines.length < mineCount) {
            const pos = Math.floor(Math.random()*this.gridSize);
            if (this.mines.indexOf(pos) == -1) {
                this.mines.push(pos);
                for (let y = -1; y < 2; y++) {
                    for (let x = -1; x < 2; x++) {
                        let xpos = pos % gridWidth + x;
                        let ypos = Math.floor(pos/gridWidth) + y;
                        if (!(xpos >= gridWidth || xpos < 0 || ypos >= gridWidth || ypos < 0) && this.grid[pos+y*gridWidth+x].value != -1) {
                            this.grid[pos+y*gridWidth+x].value++;
                        }
                    }
                }
                this.grid[pos].value = -1;
            }
        }
        for (let i = 0; i < this.gridSize; i++) {
            this.viewable[i] = this.grid[i].covered ? this.grid[i].flagged : this.grid[i].value;
        }
    }
    flag(pos) {
        if (typeof this.viewable[pos] == 'boolean') {
            this.viewable[pos] = !this.viewable[pos];
        }
    }
    show(pos) {
        this.viewable[pos] = this.grid[pos].value;
    }
    uncover(pos) {
        this.show(pos);
        if (this.grid[pos].value == 0) {
            for (let y = -1; y <= 1; y++) {
                let j = Math.floor(pos/this.gridWidth) + y;
                if (j < 0 || j >= this.gridWidth) {break;}
                for (let x = -1; x <= 1; x++) { 
                    let i = pos % this.gridWidth + x;
                    if (i < 0 || i >= this.gridWidth) {break;}
                    let newpos = pos + y * this.gridWidth + x;
                    console.log(newpos);
                    if (this.grid[newpos].value != -1 && typeof this.viewable[newpos] == 'boolean') {
                        if (this.grid[newpos].value == 0) {
                            this.uncover(newpos);
                        } else {
                            this.show(newpos);
                        }
                    }
                }
            }
        }
    }
    checkState() {
        let win = true;
        for (let i = 0; i < this.mineCount; i++) {
            let cell = this.viewable[this.mines[i]];
            if (cell != true && cell != -1) {
                win = false;
            }
        }
        return win;
    }
}
module.exports = Grid;