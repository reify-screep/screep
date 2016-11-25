var garbageCollector = require('garbageCollector')
var roleAllocator = require('roleAllocator')
var roleGeneralist = require('roleGeneralist')
var towerFirer = require('towerFirer')
var _ = require('lodash')

module.exports.loop = function () {

    Memory.home = 'W8N68';

    garbageCollector.collect();
    roleAllocator.spawnNecessary();
    towerFirer.fire(Memory.home);

    for(var name in Game.creeps) {
	    var creep = Game.creeps[name];
	    if(creep.memory.role == 'generalist') {
	        roleGeneralist.run(creep);
	    }
    }
}
