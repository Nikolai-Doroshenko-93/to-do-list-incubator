import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import AppWithRedux from "../app/AppWithRedux";
import {action} from "@storybook/addon-actions";
import {Provider} from "react-redux";
import {store} from "../app/store";
import {ReduxStoreProviderDecorator} from "../state/ReduxStoreProviderDecorator";


// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'TodoList/AppWithRedux',
  component:AppWithRedux,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  decorators: [ReduxStoreProviderDecorator]

} as ComponentMeta<typeof AppWithRedux>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AppWithRedux> = (args) => <AppWithRedux/>;


export const AppWithReduxStory = Template.bind({});




