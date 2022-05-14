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

import { StyleProp, ViewStyle } from 'react-native';
import {
	InAppMessageComponentBaseProps,
	InAppMessageComponentBaseStyle,
	InAppMessageComponentCommonProps,
	InAppMessageComponentContentProps,
} from '../types';

import { MessageStyleProps } from '../hooks/useMessageProps';
import { CarouselMessageCommonProps } from '../hooks/useMessage';

export interface CarouselMessageComponentStyle {
	pageIndicatorActive: ViewStyle;
	pageIndicatorInactive: ViewStyle;
}

type CarouselMessageStyles = MessageStyleProps & {
	pageIndicatorActive: StyleProp<ViewStyle>;
	pageIndicatorInactive: StyleProp<ViewStyle>;
};

export type CarouselMessageProps = CarouselMessageCommonProps<CarouselMessageStyles>;

export interface CarouselMessageItemProps extends InAppMessageComponentBaseProps {}

export interface CarouselMessageStyle extends InAppMessageComponentBaseStyle {}
