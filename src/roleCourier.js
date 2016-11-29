var actions = require('actions')
var _ = require('lodash')

var roleCourier = {
    run: function(creep) {
        if(creep.carry.energy == 0) {
            var target = Game.rooms[Game.flags.distantEnergy.room];
            if(!creep.withdraw()) {
                creep.moveTo(Game.flags.distantEnergy)
            }
        } else {

        }


    }
};

module.exports = roleCourier;
