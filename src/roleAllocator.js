/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('manager.task_queue');
 * mod.thing == 'a thing'; // true
 */

roleAllocator = {

    spawnNecessary: function() {
	var store = {
	    'generalist': 4,
	};

	for(role in store) {
	    var count = store[role];
	    var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
	    if(creeps.length < count) {
		var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: role});
		console.log('spawning new ' + role + ': ' + newName);
	    }
	}
    }
}

module.exports = roleAllocator;
