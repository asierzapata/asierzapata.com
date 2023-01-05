import React from "react";

export const useQueryParam = ({
	url,
	queryParam,
}: {
	url: string;
	queryParam: string;
}) => {
	const queryParams = React.useMemo(() => new URLSearchParams(url), [url]);

	const setQueryParam = React.useCallback(
		(value: string) => {
			queryParams.set(queryParam, value);
		},
		[queryParam, queryParams]
	);

	return {
		setQueryParam,
		value: queryParams.get(queryParam),
	};
};
