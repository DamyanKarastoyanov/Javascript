const { Progress } = require('./progress.js');
const { Loot } = require('./loot.js');
const { Currency } = require('./currencies.js');
const { Item } = require('./item.js')
const { Shop } = require('./shop.js');
const { rewards } = require("../data/rewards.js");

class Player {
    // properties
    currencies = new Currency;
    progress = new Progress;
    loot = new Loot;
    skinCollection = [];

    constructor (){
        this.currencies.tokens['Worlds 2022'] += 200;
        this.loot.orbs['Worlds 2022'] += 4;
    }
// Methods:
    addTheItem(item){
        switch(item.type){
            case 'Skin': this.skinCollection.push(item.description); break;
            case 'BE': this.loot.essences['BE'] += +item.quantity; break;
            case 'ME': this.loot.essences['ME'] += +item.quantity; break;
            case 'OE': this.loot.essences['OE'] += +item.quantity; break;
            case 'Orb': this.loot.orbs[item.description]++ ;break;
            case 'Bag': this.loot.bags[item.description]++ ;break;
            default: 'Doesn"t work.' ;break;
        }
    }
    // -- buySomething() -> parameters are the shop and an item from it.
    buySomething(shop, item) {
        // check if the shop exists.
        let currShop = Shop[shop];
        if (!currShop) {
            console.log('The',shop,"shop doesn't exist in the system.");
            return;
        } else {
            let currCurrency = this.currencies.tokens[shop];
            // check if corresponding currency is enough
                if( currShop[item] > currCurrency ) {
                    let difference = currShop[item] - this.currencies.tokens[shop] ;
                    console.log('Unsufficient token amount:', difference);
                } else {
                    // check if the item exists in the shop
                    if( Object.keys(currShop).includes(item)) {
                        this.currencies.tokens[shop] -= currShop[item];
                        console.log('Congrats you successfully bought',item,'\n Remaining',shop,'tokens:', this.currencies.tokens[shop]);    
                    } else {
                        console.log("The chosen item (",item,") doesn't exist in",shop,'shop. \n');
                    }
                }
            // add it to the correct part in the collection
            let currItem = new Item(item.split(' '));
            this.addTheItem(currItem);
        }
    }
    // -- gainRewards() -> based on his level, setting takenRewardsLevel to that level.
    gainExperience(experience){
        let currProgress = this.progress;
        currProgress.currLvlExp+=experience;
        while ( currProgress.currLvlExp >= currProgress.levelUpRequirement ){
            currProgress.currLvlExp -= currProgress.levelUpRequirement;
            currProgress.currentLevel++;
            currProgress.levelUpRequirement = currProgress.calculateRequirement(currProgress.currentLevel);

            console.log('Congrats you leveled up', currProgress.currentLevel);
        }

    }
    gainRewards(level){

    }
    // -- rerollSkins() -> parameters are 3 skins that must be in his skin collection.
    // -- disenchantSkin() -> parameters is a skin the player must have.
    // -- permanentASkin() -> a skin to be removed.
}

module.exports = {
    Player
}

// Add Complexive Class for each offer in the shop