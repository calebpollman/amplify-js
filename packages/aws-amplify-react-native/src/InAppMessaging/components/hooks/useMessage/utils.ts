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

import {
	InAppMessageAction,
	InAppMessageButton,
	InAppMessageContent,
	InAppMessageLayout,
} from '@aws-amplify/notifications';
import { ConsoleLogger as Logger } from '@aws-amplify/core';

import {
	InAppMessageComponentButtonProps,
	InAppMessageComponentContentProps,
	InAppMessageComponentPosition,
} from '../../types';

const logger = new Logger('Notifications.InAppMessaging');

type OnMessageAction = (params: { action: InAppMessageAction; url?: string }) => void;

export const getPositionProp = (layout: InAppMessageLayout): InAppMessageComponentPosition => {
	switch (layout) {
		case 'BOTTOM_BANNER': {
			return 'bottom';
		}
		case 'MIDDLE_BANNER': {
			return 'middle';
		}
		case 'TOP_BANNER': {
			return 'top';
		}
		default: {
			return null;
		}
	}
};

export const getActionHandler = (
	actionParams: { action: InAppMessageAction; url?: string },
	onMessageAction: OnMessageAction,
	onActionCallback: () => void
) => ({
	onAction() {
		try {
			onMessageAction(actionParams);
		} catch (e) {
			logger.error(`Message action failure: ${e}`);
		} finally {
			onActionCallback?.();
		}
	},
});

const getButtonProps = (
	{ action, url, ...baseButtonProps }: InAppMessageButton,
	onMessageAction: OnMessageAction,
	onActionCallback: () => void
): InAppMessageComponentButtonProps => ({
	...baseButtonProps,
	...getActionHandler({ action, url }, onMessageAction, onActionCallback),
});

export const getContentProps = (
	content: InAppMessageContent,
	onMessageAction: OnMessageAction,
	onActionCallback: () => void
): InAppMessageComponentContentProps => {
	const props: InAppMessageComponentContentProps = {};

	if (!content) {
		return props;
	}

	const { primaryButton, secondaryButton, ...restContent } = content;

	if (primaryButton) {
		props.primaryButton = getButtonProps(primaryButton, onMessageAction, onActionCallback);
	}

	if (secondaryButton) {
		props.secondaryButton = getButtonProps(secondaryButton, onMessageAction, onActionCallback);
	}

	return { ...props, ...restContent };
};
