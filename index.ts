import { CommandClient } from "detritus-client";
import { GatewayIntents } from "detritus-client-socket/lib/constants";
import { token } from "./token.json";

const started = Date.now();
let time = Date.now();

const commandClient = new CommandClient(token, {
  prefix: 'asdgwq43ewfae3fwawev',
  gateway: {
    intents: [
      GatewayIntents.DIRECT_MESSAGE_REACTIONS,
      GatewayIntents.DIRECT_MESSAGES,
      GatewayIntents.GUILD_BANS,
      GatewayIntents.GUILD_EMOJIS,
      GatewayIntents.GUILD_INVITES,
      GatewayIntents.GUILD_MEMBERS,
      GatewayIntents.GUILD_MESSAGE_REACTIONS,
      GatewayIntents.GUILD_MESSAGES,
      GatewayIntents.GUILD_VOICE_STATES,
      GatewayIntents.GUILDS
    ]
  }
});

commandClient.on("ready", () => {
  console.log(
    "Successfully connected to gateway",
    (Date.now() - started) / 1000,
    "seconds to start.",
  );

  logMemory();
  setInterval(logMemory, 60000);
});

let counter = 1;
function logMemory() {
  const usage = process.memoryUsage();
  const bytes = 1000000;
  console.log(
    `[${counter} v11] Memory Usage RSS: ${usage.rss /
      bytes}MB Heap Used: ${usage.heapUsed /
      bytes}MB Heap Total: ${usage.heapTotal /
      bytes}MB | Guilds ${commandClient.client.}`,
  );
  counter++;
}


// Spawn the client in an async context
//
// Note: Due to how Node handles tasks, the script will block until the Detritus client
// is killed.
(async () => {
  const client = await commandClient.run();
  client.on("ready", () => {
    console.log(
      "Successfully connected to gateway",
      (Date.now() - started) / 1000,
      "seconds to start.",
    );
  
    logMemory();
    setInterval(logMemory, 60000);
  });
  
  let shardsLoaded = 0;

  client.on("gatewayReady", (id) => {
    shardsLoaded++;
    const here = Date.now();
    console.log(
      `SHARD READY`,
      id.raw.shard,
      (here - time) / 1000,
      "seconds to start.",
    );
    time = here;

    if (shardsLoaded === 10) {
      console.log(
        "Successfully connected to gateway",
        (Date.now() - started) / 1000,
        "seconds to start.",
      );
    
      logMemory();
      setInterval(logMemory, 60000);
    }
  });

  
  // client has received the READY payload, do stuff now
  console.log(`Client has loaded with a shard count of ${client.shardCount}`);
})();