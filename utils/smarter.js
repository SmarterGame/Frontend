export const convertTagToSymbol = (input) => {
    const polishInput = input?.replaceAll("_","")
    const conversion = {
        "zero": "0",
        "uno": "1",
        "due": "2",
        "tre": "3",
        "quattro": "4",
        "cinque": "5",
        "sei": "6",
        "sette": "7",
        "otto": "8",
        "nove": "9",
        "addizione": "+",
        "sottrazione": "-",
        "minore": "<",
        "maggiore": ">",
        "uguale": "=",
        "moltiplicazione": "x",
        "divisione": "/"
    }
    const output = conversion[polishInput];
    if (output === undefined) return polishInput;
    return output;
}