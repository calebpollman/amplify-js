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

import React from 'react';
import isNil from 'lodash/isNil';

import BannerMessage from '../BannerMessage';
import FullScreenMessage from '../FullScreenMessage';
import CarouselMessage from '../CarouselMessage';
import ModalMessage from '../ModalMessage';

import { useMessage, OnMessageAction } from '../hooks/useMessage';
import handleAction from '../hooks/useMessage/handleMessageAction';
import handleMessageLinkAction from './handleMessageLinkAction';

import { MessageStyleProps } from '../hooks/useMessageProps';

import { InAppMessageDisplayProps } from './types';

const platformComponents = { BannerMessage, FullScreenMessage, CarouselMessage, ModalMessage };

const onMessageAction: OnMessageAction = ({ action, url }) => {
	handleAction({ action, url, handleMessageLinkAction });
};

function InAppMessageDisplay({ components: overrideComponents, styles }: InAppMessageDisplayProps<MessageStyleProps>) {
	const components = React.useMemo(() => ({ ...platformComponents, ...overrideComponents }), [overrideComponents]);
	const { Component, props } = useMessage({ components, onMessageAction, styles });

	return !isNil(Component) ? <Component {...props} /> : null;
}

export default InAppMessageDisplay;
