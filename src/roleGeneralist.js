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
	        var next = _.shuffle(options)[0];
	        creep.memory.state = next;
	    }
    }
};

module.exports = roleGeneralist;
