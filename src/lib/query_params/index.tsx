import React from "react";

import { z } from "zod";
import { useRouter } from "next/router";

export const useQueryParam = <T extends string>(
	queryParam: string,
	parse: (value: unknown) => T | undefined,
	defaultValue?: T
): [T | undefined, (value: T) => void] => {
	if (queryParam === "") throw new Error("The query can be empty");

	const router = useRouter();

	const currentParsedValue = parse(router.query[queryParam]);

	const setQueryParam = React.useCallback(
		(value: T) => {
			router.push({
				query: { ...router.query, [queryParam]: value },
			});
		},
		[queryParam, router]
	);

	React.useEffect(() => {
		if (!!defaultValue && router.query[queryParam] !== defaultValue) {
			router.push({
				query: { ...router.query, [queryParam]: defaultValue },
			});
		}
	}, [defaultValue, queryParam, router]);

	return [currentParsedValue, setQueryParam];
};

export const useBooleanQueryParam = (
	queryParam: string,
	defaultValue?: boolean
): [boolean | undefined, (value: boolean) => void] => {
	if (queryParam === "") throw new Error("The query can be empty");

	const router = useRouter();

	let currentParsedValue: boolean | undefined;
	if (router.query[queryParam] === "true") {
		currentParsedValue = true;
	}
	if (router.query[queryParam] === "false") {
		currentParsedValue = false;
	}

	const setQueryParam = React.useCallback(
		(value: boolean) => {
			router.replace({
				query: { ...router.query, [queryParam]: value ? "true" : "false" },
			});
		},
		[queryParam, router]
	);

	React.useEffect(() => {
		if (defaultValue && currentParsedValue !== defaultValue) {
			router.replace({
				query: { ...router.query, [queryParam]: defaultValue },
			});
		}
	}, [currentParsedValue, defaultValue, queryParam, router]);

	return [currentParsedValue, setQueryParam];
};
