import { useState, useEffect } from "react";

const levels = [
    { level: 1, ghiande: 0 },
    { level: 2, ghiande: 5 },
    { level: 3, ghiande: 10 },
    { level: 4, ghiande: 15 },
];

export default function ProgressBar({
    classRoom = { ClassLvl: 1, Ghiande: 0 },
}) {
    const [progress, setProgress] = useState(0);
    const [nextLevel, setNextLevel] = useState(levels[0]);

    useEffect(() => {
        console.log();
        const currentLevel = levels[classRoom.ClassLvl - 1];
        const nextLevel = levels[classRoom.ClassLvl];
        let progress;
        if (classRoom.Ghiande < 15) {
            progress =
                ((classRoom.Ghiande - currentLevel.ghiande) /
                    (nextLevel.ghiande - currentLevel.ghiande)) *
                100;
        } else {
            progress = 100;
        }
        setNextLevel(nextLevel);
        setProgress(progress);
    }, []);

    return (
        <>
            <div className="mx-auto bg-slate-400 h-4 w-[60%] mt-10 rounded-full">
                <div
                    className={`bg-yellow-400 h-4 rounded-full`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </>
    );
}
