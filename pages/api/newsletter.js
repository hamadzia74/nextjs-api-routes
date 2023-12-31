import {connectDatabase, inserDocument} from '../../helpers/db-utils';

// async function connectDatabase() {
//     const client = await MongoClient.connect('mongodb+srv://<username>:<password>@meetupapi.h7ydopx.mongodb.net/?retryWrites=true&w=majority')
//     return client;
// }

async function inserDocument(client, document) {
    const db = client.db();
    // await db.collection('newsletter').insertOne({ email: userEmail });
    await db.collection('newsletter').insertOne(document);

}
async function handler(req, res) {
    if (req.method === 'POST') {
        const userEmail = req.body;
        if (!userEmail || !userEmail.includes('@')) {
            res.status(422).json({ message: 'Invalid email address.' });
            return;
        }
        // const client = await MongoClient.connect('mongodb+srv://<username>:<password>@meetupapi.h7ydopx.mongodb.net/events?retryWrites=true&w=majority')

        let client;
        try {
            client = await connectDatabase();
        } catch (error) {
            res.status(500).json({ message: 'Connecting to the database failed!' });
            return;
        }

        try {
            client.close();

            await inserDocument(client, 'newsletter', { email: userEmail });
        } catch (error) {
            res.status(500).json({ message: 'Inserting data failed!' });
            return;
        }


        // const db = client.db();
        // await db.collection('newsletter').insertOne({ email: userEmail });
        // client.close();
        // console.log(userEmail);
        res.status(201).json({ message: 'Signed up!' })
    }
}
export default handler;