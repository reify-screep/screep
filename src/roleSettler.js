var actions = require('actions')
var _ = require('lodash')

var roleSettler = {
    run: function(creep) {

        var dest = Game.flags.expansionTarget;

        if(creep.room.name != dest.room.name) {
            creep.moveTo(dest);
        } else {

            if(creep.carry.energy == 0) {
                creep.memory.state = 'settlerHarvesting';
            } else if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.state = 'deciding';
            }

            var state = creep.memory.state;

            if(state == 'deciding') {
                actions.newJob(creep);
                console.log(creep.memory.state);
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
