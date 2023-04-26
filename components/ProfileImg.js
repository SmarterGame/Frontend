import Image from "next/image";

export default function ProfileImg({ profileImg, classRoomId }) {
    return (
        <>
            {profileImg ? (
                <Image
                    src={profileImg}
                    alt="Immagine profilo"
                    width={500}
                    height={500}
                    className="rounded-full object-cover h-full w-full"
                />
            ) : (
                <Image
                    src={"https://robohash.org/" + classRoomId}
                    alt="Immagine profilo"
                    width={500}
                    height={500}
                    className="rounded-full"
                />
            )}
        </>
    );
}
