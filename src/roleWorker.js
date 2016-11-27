var actions = require('actions')
var _ = require('lodash')

var roleWorker = {

    run: function(creep) {

        if(creep.room.name != Memory.home) {
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
                console.log(creep.name + ' picking up')
                actions.pickupEnergy(creep);
            } else if(state == 'upgrading') {
                console.log(creep.name + ' upgrading')
                actions.upgrade(creep);
            } else if(state == 'storing') {
                console.log(creep.name + ' storing')
                actions.storeEnergy(creep);
            } else if(state == 'building') {
                actions.build(creep);
            }

	    }
    }
};

module.exports = roleWorker;
