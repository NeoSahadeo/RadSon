/*
 * Error handler function wrapper. Internal use.
 * */
function error_handler<Type extends (...args: any[]) => Promise<any>>(
	NAMEPSPACE: string,
	fn: Type,
): (...func_args: Parameters<Type>) => Promise<ReturnType<Type> | null> {
	return async function(
		...args: Parameters<Type>
	): Promise<ReturnType<Type> | null> {
		try {
			return await fn(...args);
		} catch (err) {
			console.error(`[${NAMEPSPACE} Error]:`, err);
			return null;
		}
	};
}

export { error_handler };
