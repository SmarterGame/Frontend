import Image from "next/image";
import ghianda from "@/public/ghianda.png";
import Link from "next/link";
import ClearIcon from "@mui/icons-material/Clear";

export default function HeaderGames({
    loading,
    title = "",
    classRoom = { Ghiande: 0 },
    pageAttivita = false,
    liv,
}) {
    const numGhiande = classRoom.Ghiande;

    let tmp = false;
    if (title === "quantita") {
        title = "LE QUANTITA'";
        tmp = true;
    } else if (title === "ordinamenti") {
        title = "GLI ORDINAMENTI";
        tmp = true;
    }

    return (
        <>
            <header>
                <nav>
                    <div className="flex flex-row justify-between bg-blue-600 shadow-2xl py-1">
                        <h1 className="pl-4 transition ease-in-out text-4xl text-gray-100 text-stroke-orange mt-4 mb-4 ml-6 hover:-translatey-1 hover:scale-110 duration-300">
                            {tmp ? title + " - LIVELLO " + liv : title}
                        </h1>
                        <div className="flex flex-row items-center mr-4">
                            <h1 className="text-4xl text-slate-100 mr-4">
                                {numGhiande}
                            </h1>
                            <Image
                                src={ghianda}
                                width={60}
                                alt="ghianda"
                            ></Image>
                            <div className="w-20 h-20 bg-gray-700 rounded-full ml-4 mr-4">
                                <Image
                                    src={
                                        "https://robohash.org/" + classRoom._id
                                    }
                                    alt="Immagine profilo"
                                    width={500}
                                    height={500}
                                    className="rounded-full"
                                />
                            </div>
                            <div className="bg-red-500 bg-opacity-50 rounded-lg transition ease-in-out hover:bg-red-600 hover:bg-opacity-50 hover:-translatey-1 hover:scale-110 shadow-2xl duration-300">
                                <button>
                                    <Link
                                        href={`${
                                            pageAttivita
                                                ? "/mockup/profilo"
                                                : "/mockup/attivita"
                                        }`}
                                    >
                                        <ClearIcon
                                            className="text-red-700 text-opacity-80 text-5xl ml-1 mr-1 mt-1 mb-1"
                                            fontSize="large"
                                        />
                                    </Link>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
}
