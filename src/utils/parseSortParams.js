import { sortOrderList } from "../constants/index.js";

const parseSortParams = ({ sortBy, sortOrder }, fieldList) => {
    const parsedSortBy = fieldList.includes(sortBy) ? sortBy : fieldList[0];

    const parsedSortOrder = sortOrderList.includes(sortOrder) ? sortOrder : sortOrderList[0];
 
    return {
        sortBy: parsedSortBy,
        sortOrder: parsedSortOrder
    }
};
export default parseSortParams;