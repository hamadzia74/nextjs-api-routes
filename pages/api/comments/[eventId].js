import { connectDatabase, insertDocument, getAllDocuments } from '../../../helpers/db-utils';

async function handler(req, res) {
    const eventId = req.query.eventId
    // console.log("eventId", eventId)

    let client;
    try {
        client = await connectDatabase();
    } catch (error) {
        res.status(500).json({ message: 'Connecting to the database failed!' });
        return;
    }

    if (req.method === 'POST') {
        const { email, name, text } = req.body;

        // console.log("email, name, text", req.body)

        if (!email.includes('@') || !name || name.trim() === '' || !text || text.trim() === '') {
            res.status(422).json({ message: 'Invalid input.' });
            client.close();
            return;
        }
        const newComment = {
            // id: new Date().toISOString(),
            email,
            name,
            text,
            eventId
        }

        let result;
        try {
            result = await insertDocument(client, 'comments', newComment);
            newComment._id = result.insertedId;
            res.status(201).json({ message: 'Added comment.', comment: newComment })
        }
        catch (error) {
            res.status(500).json({ message: 'Inserting comment failed!' })
        }
        // const db = client.db();
        // const result = await db.collection('comments').insertOne(newComment);

        // console.log(result);
        console.log(newComment);

    }
    if (req.method === 'GET') {
        try {

            const documents = getAllDocuments(client, 'comments', { _id: -1 });
            res.status(200).json({ comments: documents });
        }
        catch (error) {
            res.status(500).json({ message: 'Getting comments failed!' })
        }
        // const dummyList = [
        //     { id: 'c1', name: 'Max', text: "The first comment!" },
        //     { id: 'c2', name: 'Manuel', text: 'The second comment!' }
        // ];
        // const db = client.db();
        // const documents = await db.collection('comments').find().sort({ _id: -1 }).toArray();
        // res.status(200).json({ comments: dummyList });
        // res.status(200).json({ comments: documents });
    }
    client.close();
}
export default handler;