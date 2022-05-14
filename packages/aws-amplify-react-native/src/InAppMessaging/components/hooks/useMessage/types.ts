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

export type MessageButtonProps = Omit<InAppMessageButton, 'action' | 'url'> & { onAction: () => void };

// omit payload button props, replace with MessageButtonProps
export type MessageContentProps = Omit<InAppMessageContent, 'primaryButton' | 'secondaryButton'> & {
	primaryButton?: MessageButtonProps;
	secondaryButton?: MessageButtonProps;
};

// props common to each Message component
type MessageCommonProps<Style> = {
	layout: InAppMessageLayout;
	onClose?: () => void;
	onDisplay?: () => void;
	style?: Style;
};

export type MessageComponentPosition = 'bottom' | 'middle' | 'top' | null;

// Banner requires a `position` prop
export type BannerMessageCommonProps<Style> = MessageCommonProps<Style> &
	MessageContentProps & { position?: MessageComponentPosition };
// Carousel message nests content props in its `data` prop
export type CarouselMessageCommonProps<Style> = MessageCommonProps<Style> & { data?: MessageContentProps[] };
export type FullScreenMessageCommonProps<Style> = MessageCommonProps<Style> & MessageContentProps;
export type ModalMessageCommonProps<Style> = MessageCommonProps<Style> & MessageContentProps;

type BannerMessage<Style> = (props: BannerMessageCommonProps<Style>) => JSX.Element;
type CarouselMessage<Style> = (props: CarouselMessageCommonProps<Style>) => JSX.Element;
type FullScreenMessage<Style> = (props: FullScreenMessageCommonProps<Style>) => JSX.Element;
type ModalMessage<Style> = (props: ModalMessageCommonProps<Style>) => JSX.Element;

export type MessageComponents<Style> = {
	BannerMessage: BannerMessage<Style>;
	CarouselMessage: CarouselMessage<Style>;
	FullScreenMessage: FullScreenMessage<Style>;
	ModalMessage: ModalMessage<Style>;
};

export type MessageComponentStyles<Style> = {
	bannerMessage: Style;
	carouselMessage: Style;
	fullScreenMessage: Style;
	modalMessage: Style;
};

export type OnMessageAction = (params: { action: InAppMessageAction; url?: string }) => void;

export interface UseMessageProps<Style> {
	components: MessageComponents<Style>;
	onMessageAction: OnMessageAction;
	styles: MessageComponentStyles<Style>;
}

type MessageComponent<Style> =
	| BannerMessage<Style>
	| CarouselMessage<Style>
	| FullScreenMessage<Style>
	| ModalMessage<Style>;

type MessageProps<Style> =
	| BannerMessageCommonProps<Style>
	| CarouselMessageCommonProps<Style>
	| FullScreenMessageCommonProps<Style>
	| ModalMessageCommonProps<Style>;

export type UseMessage<Style> = { Component: MessageComponent<Style>; props: MessageProps<Style> };
