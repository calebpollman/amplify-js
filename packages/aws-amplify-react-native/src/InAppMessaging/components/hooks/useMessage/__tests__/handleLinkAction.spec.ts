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

import { Linking } from 'react-native';
import { ConsoleLogger as Logger } from '@aws-amplify/core';

import handleLinkAction from '../handleLinkAction';

jest.mock('react-native', () => ({ Linking: { canOpenURL: jest.fn(), openURL: jest.fn() } }));

// use empty mockImplementation to turn off console output
const warnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();

const url = 'https://docs.amplify.aws/';
const error = 'ERROR';

describe('handleAction', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('logs a warning when Linking.canOpenUrl returns false', async () => {
		(Linking.canOpenURL as jest.Mock).mockResolvedValueOnce(false);

		await handleLinkAction(url);

		expect(Linking.canOpenURL).toHaveBeenCalledTimes(1);
		expect(warnSpy).toHaveBeenCalledWith(`Unsupported url provided: ${url}`);
		expect(Linking.openURL).not.toHaveBeenCalled();
	});

	it('logs an error when Linking.canOpenUrl fails', async () => {
		(Linking.canOpenURL as jest.Mock).mockRejectedValueOnce(error);

		await handleLinkAction(url);

		expect(errorSpy).toHaveBeenCalledWith(`Call to Linking.canOpenURL failed: ${error}`);
	});

	it('logs an error when Linking.openUrl fails', async () => {
		(Linking.canOpenURL as jest.Mock).mockResolvedValueOnce(true);
		(Linking.openURL as jest.Mock).mockRejectedValue(error);

		await handleLinkAction(url);

		expect(errorSpy).toHaveBeenCalledWith(`Call to Linking.openURL failed: ${error}`);
	});
});
