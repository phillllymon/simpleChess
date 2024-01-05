const PIECES = {
    "p": "&#9817",
    "r": "&#9814",
    "n": "&#9816",
    "b": "&#9815",
    "q": "&#9813",
    "k": "&#9812",
    "P": "&#9823",
    "R": "&#9820",
    "N": "&#9822",
    "B": "&#9821",
    "Q": "&#9819",
    "K": "&#9818"
};

export function getPieceSymbol(piece) {
    return PIECES[piece];
}