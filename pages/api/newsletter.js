import { MongoClient } from 'mongodb';

async function handler(req, res) {
    if (req.method === 'POST') {
        const userEmail = req.body;
        if (!userEmail || !userEmail.includes('@')) {
            res.status(422).json({ message: 'Invalid email address.' });
            return;
        }
        const client = await MongoClient.connect('mongodb+srv://<username>:<password>@meetupapi.h7ydopx.mongodb.net/?retryWrites=true&w=majority')

        const db = client.db();
        await db.collection('emails').insertOne({ email: userEmail });
        client.close();
        // console.log(userEmail);
        res.status(201).json({ message: 'Signed up!' })
    }
}
export default handler;
