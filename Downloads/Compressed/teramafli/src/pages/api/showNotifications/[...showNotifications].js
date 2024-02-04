import executeQuery from "@/Config/db4";

export default async function handler(req, res) {
    const [id] = req.query.showNotifications
    try {
        await executeQuery('UPDATE listenotif SET notOpen = 0 WHERE userid=?', [id]);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error in handler:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

