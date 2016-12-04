var roleReserver = require('roleReserver')

roleSpawner = {

    run: function(roomId) {

	    var roomStore = {
	        'W8N68': {
                'harvester': 2,
                'worker': 7,
                'reserver': Object.keys(Memory.claimTargets).length,
                'distanceHarvester': 6,
                //'claimer': 1,
                //'settler': 4,
                //'attacker': 1,
                //'sniper': 1,
	        },
	        'W6N68': {
	            'harvester': 2,
	            'worker': 6,
	        }
	    };

	    var store = roomStore[roomId];

        if(!roleReserver.expiringSoon()) {
            store['reserver'] = 0;
        }

	    for(role in store) {
	        var count = store[role];
	        var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);// && creep.memory.home == roomId);
	        if(creeps.length < count) {

	            var build = undefined;
	            switch (role) {
                    case 'harvester':
                        build = roleSpawner.currentHarvesterBuild();
                        break;
	                case 'worker':
	                    build = roleSpawner.currentWorkerBuild();
	                    break;
	                case 'roadLayer':
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
                    case 'attacker':
                        build = roleSpawner.currentAttackerBuild();
                        break;
                    case 'distanceHarvester':
                        build = roleSpawner.currentDistanceHarvesterBuild();
                        break;
                    case 'sniper':
                        build = roleSpawner.currentSniperBuild();
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
                    case 'ATTACK':
                        partCode = ATTACK;
                        break;
                     case 'RANGED_ATTACK':
                         partCode = RANGED_ATTACK;
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
                CARRY: 8,
                MOVE: 6,
            })
        } else if(spawnRoomCapacity >= 800) {
            return roleSpawner.assembleBuild({
                WORK: 2,
                CARRY: 6,
                MOVE: 4,
            })
        } else if(spawnRoomCapacity >= 550) {
            return roleSpawner.assembleBuild({
                WORK: 2,
                CARRY: 3,
                MOVE: 3,
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
                MOVE: 3,
            })
        } else if(spawnRoomCapacity >= 800) {
            return roleSpawner.assembleBuild({
                WORK: 4,
                CARRY: 4,
                MOVE: 2,
            })
        } else if(spawnRoomCapacity >= 550) {
            return roleSpawner.assembleBuild({
                WORK: 3,
                CARRY: 3,
                MOVE: 2,
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

    currentAttackerBuild: function() {
        return roleSpawner.assembleBuild({
            ATTACK: 10,
            MOVE: 10,
        })
    },

    currentSniperBuild: function() {
        return roleSpawner.assembleBuild({
            RANGED_ATTACK: 1,
            MOVE: 1,
        })
    },

    currentDistanceHarvesterBuild: function() {
        return roleSpawner.assembleBuild({
            WORK: 5, // 500 + 250
            CARRY: 15, // 500 + 500
            MOVE: 10,
        })
    },
}

module.exports = roleSpawner;
