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

import { InAppMessageAction } from '@aws-amplify/notifications';
import { InAppMessageComponents } from '../../context';
import { InAppMessageComponentStyles } from '../types';

export type OnMessageAction = (params: { action: InAppMessageAction; url?: string }) => void;

export interface InAppMessageDisplayInternalProps {
	/**
	 * Platform Message UI components
	 */
	components: InAppMessageComponents;

	/**
	 * Platform Message action handler
	 */
	onMessageAction: OnMessageAction;

	/**
	 * Platform Message override styles
	 */
	styles: InAppMessageComponentStyles; // make generic
}

export type GetInAppMessageDisplayProps = Pick<InAppMessageDisplayInternalProps, 'components' | 'onMessageAction'>;
export type InAppMessageDisplayProps = Partial<Pick<InAppMessageDisplayInternalProps, 'components' | 'styles'>>;
