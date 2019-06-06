export const authenticated = next => (root, args, context, info) => {
    if (!context.jwt) {
        throw new Error(`Unauthenticated!`);
    }

    return next(root, args, context, info);
};
