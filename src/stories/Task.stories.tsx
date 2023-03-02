import React, {ChangeEvent, useState} from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Task from "../Task";
import {action} from "@storybook/addon-actions";


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
    task: {id: 'afewqrewq', title: 'JS', isDone: false},
  }
} as ComponentMeta<typeof Task>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

export const TaskIsNotDoneStory = Template.bind({});


export const TaskIsDoneStory = Template.bind({});

TaskIsDoneStory.args = {
  task: {id: 'afewqrewq', title: 'React', isDone: true},
}



const Template1: ComponentStory<typeof Task> = (args) => {
  const  [task, setTask] = useState({id: 'aaa', title: 'TypeScript', isDone: false})

  function changeTaskStatus (taskId: string, isDone: boolean)  {
    setTask({id: 'aaa', title: 'TypeScript', isDone: !task.isDone})
  }
  function changeTaskTitle (taskId: string, newTitle: string) {
    setTask({id: 'aaa', title: newTitle, isDone: false})
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