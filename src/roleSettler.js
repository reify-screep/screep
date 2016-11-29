var actions = require('actions')
var _ = require('lodash')

var roleSettler = {
    run: function(creep) {

        if(creep.room.name != creep.memory.home) {

            var dest = Game.rooms[creep.memory.home].controller;
            if(!dest) {
                dest = Game.flags.expansionTarget;
            }
            creep.moveTo(dest);
        } else {

            if(creep.carry.energy == 0) {
                creep.memory.state = 'settlerHarvesting';
            }

            var state = creep.memory.state;

            if(state == 'deciding') {
                actions.newJob(creep);
                state = creep.memory.state;
            }

            if(state == 'settlerHarvesting') {
                actions.workerHarvest(creep);
            } else if(state == 'upgrading') {
                actions.upgrade(creep);
            } else if(state == 'storing') {
                actions.storeEnergy(creep);
            } else if(state == 'building') {
                actions.build(creep);
            } else if(state == 'repairing') {
                actions.repair(creep);
            }

        }

    }
};

module.exports = roleSettler;
