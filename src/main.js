var roleAllocator = require('roleAllocator')
var roleGeneralist = require('roleGeneralist')
var _ = require('lodash')

module.exports.loop = function () {

    for(var name in Memory.creeps) {
	    if(!Game.creeps[name]) {
	        delete Memory.creeps[name];
	        console.log('Clearing non-existing creep memory:', name);
	    }
    }

    for(var sourceId in Memory.energySources) {
        var creeps = Memory.energySources[sourceId];
        var toDelete = [];
        for (var i=0; i < creeps.length; i++) {
            if(!Game.creeps[creeps[i]]) {
                toDelete.push(creeps[i])
            }
        }
        _.pullAll(creeps, toDelete);
    }

    roleAllocator.spawnNecessary()

    for(var name in Game.creeps) {
	    var creep = Game.creeps[name];
	    if(creep.memory.role == 'generalist') {
	        roleGeneralist.run(creep);
	    }
    }
}
