import DOMPurify from 'dompurify';
import _ from 'lodash';

const escapeHtml = (unsafe: string) => {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

// export const sanitizeInput = (inputValue: any) => {
//     // Step 1: Use DOMPurify to sanitize the input
//     const sanitized = DOMPurify.sanitize(inputValue);

//     // Step 2: Escape the sanitized input with lodash
//     const escaped = _.escape(sanitized);

//     // Step 3: Finally, escape HTML characters using our custom escape function
//     const finalOutput = escapeHtml(escaped);

//     return finalOutput;
// };

export const sanitizeInput = (inputValue: any) => {
    // Only sanitize and escape strings, return other types unchanged
    if (typeof inputValue === 'string') {
        // Step 1: Use DOMPurify to sanitize the input
        const sanitized = DOMPurify.sanitize(inputValue);

        // Step 2: Escape the sanitized input with lodash
        const escaped = _.escape(sanitized);

        // Step 3: Finally, escape HTML characters using our custom escape function
        const finalOutput = escapeHtml(escaped);

        return finalOutput;
    }

    // Return non-string values as they are
    return inputValue;
};



export const sanitizeObject = (data: any) => {
    const sanitizedData: Record<string, any> = {}; // Explicitly define the shape of sanitizedData
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            sanitizedData[key] = sanitizeInput(data[key]);
        }
    }
    return sanitizedData;
};


// Sanitize input for strings
const sanitizeString = (input: string): string => {
    const sanitized = DOMPurify.sanitize(input); // DOMPurify step
    const escaped = _.escape(sanitized); // lodash escape
    return escaped;
};

// General sanitization function for various data types
export const sanitizeData = (data: any): any => {
    if (typeof data === 'string') {
        // If the data is a string, sanitize it
        return sanitizeString(data);
    } else if (Array.isArray(data)) {
        // If it's an array, recursively sanitize each element in the array
        return data.map(item => sanitizeData(item));
    } else if (typeof data === 'object' && data !== null) {
        // If it's an object, recursively sanitize each property
        const sanitizedObject: Record<string, any> = {};
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                sanitizedObject[key] = sanitizeData(data[key]);
            }
        }
        return sanitizedObject;
    } else {
        // If it's a primitive (number, boolean, null, etc.), return as is
        return data;
    }
};