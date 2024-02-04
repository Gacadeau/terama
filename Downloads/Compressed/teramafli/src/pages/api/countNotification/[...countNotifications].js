import executeQuery from "@/Config/db4";


export default async function handler(req, res) {
    const [userId] = req.query.countNotifications
    try {
        //console.log('Test OK 1324 !!');
        const feedback = await executeQuery(
            ' SELECT * FROM listenotif WHERE listenotif.notOpen = 1 AND  listenotif.userid= ?', [userId]
        );
        res.json(feedback);
    } catch (error) {
        res.status(500).json(error);
    }
}
