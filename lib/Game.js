const inquirer = require('inquirer');
const Enemy = require('./Enemy');
const Player = require('./Player');


function Game() {
    this.roundNumber = 0;
    this.isPlayerTurn = false;
    this.enemies = [];
    this.currentEnemy;
    this.player;
}

// set up enemy and player objects
Game.prototype.initializeGame = function() {
    this.enemies.push(new Enemy('goblin', 'sword'));
    this.enemies.push(new Enemy('orc', 'baseball bat'));
    this.enemies.push(new Enemy('skeleton', 'axe'));

    // currently fighting player
    this.currentEnemy = this.enemies[0];

    inquirer
    .prompt({
        type: 'text',
        name: 'name',
        message: 'What is your name?'
    })

    // destructure name from the prompt object
    .then(({ name }) => {
        this.player = new Player(name);

        //  kick off the first battle and then called again anytime a new round starts
       this.startNewBattle()
    })
};

Game.prototype.startNewBattle = function() {
    if(this.player.agility > this.currentEnemy.agility) {
        this.isPlayerTurn = true;
    } else {
        this.isPlayerTurn = false;
    }

    console.log('Your stats are as follows');
    console.table(this.player.getStats());
    console.log(this.currentEnemy.getDescription());

    // calls battle
    this.battle()
};

// Player turn:

// Prompt user to attack or use a Potion

// If using a Potion:

// Display list of Potion objects to user

// Apply selected Potion effect to Player

// If attacking:

// Subtract health from the Enemy based on Player attack value

// If Enemy turn:

// Subtract health from the Player based on Enemy attack value

Game.prototype.battle = function() {
    if(this.isPlayerTurn) {
        inquirer
        .prompt({
            type: 'list',
            message: 'What would you like to do?',
            name: 'action',
            choices: ['Attack', 'Use potion']
        })
        .then(( {action}) => {
            if(action === 'Use potion') {
               if(!this.player.getInventory()) {
                   console.log("You don't have any potions!");
                   return;
               }
               inquirer
               .prompt({
                   type: 'list',
                   message: 'Which potion would you like to use?',
                   name: 'action',
                   choices: this.player.getInventory().map((item, index) => `${index + 1}: ${item.name}`)
               })
               .then(({ action }) => {
                const potionDetails = action.split(': ');
            
                this.player.usePotion(potionDetails[0] - 1);
                console.log(`You used a ${potionDetails[1]} potion.`);
              });
            } else {
                const damage = this.player.getAttackValue();
                this.currentEnemy.reduceHealth(damage);

                console.log(`You attacked the ${this.currentEnemy.name}`);
                console.log(this.currentEnemy.getHealth());
            }
        });
    } 
};

module.exports = Game;