import Head from "next/head";
import Header from "./Header";

const Layout = ({ user, loading = false, children }) => {
    const styles = {
        backgroundColor: "#466ED7",
        backgroundImage: "url(/rectangleBG.svg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center 150px",
    };

    return (
        <>
            <Head>
                <title>SmartGame</title>
            </Head>

            {/* <Header user={user} loading={loading} /> */}

            <main style={styles}>
                <div className="min-h-[100vh]">{children}</div>
            </main>
        </>
    );
};

export default Layout;
