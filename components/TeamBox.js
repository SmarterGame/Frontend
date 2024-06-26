import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from "@mui/icons-material/Delete";
import * as React from "react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const style = {
    tableRow: { "& > *": { borderBottom: "unset" }, width: "1%" },
    classNameCell: { width: "10%" }, // imposta la larghezza della cella del nome a 40%
    creationDateCell: { width: "10%" }, // imposta la larghezza della cella delle calorie a 30%
};

function Row(props) {
    const { row, deleteHandler, renameHandler, toggleScegliClasse } = props;
    const [open, setOpen] = useState(false);

    // const selectedLanguage = getSelectedLanguage();
    const [selectedLanguage, setSelectedLanguage] = useState();

    //Get selected language from session storage
    useEffect(() => {
        setSelectedLanguage(sessionStorage.getItem("language"));
    }, []);

    function deleteClass(deleteHandler) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton:
                    "border bg-green-500 hover:bg-green-600 p-4 ml-1 rounded-xl",
                cancelButton:
                    "border bg-red-500 hover:bg-red-600 p-4 mr-1 rounded-xl focus:outline-black",
            },
            buttonsStyling: false,
        });

        const title =
            selectedLanguage === "eng"
                ? "Would you like to delete the class?"
                : "Desideri eliminare la classe?";
        const confirmButton =
            selectedLanguage === "eng" ? "Confirm" : "Conferma";
        const cancelButton = selectedLanguage === "eng" ? "Cancel" : "Annulla";

        swalWithBootstrapButtons
            .fire({
                title: title,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: confirmButton,
                cancelButtonText: cancelButton,
                reverseButtons: true,
                focusCancel: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await deleteHandler();
                        if (selectedLanguage === "eng") {
                            swalWithBootstrapButtons.fire(
                                "Deleted!",
                                "The class has been deleted.",
                                "success"
                            );
                        } else {
                            swalWithBootstrapButtons.fire(
                                "Eliminata!",
                                "La classe è stata cancellata.",
                                "success"
                            );
                        }
                    } catch (err) {
                        swalWithBootstrapButtons.fire(
                            "Cancelled",
                            "Failed to delete :(",
                            "error"
                        );
                        console.log(err);
                    }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    if (selectedLanguage === "eng") {
                        swalWithBootstrapButtons.fire(
                            "Cancelled",
                            "The class has not been deleted",
                            "error"
                        );
                    } else {
                        swalWithBootstrapButtons.fire(
                            "Annullato",
                            "La classe non è stata cancellata",
                            "error"
                        );
                    }
                }
            });
    }
    /*------------------------------------------------*/

    async function renameClass(renameHandler) {
        const title =
            selectedLanguage === "eng"
                ? "Rename the class"
                : "Rinomina la classe";
        const inputPlaceholder =
            selectedLanguage === "eng" ? "Class name" : "Nome della classe";
        const confirmButton =
            selectedLanguage === "eng" ? "Confirm" : "Conferma";
        const cancelButton = selectedLanguage === "eng" ? "Cancel" : "Annulla";

        await Swal.fire({
            title: title,
            input: "text",
            inputPlaceholder: inputPlaceholder,
            showCancelButton: true,
            closeOnCancel: true,
            confirmButtonColor: "#ff7100",
            cancelButtonColor: "#575757",
            confirmButtonText: confirmButton,
            cancelButtonText: cancelButton,
        }).then((result) => {
            if (result.isConfirmed) {
                if (result.value === "") {
                    Swal.fire({
                        title: "Errore",
                        text: "Il nome della classe non può essere vuoto",
                        icon: "error",
                        confirmButtonColor: "#ff7100",
                    });
                } else {
                    try {
                        renameHandler(result.value);
                        Swal.fire({
                            title: "Rinominata!",
                            text: "La classe è stata rinominata.",
                            icon: "success",
                            confirmButtonColor: "#ff7100",
                        });
                    } catch (err) {
                        Swal.fire({
                            title: "Errore",
                            text: "Impossibile rinominare la classe",
                            icon: "error",
                            confirmButtonColor: "#ff7100",
                        });
                        console.log(err);
                    }
                }
            }
        });
    }

    return (
        <React.Fragment>
            <TableRow onClick={() => setOpen(!open)} sx={style.tableRow}>
                <TableCell sx={style.tableRow}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                        className="text-orangeBtn font-bold"
                    >
                        {open ? (
                            <KeyboardArrowUpIcon fontSize="large" />
                        ) : (
                            <KeyboardArrowDownIcon fontSize="large" />
                        )}
                    </IconButton>
                </TableCell>
                <TableCell
                    align="center"
                    component="th"
                    scope="row"
                    sx={style.classNameCell}
                    // className="text-orangeBtn font-bold text-lg"
                >
                    <div className="sigmar text-orangeBtn text-3xl">
                        {row.className}
                    </div>
                </TableCell>
                <TableCell
                    align="center"
                    sx={style.creationDateCell}
                    // className="text-orangeBtn font-bold text-lg"
                >
                    <div className="sigmar text-orangeBtn text-2xl">
                        {row.creationDate}
                    </div>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box
                            sx={{
                                margin: 1,
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <button
                                className="sigmar w-44 text-xl transition ease-in-out bg-orangeBtn hover:bg-orange-700 hover:-translatey-1 hover:scale-110 text-white shadow-2xl rounded-md duration-300"
                                onClick={() => toggleScegliClasse()}
                            >
                                {selectedLanguage === "eng"
                                    ? "Choose class"
                                    : "Scegli classe"}
                            </button>
                            <button
                                onClick={() => renameClass(renameHandler)}
                                className="sigmar w-44 text-xl transition ease-in-out bg-orangeBtn hover:bg-orange-700 hover:-translatey-1 hover:scale-110 text-white shadow-2xl rounded-md duration-300"
                            >
                                {selectedLanguage === "eng"
                                    ? "Rename class"
                                    : "Rinonomina classe"}
                            </button>
                            <IconButton
                                onClick={() => deleteClass(deleteHandler)}
                                // className="text-red-600"
                            >
                                <div className=" transition ease-in-out text-red-600 hover:text-red-700 hover:-translatey-1 hover:scale-110 duration-300">
                                    <DeleteIcon fontSize="large" />
                                </div>
                            </IconButton>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        creationDate: PropTypes.string.isRequired,
        className: PropTypes.string.isRequired,
    }).isRequired,
};

function createData(className, creationDate) {
    return {
        className,
        creationDate,
    };
}

const TeamBox = ({
    classroomData,
    removeHandler,
    renameHandler,
    togglePopUp,
}) => {
    const router = useRouter();
    const date = new Date(classroomData.CreationDate); //Change date format
    const row = createData(classroomData.ClassName, date.toLocaleDateString());
    const deleteHandler = () => removeHandler(classroomData._id);
    const renameClassHandler = (newName) =>
        renameHandler(classroomData._id, newName);
    const toggleScegliClasse = () => togglePopUp();
    return (
        <>
            <div className="flex flex-col justify-center items-center w-[35%] mb-10">
                <TableContainer
                    component={Paper}
                    className="rounded-2xl bg-lightGrayBadge hover:bg-gray-200 hover:cursor-pointer"
                >
                    <Table aria-label="collapsible table">
                        <TableBody>
                            <Row
                                key={row.className}
                                row={row}
                                deleteHandler={deleteHandler}
                                renameHandler={renameClassHandler}
                                toggleScegliClasse={toggleScegliClasse}
                            />
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
};

export default TeamBox;
