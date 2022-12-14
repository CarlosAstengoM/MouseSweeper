//Copyright(c) Carlos Astengo 2022, All rights reserved

import Cell from "./Cell.js";

export default class Grid{

    constructor(size, mines)
    {
        this.size = size;
        this.mines = mines;
        this.grid = []
        this.BuildGrid();
        this.PopulateGrid();
        this.TraverseThroughGrid();
    }  

    BuildGrid()
    {
        for (let x = 0; x < this.size; x++)
        {
            this.grid[x] = [];
            for (let y = 0; y < this.size; y++)
            {
                this.grid[x][y] = new Cell();
            }
        }
    }

    //Place bombs in the grid
    PopulateGrid()
    {
        let x = Math.floor(Math.random()*this.size);
        let y = Math.floor(Math.random()*this.size);
        for(let i=0; i<this.mines; i++)
        {
            while(this.grid[x][y].hasBomb)
            {
                x = Math.floor(Math.random()*this.size);
                y = Math.floor(Math.random()*this.size);
            }
            this.grid[x][y].hasBomb = true;
        }
    }

    TraverseThroughGrid()
    {
        for (let x = 0; x < this.size; x++)
        {
            for (let y = 0; y < this.size; y++)
            {
                this.CountNeighbors(x,y);
            }
        }
    }

    CountNeighbors(x,y)
    {
        let count = 0;
        for (let i = -1; i <= 1; i++)
        {
            for (let j = -1; j <= 1; j++)
            {
                //Inside the range of the grid
                if(x+i < 0 || x+i >= this.size || y+j < 0 || y+j >= this.size)
                {
                    continue
                }
                //Skips counting itself
                if(i == 0 && j == 0)
                {
                    continue;
                }

                if(this.grid[x+i][y+j].hasBomb)
                {
                    count++;
                }
            }
        }
        this.grid[x][y].neighborBombCount = count;
    }

    //Checks if all bombs have been flagged and all non-bomb tiles are revealed
    HasWon()
    {
        for (let x = 0; x < this.size; x++)
        {
            for (let y = 0; y < this.size; y++)
            {
                if(this.grid[x][y].hasBomb)
                {
                    //A bomb is not flagged
                    if(!this.grid[x][y].hasFlag)
                    {
                        return false;
                    }
                }
                else
                {
                    //A non-bomb cell is not revealed
                    if(!this.grid[x][y].revealed)
                    {
                        return false;
                    }
                }
            }
        }
        return true
    }

    CountScore()
    {
        const scorePerCell = 100;
        let score = 0;

        for (let x = 0; x < this.size; x++)
        {
            for (let y = 0; y < this.size; y++)
            {
                let cell = this.grid[x][y];
                if(cell.hasFlag)
                {
                    if(cell.hasBomb)
                    {
                        score += scorePerCell;
                    }
                    else
                    {
                        score -= scorePerCell/2;
                    }
                }
            }
        }
        return score;
    }
}