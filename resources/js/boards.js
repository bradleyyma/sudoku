const cell = {
    value: null,
    initial: false,
};
const puzzle = Array(9).fill(null).map(() => Array(9).fill(cell));

const boards =[
    [
        [null, 7, null, null, null, null, null, 6, null],
        [null, null, null, null, 6, 7, 1, null, 5],
        [null, null, 5, null, 2, 9, 3, null, 4],
        [null, null, 9, null, 7, 6, 5, null, 1],
        [7, null, null, null, null, null, null, null, null],
        [3, 1, null, null, 4, 5, 8, 2, null],
        [null, 3, 8, null, null, 1, null, 9, null],
        [5, null, 7, 6, 9, 3, null, 1, 8],
        [null, 9, null, 4, 8, null, null, 5, null],
    ],
]
