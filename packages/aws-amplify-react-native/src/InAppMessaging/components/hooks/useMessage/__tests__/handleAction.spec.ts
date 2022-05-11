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

import { ConsoleLogger as Logger } from '@aws-amplify/core';
import { InAppMessageAction } from '@aws-amplify/notifications';

import handleAction from '../handleAction';

jest.mock('react-native', () => ({ Linking: { canOpenURL: jest.fn(), openURL: jest.fn() } }));

// use empty mockImplementation to turn off console output
const infoSpy = jest.spyOn(Logger.prototype, 'info').mockImplementation();
const warnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation();

const close = 'CLOSE';
const deepLink = 'DEEP_LINK';
const link = 'LINK';
const url = 'https://docs.amplify.aws/';

const handleLinkAction = jest.fn();

describe('handleAction', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it.each([deepLink, link])('handles a %s action as expected in the happy path', (action: InAppMessageAction) => {
		handleAction({ action, handleLinkAction, url });

		expect(infoSpy).toHaveBeenCalledWith(`Handle action: ${action}`);
		expect(infoSpy).toHaveBeenCalledTimes(1);
	});

	it.each([deepLink, link])(
		'logs a warning and early returns when a %s action is provided with a null url value',
		(action: InAppMessageAction) => {
			const invalidUrl = null as string;

			handleAction({ action, handleLinkAction, url: invalidUrl });

			expect(infoSpy).toHaveBeenCalledWith(`Handle action: ${action}`);
			expect(infoSpy).toHaveBeenCalledTimes(1);
			expect(warnSpy).toHaveBeenCalledWith(`url must be of type string: ${invalidUrl}`);
			expect(warnSpy).toHaveBeenCalledTimes(1);
			expect(handleLinkAction).not.toHaveBeenCalled();
		}
	);

	it.each([deepLink, link])(
		'logs a warning and early returns when a %s action is provided with an undefined url value',
		(action: InAppMessageAction) => {
			const invalidUrl = undefined as string;

			handleAction({ action, handleLinkAction, url: invalidUrl });

			expect(infoSpy).toHaveBeenCalledWith(`Handle action: ${action}`);
			expect(warnSpy).toHaveBeenCalledWith(`url must be of type string: ${invalidUrl}`);
			expect(infoSpy).toHaveBeenCalledTimes(1);
			expect(warnSpy).toHaveBeenCalledTimes(1);
			expect(handleLinkAction).not.toHaveBeenCalled();
		}
	);

	it('logs when called with a close action', () => {
		handleAction({ action: close, handleLinkAction, url });

		expect(infoSpy).toHaveBeenCalledWith(`Handle action: ${close}`);
		expect(infoSpy).toHaveBeenCalledTimes(1);
		expect(handleLinkAction).not.toHaveBeenCalled();
	});
});
