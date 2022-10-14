import Grid from "./Grid.js";
import BoardVisualizer from "./BoardVisualizer.js";

const size = 15;
const mines = 20;

export default class GameManager
{
    constructor()
    {
        this.firstClick = true;
        this.gameEnded = false;
        this.currentMines = mines;
        this.currentTimer = 0;
        this.score = 0;
        this.grid = new Grid(size, mines);
        this.boardVisualizer = new BoardVisualizer(this.grid);
        this.mineCounter = document.getElementById("mineCounter");
        this.timeCounter = document.getElementById("timeCounter");
        this.popUp = document.getElementById("popUp");

        this.UpdateUI();
        this.UpdateTimer();

        document.getElementById("mineBoard").addEventListener("click",event =>
        {
            if(this.gameEnded)
            {
                return;
            }

            const x = parseInt(event.target.dataset.x);
            const y = parseInt(event.target.dataset.y);

            if(isNaN(x) || isNaN(y))
            {
                return;
            }
            
            if(x < 0 || x >= this.grid.size || y < 0 || y >= this.grid.size)
            {
                return;
            }

            let cell = this.grid.grid[x][y];

            if(this.firstClick )
            {
                this.firstClick = false
                if(cell.hasBomb)
                {
                    while(cell.hasBomb)
                    {
                        this.grid = new Grid(size,mines);
                        this.boardVisualizer = new BoardVisualizer(this.grid);
                        cell = this.grid.grid[x][y];
                    }   
                    this.firstClick = false;
                }
                this.StartTimer();
            }

            if(cell.hasFlag)
            {
                return;
            }

            if(cell.hasBomb)
            {
                this.Lose();
                return;
            }

            this.boardVisualizer?.Reveal(x,y);
            if(cell.neighborBombCount == 0)
            {
                this.boardVisualizer?.RevealNeighbors(x,y);
            }

            this.CheckGameState();
        })

        document.addEventListener('contextmenu', event => 
        {
            if(this.gameEnded || this.firstClick)
            {
                return;
            }
            
            const x = parseInt(event.target.dataset.x);
            const y = parseInt(event.target.dataset.y);
            
            if(isNaN(x) || isNaN(y))
            {
                return;
            }
            
            if(x < 0 || x >= this.grid.size || y < 0 || y >= this.grid.size)
            {
                return;
            }

            const cell = this.grid.grid[x][y];

            if(cell.revealed)
            {
                return;
            }

            if(cell.hasFlag)
            {
                this.currentMines++;
                this.boardVisualizer.Unflag(x,y);
            }
            else
            {
                if(this.currentMines <= 0)
                {
                    return;
                }
                this.currentMines--;
                this.boardVisualizer.Flag(x,y);
            }

            this.CheckGameState();
        })

        document.getElementById("RestartBtn").addEventListener("click", () => 
        {
            this.firstClick = true;
            this.gameEnded = false;
            this.currentMines = mines;
            this.currentTimer = 0;
            this.score = 0;
            this.grid = new Grid(size, mines);
            this.boardVisualizer = new BoardVisualizer(this.grid);

            this.UpdateUI();
            this.StopTimer();
            this.StartTimer();
        });

        this.popUp.addEventListener("click", event =>
        {
            this.popUp.close();
        });

        document.addEventListener('keypress', event =>
        {
            if (event.key == 'Enter') 
            {
                this.Debug();
            }
        });
    }

    CheckGameState()
    {
        this.UpdateUI();

        if(this.grid.HasWon())
        {
            this.Win();
        }
    }

    Lose()
    {
        this.boardVisualizer.ShowMines();
        this.LosePopUp();
        this.StopTimer();
        this.gameEnded = true;
    }

    Win()
    {
        this.boardVisualizer.ShowMines();
        this.WinPopUp();
        this.StopTimer();
        this.gameEnded = true;
    }

    UpdateUI()
    {
        this.mineCounter.innerHTML = this.currentMines;
    }

    UpdateTimer()
    {
        this.timeCounter.innerHTML = this.currentTimer;
    }

    StartTimer()
    {
        this.timer = window.setInterval( () =>
            {
                this.currentTimer++;
                this.UpdateTimer();
            } , 1000);
    }

    StopTimer()
    {
        window.clearInterval(this.timer);
        this.currentTimer = 0;
        this.UpdateTimer();
    }

    Debug()
    {
        this.boardVisualizer.Debug();
    }

    WinPopUp()
    {
        let markup = "";
        markup += "<p>You Won!</p>";
        markup += `<p>Your Score is ${this.score}!</p>`;
        markup += `<p>It took you ${this.currentTimer} seconds to finish!</p>`;
        this.popUp.innerHTML = markup;
        this.popUp.showModal();
    }

    LosePopUp()
    {
        let markup = "";
        markup += "<p>You Lost</p>";
        markup += `<p>Your Score is ${this.score}</p>`;
        markup += `<p>It took you ${this.currentTimer} seconds to finish</p>`;
        this.popUp.innerHTML = markup;
        this.popUp.showModal();
    }
}