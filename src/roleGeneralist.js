var workersActions = require('workersActions')
var _ = require('lodash')

var roleGeneralist = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    var state = creep.memory.state;
    	var options = ['upgrading', 'storing', 'building'];

	    workersActions.maybeHarvest(creep);

	    if(state == 'harvesting') {
    	    workersActions.harvest(creep);
    	} else if(state == 'upgrading') {
	        workersActions.upgrade(creep);
	    } else if(state == 'storing') {
	        workersActions.store(creep);
	    } else if(state == 'building') {
	        workersActions.build(creep);
	    } else if(state == 'deciding') {

            // always prioritize upgrading if it has not been done recently.
            // otherwise fill up all energy storage.
            // then randomly pick between build and upgrade, slightly biased towards build.

	        if(Memory.lastUpgraded + 1000 < Game.time) {
	            creep.memory.state = 'upgrading';
	        } else if(creep.room.energyCapacityAvailable > creep.room.energyAvailable) {
	            creep.memory.state = 'storing';
	        } else {
	            var next = _.shuffle(['upgrading', 'building', 'building'])[0];
                creep.memory.state = next;
	        }
	    }
    }
};

module.exports = roleGeneralist;
