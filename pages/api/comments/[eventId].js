import { MongoClient } from 'mongodb';

async function handler(req, res) {
    const eventId = req.query.eventId
    // console.log("eventId", eventId)


    const client = await MongoClient.connect('mongodb+srv://username:password@meetupapi.h7ydopx.mongodb.net/events?retryWrites=true&w=majority')

    if (req.method === 'POST') {
        const { email, name, text } = req.body;

        // console.log("email, name, text", req.body)

        if (!email.includes('@') || !name || name.trim() === '' || !text || text.trim() === '') {
            res.status(422).json({ message: 'Invalid input.' });
            return;
        }
        const newComment = {
            // id: new Date().toISOString(),
            email,
            name,
            text,
            eventId
        }
        const db = client.db();
        const result = await db.collection('comments').insertOne(newComment);

        console.log(result);
        console.log(newComment);
        newComment.id = result.insertedId;
        res.status(201).json({ message: 'Added comment.', comment: newComment })
    }
    if (req.method === 'GET') {
        // const dummyList = [
        //     { id: 'c1', name: 'Max', text: "The first comment!" },
        //     { id: 'c2', name: 'Manuel', text: 'The second comment!' }
        // ];
        const db = client.db();
        res.status(200).json({ comments: dummyList });
    }
    client.close();
}
export default handler;