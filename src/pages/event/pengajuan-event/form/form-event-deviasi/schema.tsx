import * as yup from 'yup';

export const schema = yup.object().shape({
    no_memo_deviasi: yup
        .object()
        .nullable()
        .transform((value, originalValue) => {
            return originalValue === '' ? null : value
        })
        .notRequired()
        .default(null),
})