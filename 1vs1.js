let PLUGIN_NAME = "1vs1";   
let PLUGIN_DESCRIPTION = "Minigame 1vs1 for LiteLoaderBDS."; 
let VERSION = [1, 0, 0];
let AUTHOR = "VennV";   

if (!ll.requireVersion(2, 1, 4))
{
    throw new Error("This plugin requires VennV version 2.1.4 or higher");
}
else
{
    logger.info("Plugin is enabled");
    ll.registerPlugin(PLUGIN_NAME, PLUGIN_DESCRIPTION, VERSION, {
        "Author":AUTHOR
    });
};

let config = new JsonConfigFile(".\\plugins\\1vs1\\config.json");

const waiting = 0;
const playing = 1;

var arenas = {
    arena1: {
        name: "arena1",
        pos1: {
            x: -19,
            y: 67,
            z: -45
        },
        pos2: {
            x: -19,
            y: 67,
            z: -45
        },
        waiting: {
            x: -19,
            y: 67,
            z: -45
        },
        players: [],
        status: waiting
    }
}

function inArena(player)
{
    for (var arena in arenas)
    {
        if (arenas[arena].status == waiting)
        {
            for (var i = 0; i < arenas[arena].players.length; i++)
            {
                if (arenas[arena].players[i] == player)
                {
                    return true;
                }
            }
        }
    }
    return false;
}

function onJoin(player)
{
    if(!inArena(player))
    {
        for (var arena in arenas)
        {
            if (arenas[arena].status == waiting)
            {
                arenas[arena].players.push(player);
                player.sendText("You have joined the arena " + arenas[arena].name);
                player.sendText("Waiting for another player to join...");
                if (arenas[arena].players.length == 2)
                {
                    arenas[arena].status = playing;

                    let player1 = arenas[arena].players[0];
                    let player2 = arenas[arena].players[1];

                    player1.sendText("The game has started!");
                    player1.teleport(arenas[arena].pos1.x, arenas[arena].pos1.y, arenas[arena].pos1.z);

                    player2.sendText("The game has started!");
                    player2.teleport(arenas[arena].pos2.x, arenas[arena].pos2.y, arenas[arena].pos2.z);
                }
            }
        }
    }
    else
    {
        player.sendText("You are already in an arena!");
    }
}

function onLeave(player)
{
    for (var arena in arenas)
    {
        if (arenas[arena].status == waiting)
        {
            for (var i = 0; i < arenas[arena].players.length; i++)
            {
                if (arenas[arena].players[i] == player)
                {
                    arenas[arena].players.splice(i, 1);
                }
            }
        }
    }
}

mc.listen('onAttackEntity', function (attacker, victim)
{

    if (attacker.isPlayer() && victim.isPlayer())
    {
        for (var arena in arenas)
        {
            if (arenas[arena].status == playing)
            {
                if(
                    arenas[arena].players[0] == attacker &&
                    arenas[arena].players[1] == victim
                )
                {
                    if(arenas[arena].players[0].getHealth() > 0)
                    {
                        arenas[arena].players[0].sendText("You have won the game!");
                        arenas[arena].players[1].sendText("You have lost the game!");
                        arenas[arena].status = waiting;
                        arenas[arena].players = [];
                    }
                }
            }
        }
    }
});

mc.listen('onJoin', function(player){
    onJoin(player);
});