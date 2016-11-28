var actions = require('actions')
var _ = require('lodash')

var roleClaimer = {
    run: function(creep) {

        var targetRoom = Memory.expansionTarget;

        if(creep.carry.energy < creep.carryCapacity) {
            actions.pickupEnergy(creep);
        }

        if(Game.rooms[targetRoom] == undefined) {
            var targetPos = Game.flags.expansionTarget;
            creep.moveTo(targetPos);
            return;
        }

        var controller = Game.rooms[targetRoom].controller;

        if(controller.my) {
            if (creep.upgrade(controller) != 0) {
                creep.moveTo(controller);
            }
        } else {
            if (creep.claimController(controller) != 0) {
                creep.moveTo(controller);
            }
        }
    }
};

module.exports = roleClaimer;
