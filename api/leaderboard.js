import { MongoClient } from 'mongodb';

let cachedDb = null;

async function connectToDatabase(uri) {
    if (cachedDb) {
        return cachedDb;
    }

    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = await client.db(new URL(uri).pathname.substr(1));
    
    cachedDb = db;
    return db;
}

export default async function handler(req, res) {
    const db = await connectToDatabase(process.env.MONGODB_URI);
    const collection = await db.collection('leaderboard');

    if (req.method === 'GET') {
        const leaderboard = await collection.find().sort({ score: -1 }).limit(10).toArray();
        res.json(leaderboard);
    } else if (req.method === 'POST') {
        const { name, score, address } = req.body;
        const result = await collection.updateOne(
            { address },
            { $set: { name, score, address } },
            { upsert: true }
        );
        res.status(200).json({ message: 'Leaderboard updated' });
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
