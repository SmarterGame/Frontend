import Head from "next/head";
import HeaderGames from "./HeaderGames";
import Image from "next/image";
import procione1 from "@/public/procione1.svg";

const Layout = ({
    user,
    loading = false,
    children,
    title,
    liv,
    classRoom,
    profileImg,
}) => {
    const styles = {
        backgroundColor: "#c4e5ff",
        backgroundImage: "url(/grass.png)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "bottom",
    };

    return (
        <>
            <Head>
                <title>SmartGame</title>
            </Head>

            <main style={styles}>
                <div className="min-h-[100vh]">
                    <HeaderGames
                        user={user}
                        loading={loading}
                        title={title}
                        liv={liv}
                        classRoom={classRoom}
                        profileImg={profileImg}
                    />
                    {children}

                    <div className="absolute bottom-4 left-10">
                        <div className="flex flex-row transition ease-in-out hover:-translatey-1 hover:scale-110 duration-300 items-end">
                            <h1 className="text-4xl text-gray-100 text-stroke-orange">
                                SMART
                            </h1>
                            <h1 className="text-2xl text-gray-100 text-stroke-orange">
                                GAME
                            </h1>
                        </div>
                    </div>

                    <Image
                        src={procione1}
                        alt="procione1"
                        width={160}
                        className="fixed bottom-6 right-10"
                    ></Image>
                </div>
            </main>
        </>
    );
};

export default Layout;
