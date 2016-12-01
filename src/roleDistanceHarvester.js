var _ = require('lodash')

var roleDistanceHarvester = {

    run: function(creep) {

        var flags = [
            'distanceHarvestA',
            'distanceHarvestB',
            //'distanceHarvestC' // disabled until that player finishes dying
        ];

        // maybe do some roadwork
        if(creep.memory.harvesting == false && creep.carry.energy > 0) {
            console.log(creep.name + ' maybe laying roads');
            roleDistanceHarvester.layOrRepairRoads(creep);
            // if a creep runs out of energy while doing roadwork, give it the previous harvest target
            // again as that is presumably closer
            if(creep.carry.energy == 0) {
                creep.harvesting = true;
            }
        }

        // initialize a new creep correctly
        if(creep.memory.harvesting == undefined || creep.memory.target == undefined) {
            creep.memory.harvesting = false;
        }

        // done harvesting because we dropped at storage, so get a new random target room
        if(creep.carry.energy == 0 && creep.memory.harvesting == false) {
            creep.memory.harvesting = true;
            creep.memory.target = _.shuffle(flags)[0];
        }

        // done harvesting, so go home and dump in storage (doing roadwork along the way as per above)
        if(creep.carry.energy == creep.carryCapacity) {

            creep.memory.harvesting = false;

            if(creep.room.name != Memory.home) {
                creep.moveTo(Game.rooms[Memory.home].controller);
            } else {
                var storage = Game.rooms[Memory.home].storage;
                switch(creep.transfer(storage, RESOURCE_ENERGY)) {
                    case ERR_NOT_IN_RANGE:
                        creep.moveTo(storage);
                        break;
                }
            }

        // go to the target room, then find an energy in it and nom away
        } else if(creep.memory.harvesting) {
            if(creep.room.name != Game.flags[creep.memory.target].pos.roomName) {
                creep.moveTo(Game.flags[creep.memory.target]);
            } else {
               var target = creep.pos.findClosestByPath(FIND_SOURCES);
               if(creep.harvest(target)) {
                 creep.moveTo(target);
               }
            }
        } else {
            // default to going home
            creep.moveTo(Game.rooms[creep.memory.home].storage)
        }
    },

    layOrRepairRoads: function(creep) {

        var structures = creep.pos.lookFor(LOOK_STRUCTURES);
        var construction = creep.pos.lookFor(LOOK_CONSTRUCTION_SITES);
        if(structures.length != 0) {
            var roads = _.filter(structures, {'structureType': STRUCTURE_ROAD});
            console.log(creep.name + ' found roads ' + roads);
            if(roads.length != 0) {
                var road = roads[0];
                // there is a road here, maybe repair it
                if(road.hits / road.hitsMax < .8) {
                    creep.repair(road);
                }
            }
        } else if(construction.length != 0) {
            var constructionSite = construction[0];
            // there is construction here, build it
            console.log(creep.name + ' working on road');
            creep.build(constructionSite);
        } else {
            // nothing here, build a road
            console.log(creep.name + ' building new road site');
            creep.pos.createConstructionSite(STRUCTURE_ROAD);
        }

    }

};

module.exports = roleDistanceHarvester;
