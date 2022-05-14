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

import { InAppMessageLayout } from '@aws-amplify/notifications';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { DEFAULT_CAROUSEL_INDICATOR_SIZE } from '../../../ui';
import { BUTTON_PRESSED_OPACITY, SPACING_EXTRA_LARGE } from '../../constants';
import { InAppMessageComponentBaseProps, InAppMessageComponentButtonStyle } from '../../types';
import { DeviceOrientation } from '../../../ui/useDeviceOrientation';
import { ButtonStylePropParams, MessageStylePropParams, MessageStyleProps } from './types';

// Carousel page indicator size + margins
const DEFAULT_CAROUSEL_INDICATOR_PADDING = (DEFAULT_CAROUSEL_INDICATOR_SIZE * 5) / 3;

/**
 * Parse and assign appropriate button container and text style from style objects params
 *
 * @param {ButtonStylePropParams} params - message styleParams and button type
 * @returns {InAppMessageComponentButtonStyle} resolved button container and text style arrays
 */
export const getComponentButtonStyle = ({
	styleParams,
	buttonType,
}: ButtonStylePropParams): InAppMessageComponentButtonStyle => {
	const { defaultStyle, messageStyle, overrideStyle } = styleParams;
	// default component styles defined at the UI component level
	const { buttonContainer: containerDefaultStyle = {}, buttonText: textDefaultStyle = {} } = defaultStyle ?? {};

	// message specific styles in the in-app message payload, overrides default component styles
	const { backgroundColor, borderRadius, color } = messageStyle?.[buttonType] ?? {};

	const containerMessageStyle = {
		...(backgroundColor ? { backgroundColor } : null),
		...(borderRadius ? { borderRadius } : null),
	};

	const textMessageStyle = { ...(color ? { color } : null) };

	// custom component override styles passed as style prop, overrides all previous styles
	const { container: containerOverrideStyle = {}, text: textOverrideStyle = {} } = overrideStyle?.[buttonType] ?? {};

	return {
		// the style prop of the React Native Pressable component used in the message UI accepts either a ViewStyle array
		// or a function receiving a boolean reflecting whether the component is currently pressed, returning a ViewStyle
		// array. Utilizing the latter, we add an opacity value to the UI message button style during press events
		container: ({ pressed } = { pressed: false }) => {
			// default button press interaction opacity
			const pressedOpacity = pressed ? { opacity: BUTTON_PRESSED_OPACITY } : {};

			// pass `pressed` to containerOverrideStyle and evaluate if the consumer passed a function for custom
			// button style
			const containerOverrideFinalStyle =
				typeof containerOverrideStyle === 'function' ? containerOverrideStyle({ pressed }) : containerOverrideStyle;

			return [pressedOpacity, containerDefaultStyle, containerMessageStyle, containerOverrideFinalStyle];
		},
		text: [textDefaultStyle, textMessageStyle, textOverrideStyle],
	};
};

/**
 * Utility for determining if the provided layout, orientation or layout/orientation combination requires filling the
 * entire device screen.
 *
 * @param {InAppMessageLayout} layout - message layout
 * @param {DeviceOrientation} orientation - device orientation
 * @returns {Boolean} boolean indicating whether entire screen should be filled
 */

export const shouldFillDeviceScreen = (layout: InAppMessageLayout, orientation: DeviceOrientation): boolean => {
	switch (layout) {
		case 'CAROUSEL':
		case 'FULL_SCREEN': {
			return true;
		}
		case 'MODAL': {
			return orientation === 'landscape';
		}
		case 'TOP_BANNER':
		case 'MIDDLE_BANNER':
		case 'BOTTOM_BANNER':
		default: {
			return false;
		}
	}
};

/**
 * Parse and assign appropriate message container and wrapper style from style params
 *
 * @param {MessageStylePropParams} params - message styleParams, layout, and device orientation
 * @returns {Object} resolved containerStyle and wrapperStyle
 */

export const getContainerAndWrapperStyle = ({ styleParams, layout, orientation }: MessageStylePropParams) => {
	const { defaultStyle, messageStyle, overrideStyle } = styleParams;

	const containerDefaultStyle = defaultStyle?.container ?? {};
	const containerMessageStyle = messageStyle?.container ?? {};
	const containerOverrideStyle = overrideStyle?.container ?? {};

	const wrapperDefaultStyle = defaultStyle?.componentWrapper ?? {};

	if (!shouldFillDeviceScreen(layout, orientation)) {
		return {
			componentWrapper: wrapperDefaultStyle,
			container: [containerDefaultStyle, containerMessageStyle, containerOverrideStyle],
		};
	}

	// in non-banner and landscape modal layouts container backgroundColor values should be applied as
	// componentWrapper style to ensure that the backgroundColor is applied to the entire screen
	const { backgroundColor: defaultBackgroundColor, ...restContainerDefaultStyle } = containerDefaultStyle;
	const { backgroundColor: messageBackgroundColor, ...restContainerMessageStyle } = containerMessageStyle;

	// flatten overrideStyle to access override backgroundColor
	const { backgroundColor: overrideBackgroundColor, ...restContainerOverrideStyle } =
		StyleSheet.flatten(containerOverrideStyle);

	// all non-backgroundColor container override style are applied to the container View
	const container = [restContainerDefaultStyle, restContainerMessageStyle, restContainerOverrideStyle];

	// use ternaries to prevent passing backgroundColor object with undefined or null value
	const componentWrapper: StyleProp<ViewStyle> = [
		wrapperDefaultStyle,
		defaultBackgroundColor ? { backgroundColor: defaultBackgroundColor } : {},
		messageBackgroundColor ? { backgroundColor: messageBackgroundColor } : {},
		overrideBackgroundColor ? { backgroundColor: overrideBackgroundColor } : {},
	];

	return { componentWrapper, container };
};

/**
 * Utility for extracting message payload style
 *
 * @param {InAppMessageComponentBaseProps} props - message props
 * @returns {Object} message payload specific style
 */

export const getMessageStyle = ({
	body,
	container,
	header,
	primaryButton,
	secondaryButton,
}: InAppMessageComponentBaseProps) => ({
	body: body?.style ?? {},
	container: container?.style ?? {},
	header: header?.style ?? {},
	primaryButton: primaryButton?.style ?? {},
	secondaryButton: secondaryButton?.style ?? {},
});

/**
 * Receives message styling and returns style property values for use with in-app message
 * UI components. Handles resolvement style precedence between default, payload, and custom style
 *
 * Style param resolve precedence from lowest to highest:
 *   1. defaultStyle
 *   2. messageStyle
 *   3. overrideStyle
 *
 * @param {MessageStylePropParams} params - message style params, layout, and device orientation
 * @returns {MessageStyleProps} message style props
 */

export function getMessageStyleProps({ styleParams, layout, orientation }: MessageStylePropParams): MessageStyleProps {
	// view style applied to the componentWrapper and primary container views
	const { componentWrapper, container } = getContainerAndWrapperStyle({ styleParams, layout, orientation });

	// primary and secondary button container and text style
	const primaryButton = getComponentButtonStyle({ styleParams, buttonType: 'primaryButton' });
	const secondaryButton = getComponentButtonStyle({ styleParams, buttonType: 'secondaryButton' });

	const { defaultStyle, messageStyle, overrideStyle } = styleParams;

	// image style composed of default and override style
	const image = [defaultStyle?.image, overrideStyle?.image];

	const iconButton = {
		// view style applied to icon button
		container: [defaultStyle?.iconButton, overrideStyle?.closeIconButton],
		// close icon color, only specified as an overrideStyle
		iconColor: overrideStyle?.closeIconColor,
	};

	// text style applied to message body and header respectively
	const body = [defaultStyle?.body, messageStyle?.body, overrideStyle?.body];
	const header = [defaultStyle?.header, messageStyle?.header, overrideStyle?.header];

	const { buttonsContainer, contentContainer, imageContainer, textContainer } = defaultStyle ?? {};

	const styleProps: MessageStyleProps = {
		body,
		buttonsContainer,
		componentWrapper,
		contentContainer,
		container,
		header,
		iconButton,
		image,
		imageContainer,
		primaryButton,
		secondaryButton,
		textContainer,
	};

	if (layout === 'CAROUSEL') {
		styleProps.container = [
			styleProps.container,
			// Add bottom padding for carousel page indicators
			{ paddingBottom: SPACING_EXTRA_LARGE + DEFAULT_CAROUSEL_INDICATOR_PADDING },
		];
	}

	return styleProps;
}
