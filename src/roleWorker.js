var actions = require('actions')
var _ = require('lodash')

var roleWorker = {

    run: function(creep) {

        if(creep.room.name != creep.memory.home) {
            actions.goHome(creep);
        } else {

            if(creep.carry.energy == 0) {
                creep.memory.state = 'pickingUp';
            }

            var state = creep.memory.state;

            if(state == 'deciding') {
                actions.newJob(creep);
                state = creep.memory.state;
            }

            if(state == 'pickingUp') {
                actions.pickupEnergy(creep);
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

module.exports = roleWorker;
