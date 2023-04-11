import React, {ChangeEvent, useState} from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Task from "../Task";
import {action} from "@storybook/addon-actions";
import {TaskPriorities, TaskStatuses} from "../api/todolists-api";
import {v1} from "uuid";


// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'TodoList/Task',
  component: Task,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  args: {
    removeTask: action('removeTask'),
    changeTaskStatus: action('changeTaskStatus'),
    changeTaskTitle: action('changeTaskTitle'),
    todolistId: '1234dsrfew',
    task: {description: "",
      title: "Beer",
      completed: false,
      status: TaskStatuses.InProgress,
      priority: TaskPriorities.Low,
      startDate: "",
      deadline: "",
      id: v1(),
      todoListId: 'todolistId',
      order: 0,
      addedDate: ""},
  }
} as ComponentMeta<typeof Task>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

export const TaskIsNotDoneStory = Template.bind({});


export const TaskIsDoneStory = Template.bind({});

TaskIsDoneStory.args = {
  task: { description: "",
    title: "Beer",
    completed: false,
    status: TaskStatuses.InProgress,
    priority: TaskPriorities.Low,
    startDate: "",
    deadline: "",
    id: v1(),
    todoListId: 'todolistId',
    order: 0,
    addedDate: ""},
}



const Template1: ComponentStory<typeof Task> = (args) => {
  const  [task, setTask] = useState({
    description: "",
    title: "Beer",
    completed: false,
    status: TaskStatuses.InProgress,
    priority: TaskPriorities.Low,
    startDate: "",
    deadline: "",
    id: v1(),
    todoListId: 'todolistId',
    order: 0,
    addedDate: ""
  })

  function changeTaskStatus (taskId: string, isDone: boolean)  {
    setTask({description: "",
      title: "Beer",
      completed: false,
      status: TaskStatuses.InProgress,
      priority: TaskPriorities.Low,
      startDate: "",
      deadline: "",
      id: v1(),
      todoListId: 'todolistId',
      order: 0,
      addedDate: ""})
  }
  function changeTaskTitle (taskId: string, newTitle: string) {
    setTask({description: "",
      title: "Beer",
      completed: false,
      status: TaskStatuses.InProgress,
      priority: TaskPriorities.Low,
      startDate: "",
      deadline: "",
      id: v1(),
      todoListId: 'todolistId',
      order: 0,
      addedDate: ""})
  }

  return <Task
      task={task}
      removeTask={args.removeTask}
      changeTaskTitle={changeTaskTitle}
      changeTaskStatus={changeTaskStatus}
  />
};

export const TaskStory = Template1.bind({});

TaskStory.args = {
  removeTask: action('remove task')
}