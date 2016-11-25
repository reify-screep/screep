var garbageCollector = require('garbageCollector')
var roleAllocator = require('roleAllocator')
var roleGeneralist = require('roleGeneralist')
var _ = require('lodash')

module.exports.loop = function () {

    garbageCollector.collect()
    roleAllocator.spawnNecessary()

    for(var name in Game.creeps) {
	    var creep = Game.creeps[name];
	    if(creep.memory.role == 'generalist') {
	        roleGeneralist.run(creep);
	    }
    }
}
