roleSpawner = {

    run: function(roomId) {
	    var store = {
	        'harvester': 2,
	        'worker': 6,
	        'reserver': 1,
	    };

	    for(role in store) {
	        var count = store[role];
	        var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.memory.home == roomId);
	        if(creeps.length < count) {

	            var build = undefined;
	            switch (role) {
                    case 'harvester':
                        build = roleSpawner.currentHarvesterBuild();
                        break;
	                case 'worker':
	                    build = roleSpawner.currentWorkerBuild();
	                    break;
	                case 'reserver':
	                    build = roleSpawner.currentReserverBuild();
	                    break;
                    case 'claimer':
                        build = roleSpawner.currentClaimerBuild();
                        break;
                    case 'settler':
                        build = roleSpawner.currentSettlerBuild();
                        break;
	            }
                var spawnName = Memory[roomId].spawns[0];

                var targetHome = roomId;
                if(role == 'settler') {
                    targetHome = Memory.expansionTarget;
                }

		        var newName = Game.spawns[spawnName].createCreep(build, undefined, {role: role, home: targetHome});
                if(newName != ERR_BUSY && newName != ERR_NOT_ENOUGH_ENERGY) {
                    console.log('spawning new ' + role + ': ' + newName);
                }
	        }
	    }
    },

    assembleBuild: function(stats) {
        var build = [];
        for(part in stats) {
            for(var i=0; i < stats[part]; i++) {
                var partCode = undefined;
                switch (part) {
                    case 'WORK':
                        partCode = WORK;
                        break;
                    case 'CARRY':
                        partCode = CARRY;
                        break;
                    case 'MOVE':
                        partCode = MOVE;
                        break;
                }

                build.push(partCode);
            }
        }
        return build;
    },

    currentWorkerBuild: function() {
        var spawnRoomCapacity = Game.rooms[Memory.home].energyCapacityAvailable;
        if(spawnRoomCapacity >= 1300) {
            return roleSpawner.assembleBuild({
                WORK: 4,
                CARRY: 7,
                MOVE: 11,
            })
        } else if(spawnRoomCapacity >= 800) {
            return roleSpawner.assembleBuild({
                WORK: 2,
                CARRY: 5,
                MOVE: 7,
            })
        } else if(spawnRoomCapacity >= 550) {
            return roleSpawner.assembleBuild({
                WORK: 2,
                CARRY: 3,
                MOVE: 4,
            })
        } else {
            return [WORK,CARRY,MOVE];
        }
    },

    currentHarvesterBuild: function() {
        var spawnRoomCapacity = Game.rooms[Memory.home].energyCapacityAvailable;
        if(spawnRoomCapacity >= 1300) {
            return roleSpawner.assembleBuild({
                WORK: 6,
                CARRY: 4,
                MOVE: 6,
            })
        } else if(spawnRoomCapacity >= 800) {
            return roleSpawner.assembleBuild({
                WORK: 4,
                CARRY: 4,
                MOVE: 4,
            })
        } else if(spawnRoomCapacity >= 550) {
            return roleSpawner.assembleBuild({
                WORK: 3,
                CARRY: 2,
                MOVE: 3,
            })
        } else {
            return [WORK,CARRY,MOVE];
        }
    },

    currentReserverBuild: function() {
        return [CLAIM, CLAIM, MOVE, MOVE];
    },

    currentClaimerBuild: function() {
        return [CLAIM, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
    },

    currentSettlerBuild: function() {
        return roleSpawner.assembleBuild({
            WORK: 4,
            CARRY: 4,
            MOVE: 8,
        })
    },
}

module.exports = roleSpawner;
