var actions = require('actions')
var _ = require('lodash')

var roleHarvester = {
    run: function(creep) {
        console.log('creep ' + creep.name + ' about to harvest')
        if(creep.room.name != Memory.home) {
            actions.goHome(creep);
        } else {
            actions.harvest(creep);
	    }
    }
};

module.exports = roleHarvester;
