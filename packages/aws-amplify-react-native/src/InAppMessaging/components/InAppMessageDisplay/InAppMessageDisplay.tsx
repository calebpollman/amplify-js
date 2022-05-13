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

export default function InAppMessageDisplay({ components }: { components: InAppMessageComponents }) {
	const { Component, props } = useMessage({ components });

	return !isNil(Component) ? <Component {...props} /> : null;
}
