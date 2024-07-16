import { typeList } from "../constants/contacts-constants.js";

const parseBollean = value => {
    if (typeof value !== 'string') return;
    if (!['true', 'false'].includes(value)) return;
    return value === 'true';
    // const parsedValue = Boolean(value);
    // return parsedValue;
}
const parseContactFilterParams = ({ contactType, isFavourite }) => {
    const parsedType = typeList.includes(contactType) ? contactType : null;
    const parsedFavourite = parseBollean(isFavourite);
    return {
        contactType: parsedType,
        isFavourite: parsedFavourite

    }
};

export default parseContactFilterParams;