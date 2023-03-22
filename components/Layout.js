import Head from "next/head";
import Header from "./Header";
import Image from "next/image";
import rectangleBG from "../public/rectangleBG.png";

const Layout = ({ user, loading = false, children }) => {
    const styles = {
        backgroundColor: "#466ED7",
        backgroundImage: "url(/rectangleBG.png)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center 150px",
        backgroundSize: "cover"
    };

    return (
        <>
            <Head>
                <title>SmartGame</title>
            </Head>

            {/* <Header user={user} loading={loading} /> */}

            <main style={styles}>
                <div className="h-screen">{children}</div>
            </main>
        </>
    );
};

export default Layout;
