import fs from "fs";
export default async function writeLanguage(req, res) {
    const path = "./public/data/language.txt";
    try {
        fs.writeFileSync(path, req.body);
        res.status(200).json({ message: "Language written" });
    } catch (error) {
        res.status(500).json({ error });
    }
}
