var roleGeneralist = require('roleGeneralist')
var _ = require('lodash')

module.exports.loop = function () {

    for(var name in Memory.creeps) {
	if(!Game.creeps[name]) {
	    delete Memory.creeps[name];
	    console.log('Clearing non-existing creep memory:', name);
	}
    }

    roleAllocator.spawnNecessary()

    for(var name in Game.creeps) {
	var creep = Game.creeps[name];
	creep.memory.role == 'generalist'; // remove shortly! bootstrapping.
	if(creep.memory.role == 'generalist') {
	    roleGeneralist.run(creep);
	}
    }
}
