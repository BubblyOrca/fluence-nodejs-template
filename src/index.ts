import { Fluence, KeyPair } from '@fluencelabs/fluence';
import { krasnodar } from '@fluencelabs/fluence-network-environment';
import { advertiseMyself, registerMessagingService, sendMyself } from './_aqua/export';

const relay = krasnodar[3];

const sk = Buffer.from('SVz4T4yW718wt0rziDVOfiv6+WQbS4lvEtJHEieXcAk=', 'base64');

async function main() {
    await Fluence.start({
        KeyPair: await KeyPair.fromEd25519SK(sk),
        connectTo: relay,
    });

    console.log('own peer id ', Fluence.getStatus().peerId);
    console.log('connected to ', Fluence.getStatus().relayPeerId);

    registerMessagingService({
        receiveMessage: (str) => {
            console.log(str);
        },
    });

    console.log('messaging service registered');

    await advertiseMyself('hackathon');

    console.log('messaging service advertised');

    console.log('press any key to quit...');

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', async () => {
        await Fluence.stop();
        process.exit(0);
    });
}

main().catch((err) => console.error(err));
