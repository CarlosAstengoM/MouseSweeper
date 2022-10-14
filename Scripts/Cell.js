
export default class Cell
{
    constructor()
    {
        this.hasBomb = false;
        this.hasFlag = false;
        this.revealed = false;
        this.checked = false;
        this.neighborBombCount = 0;
    }
}