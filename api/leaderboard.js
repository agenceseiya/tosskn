let leaderboard = [];

export default function handler(req, res) {
    if (req.method === 'GET') {
        res.status(200).json(leaderboard.sort((a, b) => b.score - a.score).slice(0, 10));
    } else if (req.method === 'POST') {
        const { name, score, address } = req.body;
        const existingEntryIndex = leaderboard.findIndex(entry => entry.address === address);
        
        if (existingEntryIndex !== -1) {
            leaderboard[existingEntryIndex] = { name, score, address };
        } else {
            leaderboard.push({ name, score, address });
        }
        
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 10);  // Keep only top 10

        res.status(200).json({ message: 'Leaderboard updated' });
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
