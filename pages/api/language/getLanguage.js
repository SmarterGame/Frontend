import fs from "fs";

export default async function getLanguage(req, res) {
    // const path = `${process.env.VERCEL_URL}/data/language.txt`;
    const path = "https://frontend-taupe-kappa-35.vercel.app/data/language.txt"

    try {
        const data = fs.readFileSync(path, "utf8");
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
}
