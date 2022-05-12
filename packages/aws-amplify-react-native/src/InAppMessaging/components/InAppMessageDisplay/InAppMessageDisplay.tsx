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

import { useMessage } from '../hooks';
import { InAppMessageComponents } from '../../context';

import BannerMessage from '../BannerMessage';
import FullScreenMessage from '../FullScreenMessage';
import CarouselMessage from '../CarouselMessage';
import ModalMessage from '../ModalMessage';

interface InAppMessageDisplayProps {
	components?: InAppMessageComponents;
}

function InAppMessageDisplay({ components }: InAppMessageDisplayProps) {
	const { Component, props } = useMessage({ components });

	return !isNil(Component) ? <Component {...props} /> : null;
}

function getInAppMessageDisplay({ components: platformComponents }: InAppMessageDisplayProps) {
	console.log('Call Me Once');
	return function Idk(props: InAppMessageDisplayProps) {
		return <InAppMessageDisplay {...props} components={{ ...props?.components, ...platformComponents }} />;
	};
}

const Idk = getInAppMessageDisplay({ components: { BannerMessage, CarouselMessage, FullScreenMessage, ModalMessage } });

export default Idk;
