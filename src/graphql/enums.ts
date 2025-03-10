

const createEnumString = (enumObj: object) => {
    const keys = Object.keys(enumObj);
    if (keys.length === 0) {
        return 'EMPTY_ENUM';
    }
    return keys.map(key => `${key}`).join('\n        ');
};

const enums = /* GraphQL */`
   
   
`;

export default enums;