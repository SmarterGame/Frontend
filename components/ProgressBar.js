import { useState, useEffect } from "react";

const levels = [
    { level: 1, ghiande: 0 },
    { level: 2, ghiande: 5 },
    { level: 3, ghiande: 10 },
    { level: 4, ghiande: 15 },
];

export default function ProgressBar({
    lv = 1, ghiande = 0 ,
}) {
    const [progress, setProgress] = useState(0);
    const [nextLevel, setNextLevel] = useState(levels[0]);

    useEffect(() => {
        const currentLevel = levels[(lv - 1) % levels.length];
        const nextLevel = levels[lv % levels.length];
        let progress;
        if (ghiande < 15) {
            progress =
                ((ghiande - currentLevel.ghiande) /
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
