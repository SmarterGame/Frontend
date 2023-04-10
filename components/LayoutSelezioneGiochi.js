import Head from "next/head";
import HeaderGames from "@/components/HeaderGames";

const Layout = ({ loading = false, children, title, classRoom, pageAttivita }) => {
    const styles = {
        backgroundColor: "#c4e5ff",
        // backgroundImage: "url(/grass.png)",
        // backgroundRepeat: "no-repeat",
        // backgroundSize: "contain",
        // backgroundPosition: "bottom",
    };

    return (
        <>
            <Head>
                <title>SmartGame</title>
            </Head>

            <main style={styles}>
                <div className="h-screen">
                    <HeaderGames
                        loading={loading}
                        title={title}
                        classRoom={classRoom}
                        pageAttivita={pageAttivita}
                    />
                    {children}

                    <div className="fixed bottom-4 left-10">
                        <div className="flex flex-row transition ease-in-out hover:-translatey-1 hover:scale-110 duration-300 items-end">
                            <h1 className="text-4xl text-gray-100 text-stroke-orange">
                                SMART
                            </h1>
                            <h1 className="text-2xl text-gray-100 text-stroke-orange">
                                GAME
                            </h1>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Layout;
