export default class BoardVisualizer
{
    constructor(board)
    {
        this.boardElement = document.getElementById("mineBoard");
        this.board = board;
        this.BuildBoard();
    }

    BuildBoard()
    {
        let markup = "<table>";

        for (let x = 0; x < this.board.size; x++)
        {
            markup += "<tr>";
            for (let y = 0; y < this.board.size; y++)
            {
                markup += `<td class= "Cell" data-x="${x}" data-y="${y}" id = "cell(${x},${y})"></td>`;
            }
            markup += "</tr>";
        }
        
        markup += "</table>";
        this.boardElement.innerHTML = markup;
    }

    Reveal(x,y)
    {
        if(this.board.grid[x][y].hasFlag)
        {
            return;
        }
        
        const cell = this.board.grid[x][y];
        const markup = document.getElementById(`cell(${x},${y})`);

        cell.revealed = true;
        markup.classList.add("Clicked");
        markup.innerHTML = cell.neighborBombCount == 0 ? " " : cell.neighborBombCount;
    }

    RevealNeighbors(x,y)
    {
        for (let i = -1; i <= 1; i++)
        {
            for (let j = -1; j <= 1; j++)
            {
                if(x+i < 0 || x+i >= this.board.size || y+j < 0 || y+j >= this.board.size)
                {
                    continue;
                }

                if(i == 0 && j == 0)
                {
                    continue;
                }

                if(this.board.grid[x+i][y+j].checked)
                {
                    continue;
                }

                this.board.grid[x+i][y+j].checked = true;

                this.Reveal(x+i,y+j);

                if(this.board.grid[x+i][y+j].neighborBombCount == 0)
                {
                    this.RevealNeighbors(x+i,y+j);
                }

            }
        }

    }

    Flag(x,y)
    {
        this.board.grid[x][y].hasFlag = true;
        document.getElementById(`cell(${x},${y})`).innerHTML = "☣️";
    }
    
    Unflag(x,y)
    {
        this.board.grid[x][y].hasFlag = false;
        document.getElementById(`cell(${x},${y})`).innerHTML = "";
    }

    ShowMines()
    {
        for (let x = 0; x < this.board.size; x++)
        {
            for (let y = 0; y < this.board.size; y++)
            {
                let cell = this.board.grid[x][y];

                if(cell.hasFlag)
                {
                    if(!cell.hasBomb)
                    {
                        document.getElementById(`cell(${x},${y})`).classList.add("Incorrect");
                    }
                    else
                    {
                        document.getElementById(`cell(${x},${y})`).classList.add("Correct");
                    }
                }

                else if(cell.hasBomb)
                {
                    document.getElementById(`cell(${x},${y})`).innerHTML = "☠️";
                }
            }
        }
    }

    Debug()
    {
        for (let x = 0; x < this.board.size; x++)
        {
            for (let y = 0; y < this.board.size; y++)
            {
                if(this.board.grid[x][y].hasBomb)
                {
                    document.getElementById(`cell(${x},${y})`).className = "B";
                }
                else
                {
                    document.getElementById(`cell(${x},${y})`).innerHTML = this.board.grid[x][y].neighborBombCount;
                }
            }
        }
    }

}