var actions = require('actions')
var _ = require('lodash')

var roleHarvester =
    run: function(creep) {
        if(creep.room.name != Memory.home) {
            actions.goHome(creep);
        } else {
            actions.harvest(creep);
	    }
    }
};

module.exports = roleHarvester;
