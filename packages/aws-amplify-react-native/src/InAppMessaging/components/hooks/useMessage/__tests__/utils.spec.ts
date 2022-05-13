/*
 * Copyright 2017-2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

import { InAppMessageButton, InAppMessageContent, InAppMessageLayout } from '@aws-amplify/notifications';
import { ConsoleLogger as Logger } from '@aws-amplify/core';
import { getActionHandler, getContentProps, getPositionProp } from '../utils';

jest.mock('../handleAction', () => ({ __esModule: true, default: jest.fn() }));

// use empty mockImplementation to turn off console output
const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();

const onMessageAction = jest.fn();

const baseContent: InAppMessageContent = {
	container: { style: { backgroundColor: 'purple' } },
};

const primaryButton: InAppMessageButton = {
	action: 'LINK',
	title: 'Go to docs',
	url: 'https://docs.amplify.aws/',
};

const secondaryButton: InAppMessageButton = {
	action: 'CLOSE',
	title: 'close',
};

const onActionCallback = jest.fn();

describe('getPositionProp', () => {
	it.each([
		['TOP_BANNER', 'top'],
		['MIDDLE_BANNER', 'middle'],
		['BOTTOM_BANNER', 'bottom'],
	])('returns the expected position when provided a %s argument', (layout, expected) => {
		const output = getPositionProp(layout as InAppMessageLayout);
		expect(output).toBe(expected);
	});

	it('returns null when provided an unhandled layout argument', () => {
		const output = getPositionProp('LEFT_BANNER' as InAppMessageLayout);
		expect(output).toBeNull();
	});
});

describe('getContentProps', () => {
	it('returns the expected output in the happy path', () => {
		const output = getContentProps(baseContent, onMessageAction, onActionCallback);
		expect(output).toStrictEqual(baseContent);
	});

	it('returns the expected output when a primary button is provided', () => {
		const output = getContentProps({ ...baseContent, primaryButton }, onMessageAction, onActionCallback);
		expect(output).toStrictEqual({
			...baseContent,
			primaryButton: {
				title: primaryButton.title,
				onAction: expect.any(Function) as Function,
			},
		});
	});

	it('returns the expected output when a secondary button is provided', () => {
		const output = getContentProps({ ...baseContent, secondaryButton }, onMessageAction, onActionCallback);
		expect(output).toStrictEqual({
			...baseContent,
			secondaryButton: {
				title: secondaryButton.title,
				onAction: expect.any(Function) as Function,
			},
		});
	});

	it('returns an empty props object when content is null', () => {
		const output = getContentProps(null, onMessageAction, onActionCallback);
		expect(output).toStrictEqual({});
	});
});

describe('getActionHandler', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('behaves as expected in the happy path', () => {
		const actionHandler = getActionHandler({ ...secondaryButton }, onMessageAction, onActionCallback);

		actionHandler.onAction();

		expect(onMessageAction).toHaveBeenCalledTimes(1);
		expect(onActionCallback).toHaveBeenCalledTimes(1);
	});

	it('behaves as expected when handleAction results in an error', () => {
		const error = 'ERROR';

		onMessageAction.mockImplementationOnce(() => {
			throw new Error(error);
		});

		const actionHandler = getActionHandler({ ...secondaryButton }, onMessageAction, onActionCallback);

		actionHandler.onAction();

		expect(onMessageAction).toHaveBeenCalledTimes(1);
		expect(errorSpy).toHaveBeenCalledTimes(1);
		expect(errorSpy).toHaveBeenCalledWith(`Message action failure: Error: ${error}`);
		expect(onActionCallback).toHaveBeenCalledTimes(1);
	});
});
