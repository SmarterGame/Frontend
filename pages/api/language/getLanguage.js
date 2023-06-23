import fs from "fs";

export default async function getLanguage(req, res) {
    //get the path of the file
    // const path = "./data/language.txt";
    //tieni solo i primi 5 elementi dell'array
    const pathArray = __dirname.split("\\").slice(0, 6);
    //unisci gli elementi dell'array in un path
    const path = pathArray.join("\\") + "/public/data/language.txt";
    // console.log(path);

    try {
        const data = fs.readFileSync(path, "utf8");
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
}
