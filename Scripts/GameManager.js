//Copyright(c) Carlos Astengo 2022, All rights reserved

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
        this.AddEventListeners();
        
    }

    AddEventListeners()
    {
        //Left-click
        document.getElementById("mineBoard").addEventListener("click",event =>
        {
            //Don`t continue if game is over
            if(this.gameEnded)
            {
                return;
            }

            const x = parseInt(event.target.dataset.x);
            const y = parseInt(event.target.dataset.y);

            //When pressed in the space between cells it returns NaN
            if(isNaN(x) || isNaN(y))
            {
                return;
            }
            
            //Check if its within grid range
            if(x < 0 || x >= this.grid.size || y < 0 || y >= this.grid.size)
            {
                return;
            }

            let cell = this.grid.grid[x][y];

            //First click is different than the rest
            if(this.firstClick )
            {
                this.firstClick = false
                //Make sure first click is never a bomb
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

            //Don't click flagged 
            if(cell.hasFlag)
            {
                return;
            }
            //If its a bomb you lose
            if(cell.hasBomb)
            {
                this.Lose();
                return;
            }
            //If not reveal it and try to reveal neighbors
            this.boardVisualizer?.Reveal(x,y);
            if(cell.neighborBombCount == 0)
            {
                this.boardVisualizer?.RevealNeighbors(x,y);
            }
            //Check if you won
            this.CheckGameState();
        })

        //Right click
        document.addEventListener('contextmenu', event => 
        {
            //Don't allow to click if the game has ended or right-click as your first move
            if(this.gameEnded || this.firstClick)
            {
                return;
            }
            
            const x = parseInt(event.target.dataset.x);
            const y = parseInt(event.target.dataset.y);

            //When pressed in the space between cells it returns NaN
            if(isNaN(x) || isNaN(y))
            {
                return;
            }
            //Check if its within grid range
            if(x < 0 || x >= this.grid.size || y < 0 || y >= this.grid.size)
            {
                return;
            }

            const cell = this.grid.grid[x][y];
            //Can't flagged already shown items
            if(cell.revealed)
            {
                return;
            }
            //Toggle between flagging and removing flag
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
            //Check if you won
            this.CheckGameState();
        })

        //Resets all variables
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
            this.UpdateTimer();
            this.StopTimer();
        });
        //Close after any click on the screen
        this.popUp.addEventListener("click", event =>
        {
            this.popUp.close();
        });
        //Debug mode
        document.addEventListener('keypress', event =>
        {
            if (event.key == 'Enter') 
            {
                this.boardVisualizer.Debug();
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
        this.CalculateScore();
        this.LosePopUp();
        this.StopTimer();
        this.gameEnded = true;
    }

    Win()
    {
        this.boardVisualizer.ShowMines();
        this.CalculateScore();
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
    }

    //Write win message on the dialogue tag
    WinPopUp()
    {
        let markup = "";
        markup += "<p>You Won!</p>";
        markup += `<p>Your Score is ${this.score}!</p>`;
        markup += `<p>It took you ${this.currentTimer} seconds to finish!</p>`;
        this.popUp.innerHTML = markup;
        this.popUp.showModal();
    }

    //Write lose message on the dialogue tag
    LosePopUp()
    {
        let markup = "";
        markup += "<p>You Lost</p>";
        markup += `<p>Your Score is ${this.score}</p>`;
        markup += `<p>It took you ${this.currentTimer} seconds to lose</p>`;
        this.popUp.innerHTML = markup;
        this.popUp.showModal();
    }

    CalculateScore()
    {
        this.score = this.grid.CountScore() - this.currentTimer;
    }
}