function clamp(a, min, max) {
    return Math.max(Math.min(a, max), min);
}
class Cell {
    constructor(value) {
        this.value = value;
        this.covered = true;
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
            this.viewable[i] = this.grid[i].covered ? null : this.grid[i].value;
        }
    }
    show(pos) {
        this.viewable[pos] = this.grid[pos];
    }
    uncover(pos) {
        this.show(pos);
        if (this.grid[pos].value != -1) {
            lst.forEach((p) => {
                let x = p[0], y = p[1]; 
                let newpos = clamp(pos + y * this.gridWidth + clamp(x, 0, this.gridWidth-1), 0, this.gridSize-1);
                console.log(newpos);
                if (this.grid[newpos].value != -1 && this.viewable[newpos] == null) {
                    this.uncover(newpos);
                }
            });
        }
    }
}
module.exports = Grid;