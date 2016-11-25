/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('manager.task_queue');
 * mod.thing == 'a thing'; // true
 */

roleAllocator = {
    //setGoal: function(role, count) {
    //    store[role] = count;
    //}
    spawnNecessary: function() {
	var store = {
	    'harvester': 1,
	    'upgrader': 1,
	    'builder': 3,
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
