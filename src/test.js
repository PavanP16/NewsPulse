const date = new Date(1699699560 * (10 ** 3));

const day = date.getUTCDate().toString().padStart(2, '0');
const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
const year = date.getUTCFullYear();

const formattedDate = `${day}/${month}/${year}`;

console.log(formattedDate);