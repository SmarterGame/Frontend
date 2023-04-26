import Head from "next/head";
import HeaderProfile from "@/components/HeaderProfile";
import Image from "next/image";
import procione1 from "@/public/procione1.png";

const Layout = ({
    token,
    url,
    loading = false,
    children,
    boxes,
    classRoom,
    selectedOptions,
}) => {
    const styles = {
        backgroundColor: "#c4e5ff",
        backgroundImage: "url(/grass.png)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "bottom",
        // backgroundAttachment: "fixed",
    };

    return (
        <>
            <Head>
                <title>SmartGame</title>
            </Head>

            <main style={styles}>
                <div className="h-[100vh]">
                    <HeaderProfile
                        loading={loading}
                        boxes={boxes}
                        token={token}
                        url={url}
                        classRoom={classRoom}
                        selectedOptions={selectedOptions}
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
                    <Image
                        src={procione1}
                        alt="procione"
                        className="fixed bottom-6 right-10 z-0"
                    />
                </div>
            </main>
        </>
    );
};

export default Layout;
