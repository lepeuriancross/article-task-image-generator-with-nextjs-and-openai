// Scripts: Utility Functions
/*----------------------------------------------------------------------------------------------------*/

/*---------- Functions ----------*/

// Function - classNames
export const classNames = (...args: any[]): string => {
	return args
		.filter((arg) => arg && typeof arg == 'string' && arg !== '')
		.join(' ');
};
