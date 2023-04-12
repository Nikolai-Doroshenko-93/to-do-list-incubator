import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import TaskWithRedux from "../TaskWithRedux";
import {ReduxStoreProviderDecorator} from "../state/ReduxStoreProviderDecorator";
import {useSelector} from "react-redux";
import {AppRootStateType} from "../state/store";
import {TaskType} from "../api/todolists-api";



// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'TodoList/TaskWithRedux',
  component:TaskWithRedux,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  decorators: [ReduxStoreProviderDecorator]

} as ComponentMeta<typeof TaskWithRedux>;

const TaskCopy = () => {
  const task = useSelector<AppRootStateType, TaskType>(state => state.tasks['todolistId1'][0])

  return <TaskWithRedux todolistId={'todolistId1'} task={task}/>
}

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TaskWithRedux> = (args) => <TaskCopy/>;

export const TaskWithReduxStory = Template.bind({});




