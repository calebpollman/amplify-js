/*
 * Copyright 2017-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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

import { HandleLinkAction } from './types';

const logger = new Logger('Notifications.InAppMessaging');

const handleLinkAction: HandleLinkAction = async (url: string) => {
	let supported: boolean;
	try {
		supported = await Linking.canOpenURL(url);
	} catch (e) {
		logger.error(`Call to Linking.canOpenURL failed: ${e}`);
	}

	if (!supported) {
		logger.warn(`Unsupported url provided: ${url}`);
		return;
	}

	try {
		logger.info(`Opening url: ${url}`);
		await Linking.openURL(url);
	} catch (e) {
		logger.error(`Call to Linking.openURL failed: ${e}`);
	}
};

export default handleLinkAction;
