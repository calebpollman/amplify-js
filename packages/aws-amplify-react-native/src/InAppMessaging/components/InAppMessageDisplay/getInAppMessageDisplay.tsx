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

import { InAppMessageDisplayInternalProps, InAppMessageDisplayProps, GetInAppMessageDisplayProps } from './types';

function InAppMessageDisplayInternal({ components, onMessageAction, styles }: InAppMessageDisplayInternalProps) {
	const { Component, props } = useMessage({ components, onMessageAction, styles });

	return !isNil(Component) ? <Component {...props} /> : null;
}

/**
 * Utility function that receives platform specific props and returns a platform InAppMessage component
 *
 * @param {GetInAppMessageDisplayProps} props - platform UI components and message action handler
 * @returns {InAppMessageDisplay} platform Message UI display component
 */

export default function getInAppMessageDisplay({
	components: defaultComponents,
	onMessageAction,
}: GetInAppMessageDisplayProps): (props: InAppMessageDisplayProps) => JSX.Element {
	return function InAppMessageDisplay({ components: overrideComponents, styles }: InAppMessageDisplayProps) {
		const components = React.useMemo(() => ({ ...defaultComponents, ...overrideComponents }), [overrideComponents]);

		return <InAppMessageDisplayInternal components={components} onMessageAction={onMessageAction} styles={styles} />;
	};
}
