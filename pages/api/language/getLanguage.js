import fs from "fs";

export default async function getLanguage(req, res) {
    //get the path of the file
    const path = "./data/language.txt";
    // const vercelUrl = process.env.VERCEL_URL;
    // console.log(vercelUrl);

    try {
        const data = fs.readFileSync(path, "utf8");
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
}
