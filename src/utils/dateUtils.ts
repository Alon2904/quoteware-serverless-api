//utils function to help with date converstion to ISO and form iso
export const currentISODate = () => {
    return new Date().toISOString();

    //return a mock version for testing
    //return "2021-10-10T10:10:10.000Z";
    };